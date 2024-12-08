import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import * as d3 from 'd3';
import {ActivatedRoute} from '@angular/router';
import {ProjectDatasourceImpl} from '../../service/project/datasource/project.datasource.impl';
import {ProjectModel} from '../../service/project/model/project.model';
import {TaskModel} from '../../service/project/model/task.model';
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-detalle-proyecto',
    standalone: true,
    imports: [
        InputTextModule,
        FormsModule,
        InputTextareaModule,
        ButtonModule,
        RippleModule,
        NgIf
    ],
    templateUrl: './detalle-proyecto.component.html',
    styleUrls: ['./detalle-proyecto.component.scss']
})
export class DetalleProyectoComponent implements AfterViewInit {
    nombre: string;
    descripcionProyecto: string;
    fechaInicio: string;
    unidadTiempo: string;
    hrsTrabajoPorDia: string;
    id: number | null = null;
    taskData: TaskModel[] = []
    taskSelected: number = 0

    @ViewChild('chartContainer') chartContainer!: ElementRef;

    // Variables destinadas a la ventana de detalles de la tarea
    idTarea: string;
    accionTarea: string;
    inicioProximoTarea: string;
    tiempoEsperadoTarea: string;
    finalProximoTarea: string;
    inicioLejanoTarea: string;
    finalLejanoTarea: string;
    holguraTarea: string;
    fechaInicioTarea: string;
    fechaFinalTarea: string;
    estadoTarea: string;
    responsables: string;

    ngAfterViewInit() {

        this.buscarProyectoPorId().then(proyecto => {

            this.nombre = proyecto.titulo
            this.descripcionProyecto = proyecto.descripcion
            this.fechaInicio = this.formatFecha(proyecto.fechaInicio)
            this.unidadTiempo = proyecto.unidadTiempo
            this.hrsTrabajoPorDia = proyecto.horasTrabajoDia.toString()

            this.taskData = proyecto.tareas
            this.createChart(this.taskData)
        })

    }

    constructor(
        private route: ActivatedRoute,
        private projectDatasource: ProjectDatasourceImpl
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id = Number(params.get('id'));
        });
    }

    taskCard(): TaskModel {

        const selectedTask = this.taskData.find((task) => task.numeroTarea === this.taskSelected);

        if (!selectedTask) {
            return undefined;
        }

        this.setTaskProperties(selectedTask);
        return selectedTask;
    }

    // Método para asignar propiedades de la tarea
    private setTaskProperties(selectedTask: TaskModel): void {
        this.idTarea = selectedTask.numeroTarea.toString();
        this.accionTarea = selectedTask.accion;
        this.inicioProximoTarea = selectedTask.inicioTemprano.toString();
        this.tiempoEsperadoTarea = selectedTask.tiempoProbable.toString();
        this.finalProximoTarea = selectedTask.finalTemprano.toString();
        this.inicioLejanoTarea = selectedTask.inicioTardio.toString();
        this.finalLejanoTarea = selectedTask.finalTardio.toString();
        this.holguraTarea = selectedTask.holgura.toString();
        this.fechaInicioTarea = this.formatFecha(selectedTask.fechaInicio);
        this.fechaFinalTarea = this.formatFecha(selectedTask.fechaFinal);
        this.estadoTarea = selectedTask.estado;
        this.responsables = this.getResponsables(selectedTask);
    }

    // Método para obtener responsables
    private getResponsables(selectedTask: TaskModel): string {
        if (!selectedTask?.responsables || selectedTask.responsables.length === 0) {
            return 'Sin responsables asignados';
        }

        // Generar el texto con saltos de línea
        return selectedTask.responsables
            .map((responsable) => `- ${responsable.nombre}`)
            .join('\n');
    }

    private formatFecha(fechaISO: string): string {
        if (!fechaISO) return '';

        const fecha = new Date(fechaISO);
        return new Intl.DateTimeFormat('es-ES', {
            weekday: 'long', // Día de la semana (lunes, martes, etc.)
            day: 'numeric', // Día del mes
            month: 'long', // Mes completo (enero, febrero, etc.)
            year: 'numeric', // Año completo
        }).format(fecha);
    }

    async buscarProyectoPorId(): Promise<ProjectModel> {

        const response = await this.projectDatasource.buscarProyectoPorId(this.id)

        if (response._tag === 'Right'){
            return response.right
        }

        if (response._tag === 'Left'){
            return undefined
        }

        return undefined
    }

    private createChart(data: TaskModel[]): void {

        const links = [];
        data.forEach((d) => {
            if (d.tareasDependencias.length > 0) {
                d.tareasDependencias.forEach((targetId: number) => {
                    links.push({source: d.numeroTarea, target: targetId});
                });
            }
        });

        const width = 800;
        const height = 600;
        const radius = 30;

        const svg = d3
            .select(this.chartContainer.nativeElement)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const simulation = d3
            .forceSimulation(data)
            .force(
                'link',
                d3.forceLink(links).id((d: TaskModel) => d.numeroTarea).distance(100)
            )
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg
            .selectAll('.link')
            .data(links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', '#121212')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 2);

        const node = svg
            .selectAll('.node')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'node')
            .call(
                d3
                    .drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended)
            );

        node
            .append('circle')
            .attr('r', radius)
            .attr('fill', (d: TaskModel) => d.color);

        node
            .append('text')
            .attr('dy', '.35em')
            .text((d: any) => d.numeroTarea)
            .attr('font-size', '12px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'white');

        // Tooltip
        const tooltip = d3
            .select(this.chartContainer.nativeElement)
            .append('div')
            .attr('class', 'tooltip');

        node
            .on('mouseover', (event, d: TaskModel) => {
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 1);
                tooltip
                    .html(
                        `<strong>Tarea:</strong> ${d.numeroTarea}<br>
              <strong>Inicio cercano:</strong> ${d.inicioTemprano}<br>
              <strong>Fin cercano:</strong> ${d.finalTemprano}<br>
              <strong>Duracion:</strong> ${d.duracion}<br>
              <strong>Inicio lejano:</strong> ${d.inicioTardio}<br>
              <strong>Fin lejano:</strong> ${d.finalTardio}<br>
              <strong>Holgura:</strong> ${d.holgura}`
                    )
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY + 10}px`);
            })
            .on('mousemove', (event) => {
                tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY + 10}px`);
            })
            .on('mouseout', () => {
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 0);
            })
            .on('click', (event, d: TaskModel) => {
                console.log(`Tarea seleccionada: ${d.numeroTarea}`);
                this.taskSelected = d.numeroTarea
                this.taskCard()
            });

        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            node.attr(
                'transform',
                (d: any) => `translate(${d.x},${d.y})`
            );
        });

        function dragstarted(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: any, d: any) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }

    borrarProyecto() {
        // Lógica para borrar proyecto
    }
}

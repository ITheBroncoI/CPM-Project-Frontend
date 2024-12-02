import {Component, ElementRef, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import * as d3 from 'd3';
import {ActivatedRoute} from '@angular/router';
import {ProjectDatasourceImpl} from '../../service/project/datasource/project.datasource.impl';
import {LocalStorageService} from '../../service/localStorage/localStorageService';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ProjectModel} from '../../service/project/model/project.model';
import {TaskModel} from '../../service/project/model/task.model';
import {ResponsibleModel} from '../../service/project/model/responsible.model';
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
    descripcionProyecto: string;
    fechaInicio: string;
    unidadTiempo: string;
    hrsTrabajoPorDia: string;
    id: number | null = null;
    Tarea: TaskModel | undefined;
    endpoints: ProjectDatasourceImpl;
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
    responsables: string[];

    ngAfterViewInit() {
        this.buscarProyectoPorId().then(data => {
            const tasks = data.tareas

            const color_node = '#eeeeee'
            const color_critical = '#8b0000'
            const nodes = tasks.map((task) => {
                return {
                    num_tarea: task.numeroTarea,
                    color: task.holgura == 0 ? color_critical : color_node,
                    inicio_cercano: task.inicioTemprano,
                    fin_cercano: task.finalTemprano,
                    duracion: task.duracion,
                    inicio_lejano: task.inicioTardio,
                    fin_lejano: task.finalTardio,
                    holgura: task.holgura,
                    target: task.tareasDependencias
                }
            })


            this.createChart(nodes);
        });
    }

    constructor(private route: ActivatedRoute, private http: HttpClient) {
        this.endpoints = new ProjectDatasourceImpl(new LocalStorageService(), this.http);
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id = Number(params.get('id'));
            console.log('ID recuperado:', this.id);
        });
    }

    taskCard(): TaskModel {
        if (this.taskSelected === 0) {
            return undefined;
        }

        const selectedTask = this.taskData.find((task) => task.numeroTarea === this.taskSelected);

        if (!selectedTask) {
            return undefined;
        }

        this.setTaskProperties(selectedTask);
        return selectedTask;
    }

    // Método para asignar propiedades de la tarea
    private setTaskProperties(selectedTask: TaskModel): void {
        this.idTarea = selectedTask.idTarea.toString();
        this.accionTarea = selectedTask.accion;
        this.inicioProximoTarea = selectedTask.inicioTemprano.toString();
        this.tiempoEsperadoTarea = selectedTask.tiempoProbable.toString();
        this.finalProximoTarea = selectedTask.finalTemprano.toString();
        this.inicioLejanoTarea = selectedTask.inicioTardio.toString();
        this.finalLejanoTarea = selectedTask.finalTardio.toString();
        this.holguraTarea = selectedTask.holgura.toString();
        this.fechaInicioTarea = selectedTask.fechaInicio;
        this.fechaFinalTarea = selectedTask.fechaFinal;
        this.estadoTarea = selectedTask.estado;
        this.responsables = this.getResponsables(selectedTask);
    }

    // Método para obtener responsables
    private getResponsables(selectedTask: TaskModel): string[] | null {
        return selectedTask?.responsables ?
            selectedTask.responsables.map(responsable => responsable.responsable) :
            null;
    }


    async buscarProyectoPorId(): Promise<ProjectModel> {

        // return this.endpoints.buscarProyectoPorId(this.id)
        // Creando los responsables
        const responsable1 = new ResponsibleModel({id: 1, responsable: "Juan", nombre: "Juan Pérez"});
        const responsable2 = new ResponsibleModel({id: 2, responsable: "Ana", nombre: "Ana Gómez"});
        const responsable3 = new ResponsibleModel({id: 3, responsable: "Carlos", nombre: "Carlos López"});

        // Creando las tareas
        const task1 = new TaskModel({
            idTarea: 1,
            numeroTarea: 1,
            accion: "Definir requisitos",
            tiempoOptimista: 5,
            tiempoProbable: 7,
            tiempoPesimista: 9,
            inicioTemprano: 0,
            duracion: 7,
            finalTemprano: 7,
            inicioTardio: 0,
            finalTardio: 7,
            holgura: 0,
            fechaInicio: "2024-12-01",
            fechaFinal: "2024-12-07",
            notas: "Revisión inicial",
            estado: "Pendiente",
            responsables: [responsable1],
            tareasDependencias: []
        });

        const task2 = new TaskModel({
            idTarea: 2,
            numeroTarea: 2,
            accion: "Desarrollo de interfaz",
            tiempoOptimista: 3,
            tiempoProbable: 5,
            tiempoPesimista: 8,
            inicioTemprano: 7,
            duracion: 5,
            finalTemprano: 12,
            inicioTardio: 7,
            finalTardio: 12,
            holgura: 0,
            fechaInicio: "2024-12-07",
            fechaFinal: "2024-12-12",
            notas: "Desarrollo del frontend",
            estado: "Pendiente",
            responsables: [responsable2],
            tareasDependencias: [1]
        });

        const task3 = new TaskModel({
            idTarea: 3,
            numeroTarea: 3,
            accion: "Backend API",
            tiempoOptimista: 6,
            tiempoProbable: 8,
            tiempoPesimista: 10,
            inicioTemprano: 12,
            duracion: 8,
            finalTemprano: 20,
            inicioTardio: 12,
            finalTardio: 20,
            holgura: 0,
            fechaInicio: "2024-12-12",
            fechaFinal: "2024-12-20",
            notas: "Desarrollo del servidor",
            estado: "Pendiente",
            responsables: [responsable3],
            tareasDependencias: [2]
        });

        const task4 = new TaskModel({
            idTarea: 4,
            numeroTarea: 4,
            accion: "Pruebas unitarias",
            tiempoOptimista: 2,
            tiempoProbable: 4,
            tiempoPesimista: 6,
            inicioTemprano: 20,
            duracion: 4,
            finalTemprano: 24,
            inicioTardio: 20,
            finalTardio: 24,
            holgura: 11,
            fechaInicio: "2024-12-20",
            fechaFinal: "2024-12-24",
            notas: "Pruebas del sistema backend",
            estado: "Pendiente",
            responsables: [responsable1],
            tareasDependencias: [3]
        });


        // Crear el proyecto y asignar las tareas
        const project = new ProjectModel({
            idProyecto: 1,
            titulo: "Desarrollo de Plataforma",
            descripcion: "Plataforma para gestión de proyectos",
            fechaInicio: "2024-12-01",
            unidadTiempo: "Días",
            horasTrabajoDia: 8,
            numDecimales: 2,
            estado: "En progreso",
            tareas: [task1, task2, task3, task4]
        });
        this.taskData = project.tareas
        return project

    }

    private createChart(data: any[]): void {
        const links = [];
        data.forEach((d) => {
            if (d.target.length > 0) {
                d.target.forEach((targetId: number) => {
                    links.push({source: d.num_tarea, target: targetId});
                });
            }
        });

        const width = 800;
        const height = 400;
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
                d3.forceLink(links).id((d: any) => d.num_tarea).distance(150)
            )
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg
            .selectAll('.link')
            .data(links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', '#999')
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
            .attr('fill', (d: any) => d.color);

        node
            .append('text')
            .attr('dy', '.35em')
            .text((d: any) => d.num_tarea)
            .attr('font-size', '12px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'black');

        // Tooltip
        const tooltip = d3
            .select(this.chartContainer.nativeElement)
            .append('div')
            .attr('class', 'tooltip');

        node
            .on('mouseover', (event, d: any) => {
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 1);
                tooltip
                    .html(
                        `<strong>Tarea:</strong> ${d.num_tarea}<br>
              <strong>Inicio cercano:</strong> ${d.inicio_cercano}<br>
              <strong>Fin cercano:</strong> ${d.fin_cercano}<br>
              <strong>Duracion:</strong> ${d.duracion}<br>
              <strong>Inicio lejano:</strong> ${d.inicio_lejano}<br>
              <strong>Fin lejano:</strong> ${d.fin_lejano}<br>
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
            .on('click', (event, d: any) => {
                console.log(`Tarea seleccionada: ${d.num_tarea}`);
                this.taskSelected = d.num_tarea
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

    descargarExcel() {
        // Lógica de descarga
    }

    borrarProyecto() {
        // Lógica para borrar proyecto
    }
}

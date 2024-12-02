import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import * as d3 from 'd3';


@Component({
  selector: 'app-detalle-proyecto',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    InputTextareaModule,
    ButtonModule,
    RippleModule
  ],
  templateUrl: './detalle-proyecto.component.html',
  styleUrls: ['./detalle-proyecto.component.scss']
})
export class DetalleProyectoComponent implements AfterViewInit {
  descripcionProyecto: string;
  fechaInicio: string;
  unidadTiempo: string;
  hrsTrabajoPorDia: string;

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  ngAfterViewInit() {
    this.buscarProyectoPorId().then((data) => {
      this.createChart(data);
    });
  }

  
  async buscarProyectoPorId(): Promise<any[]> {
    return [
      { id: 1, tarea: "Inicio", color: "#00FF00", inicio_cercano: 1, fin_cercano: 2, holgura1: 1, inicio_lejano: 4, fin_lejano: 5, holgura2: 1, target: [2, 3] },
      { id: 2, tarea: "Proceso 1", color: "#80FF80", inicio_cercano: 2, fin_cercano: 4, holgura1: 2, inicio_lejano: 6, fin_lejano: 8, holgura2: 2, target: [] },
      { id: 3, tarea: "Proceso 2", color: "#BFFFBF", inicio_cercano: 4, fin_cercano: 6, holgura1: 2, inicio_lejano: 8, fin_lejano: 10, holgura2: 2, target: [4] },
      { id: 4, tarea: "Proceso 3", color: "#DFFFE0", inicio_cercano: 2, fin_cercano: 4, holgura1: 2, inicio_lejano: 6, fin_lejano: 8, holgura2: 2, target: [5] },
      { id: 5, tarea: "Fin", color: "#FFFFFF", inicio_cercano: 4, fin_cercano: 6, holgura1: 2, inicio_lejano: 8, fin_lejano: 10, holgura2: 2, target: [] }
    ];
  }

  private createChart(data: any[]): void {
    const links = [];
    data.forEach((d) => {
      if (d.target.length > 0) {
        d.target.forEach((targetId: number) => {
          links.push({ source: d.id, target: targetId });
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
        d3.forceLink(links).id((d: any) => d.id).distance(150)
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
      .text((d: any) => d.tarea)
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
            `<strong>Tarea:</strong> ${d.tarea}<br>
              <strong>Inicio cercano:</strong> ${d.inicio_cercano}<br>
              <strong>Fin cercano:</strong> ${d.fin_cercano}<br>
              <strong>Holgura 1:</strong> ${d.holgura1}<br>
              <strong>Inicio lejano:</strong> ${d.inicio_lejano}<br>
              <strong>Fin lejano:</strong> ${d.fin_lejano}<br>
              <strong>Holgura 2:</strong> ${d.holgura2}`
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

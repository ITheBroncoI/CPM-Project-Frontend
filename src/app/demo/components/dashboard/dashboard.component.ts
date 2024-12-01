import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatePipe, NgStyle} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {RouterLink} from "@angular/router";
import {Table, TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/dialog";
import {FileUpload, FileUploadEvent, FileUploadModule} from "primeng/fileupload";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        NgStyle,
        ButtonModule,
        RippleModule,
        RouterLink,
        TableModule,
        DatePipe,
        InputTextModule,
        InputTextareaModule,
        FormsModule,
        DialogModule,
        FileUploadModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    // Variables relacionadas a la tabla de proyectos
    tasks: any[] = []; // Aquí guardaremos las tareas o proyectos
    @ViewChild('filter') filter!: ElementRef;
    loading: boolean = true; // Estado de carga

    // Variables relacionadas a la pestaña de importación de proyectos
    visible: boolean = false;
    tituloProyecto: string;
    descripcionProyecto: string;

    // Referencia al componente p-fileUpload
    @ViewChild('fileUpload') fileUpload: FileUpload | undefined;

    ngOnInit() {
        // Simulación de la carga de datos para las tareas
        this.tasks = [
            {
                folio: '001',
                titulo: 'Construcción',
                descripcion: 'Planificación de obra',
                fechaInicio: new Date('2024-10-1'),
                unidadTiempo: 'Días',
                hrsTrabajo: 8
            },
            {
                folio: '002',
                titulo: 'Software',
                descripcion: 'Desarrollo de sistema',
                fechaInicio: new Date('2024-11-5'),
                unidadTiempo: 'Días',
                hrsTrabajo: 8
            },
            {
                folio: '003',
                titulo: 'Evento',
                descripcion: 'Organización de evento',
                fechaInicio: new Date('2024-11-12'),
                unidadTiempo: 'Horas',
                hrsTrabajo: '-'
            },
            {
                folio: '004',
                titulo: 'Diseño',
                descripcion: 'Creación de mockups',
                fechaInicio: new Date('2024-12-7'),
                unidadTiempo: 'Horas',
                hrsTrabajo: '-'
            },
        ];

        this.loading = false;
    }

    // Método para aplicar el filtro global
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    // Método para limpiar los filtros
    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    abrirPestanaImportacion() {
        this.visible = true
    }

    cerrarPestanaImportacion() {
        this.visible = false;
        this.tituloProyecto = '';
        this.descripcionProyecto = '';
        // Limpiar la selección de archivo
        if (this.fileUpload) {
            this.fileUpload.clear();  // Esto elimina el archivo seleccionado
        }
    }

    importarProyecto() {
        // Implementacion de logica al momento de importar el objeto
    }

    subirArchivo($event: FileUploadEvent) {
        // Implementacion al momento de seleccionar archivo
        console.log("PRUEBA - TEST");
    }
}

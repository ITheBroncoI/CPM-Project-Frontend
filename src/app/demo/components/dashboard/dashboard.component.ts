import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatePipe, NgStyle} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Table, TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/dialog";
import {FileUpload, FileUploadEvent, FileUploadModule} from "primeng/fileupload";
import {LayoutService} from "../../../layout/service/app.layout.service";
import {PrimeNGConfig} from "primeng/api";
import {ProjectDatasourceImpl} from '../../service/project/datasource/project.datasource.impl';
import {ProjectModel} from '../../service/project/model/project.model';

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

    projects: ProjectModel[] = []

    constructor(
        public layoutService: LayoutService,
        private readonly primeNGConfig: PrimeNGConfig,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private projectDatasource: ProjectDatasourceImpl,
    ) {}

    // Variables relacionadas a la tabla de proyectos
    @ViewChild('filter') filter!: ElementRef;
    loading: boolean = true; // Estado de carga

    // Variables relacionadas a la pestaña de importación de proyectos
    visible: boolean = false;
    tituloProyecto: string;
    descripcionProyecto: string;

    // Referencia al componente p-fileUpload
    @ViewChild('fileUpload') fileUpload: FileUpload | undefined;

    async ngOnInit() {
        this.primeNGConfig.ripple = true;

        const response = await this.projectDatasource.buscarProyectos()

        if (response._tag === 'Right') {
            this.projects = response.right
        }

        if (response._tag === 'Left') {

        }

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

    seleccionarProyecto(event: any) {
        this.router.navigate([`/detalleProyecto/${event.data.idProyecto}`], { relativeTo: this.route });
    }
}

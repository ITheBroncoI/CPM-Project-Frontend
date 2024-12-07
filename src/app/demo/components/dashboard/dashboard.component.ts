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
import {FileUpload, FileUploadModule} from "primeng/fileupload";
import {LayoutService} from "../../../layout/service/app.layout.service";
import {PrimeNGConfig} from "primeng/api";
import {ProjectDatasourceImpl} from '../../service/project/datasource/project.datasource.impl';
import {ProjectModel} from '../../service/project/model/project.model';
import {ProjectRequestModel} from "../../service/project/model/project-request.model";

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
    tituloProyecto: string = '';
    descripcionProyecto: string = '';
    archivoBase64: string | null = null;

    constructor(
        public layoutService: LayoutService,
        private readonly primeNGConfig: PrimeNGConfig,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly projectDatasource: ProjectDatasourceImpl,
    ) {}

    // Variables relacionadas a la tabla de proyectos
    @ViewChild('filter') filter!: ElementRef;
    loading: boolean = true; // Estado de carga

    // Variables relacionadas a la pestaña de importación de proyectos
    visible: boolean = false;

    // Referencia al componente p-fileUpload
    @ViewChild('fileUpload') fileUpload: FileUpload | undefined;

    async ngOnInit() {
        this.primeNGConfig.ripple = true;

        const response = await this.projectDatasource.buscarProyectos()

        if (response._tag === 'Right') {
            this.projects = response.right
        }

        if (response._tag === 'Left') {
            console.log(response._tag)
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

    async importarProyecto() {
        if (!this.archivoBase64) {
            console.error('No se ha cargado ningún archivo.');
            return;
        }

        console.log('Creando proyecto...');

        const project = new ProjectRequestModel({
            titulo: this.tituloProyecto,
            descripcion: this.descripcionProyecto,
            file: this.archivoBase64
        });

        const response = await this.projectDatasource.nuevoProyecto(project);

        if (response._tag === 'Right') {
            console.log('Proyecto creado exitosamente');
        }

        if (response._tag === 'Left') {
            console.error('Error al crear el proyecto:', response.left);
        }
    }

    subirArchivo(event: any) {
        const file = event.files[0];

        if (!file) {
            console.error('No se seleccionó un archivo.');
            return;
        }

        if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
            console.error('El archivo debe ser de tipo Excel (.xls o .xlsx)');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const archivoCargado = reader.result as string;

            // Busca el índice donde termina 'base64,'
            const indiceInicio = archivoCargado.indexOf('base64,') + 'base64,'.length;

            // Corta la cadena desde después de 'base64,'
            if (indiceInicio !== -1) {
                this.archivoBase64 = archivoCargado.substring(indiceInicio);
                console.log('Archivo cargado correctamente (contenido ajustado):', this.archivoBase64);
            }
        };

        reader.onerror = (error) => {
            console.error('Error al leer el archivo:', error);
        };

        reader.readAsDataURL(file);
    }


    async seleccionarProyecto(event: any) {
        await this.router.navigate([`/detalleProyecto/${event.data.idProyecto}`], { relativeTo: this.route });
    }
}

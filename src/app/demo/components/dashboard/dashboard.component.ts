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
import {MessageService, PrimeNGConfig} from "primeng/api";
import {ProjectDatasourceImpl} from '../../service/project/datasource/project.datasource.impl';
import {ProjectModel} from '../../service/project/model/project.model';
import {ProjectRequestModel} from "../../service/project/model/project-request.model";
import {ToastModule} from "primeng/toast";
import {BadRequestException, InternalServerException} from "../../exceptions/exception";

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
        FileUploadModule,
        ToastModule
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
        private readonly messageService: MessageService,
        private readonly projectDatasource: ProjectDatasourceImpl,
    ) {
    }

    // Variables relacionadas a la tabla de proyectos
    @ViewChild('filter') filter!: ElementRef;
    loading: boolean = true; // Estado de carga

    // Variables relacionadas a la pestaña de importación de proyectos
    visible: boolean = false;

    // Referencia al componente p-fileUpload
    @ViewChild('fileUpload') fileUpload: FileUpload | undefined;

    async ngOnInit() {
        this.primeNGConfig.ripple = true;
        await this.buscarProyectos()
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
        this.archivoBase64 = null
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    async importarProyecto() {

        if (!this.validarArchivo()){
            return
        }

        if (!this.archivoBase64) {
            return;
        }

        const project = new ProjectRequestModel({
            titulo: this.tituloProyecto,
            descripcion: this.descripcionProyecto,
            file: this.archivoBase64
        });

        const response = await this.projectDatasource.nuevoProyecto(project);

        if (response._tag === 'Right') {
            this.mensageAlerta('Por favor, recargue la lista de proyectos', 'Proyecto creado con éxito', 'success')
            await this.buscarProyectos()
            this.cerrarPestanaImportacion()
        }

        if (response._tag === 'Left') {

            const ex = response.left
            if (ex instanceof BadRequestException) {

                let messageError = 'Ocurrió un error al procesar el archivo. Por favor, intenta nuevamente con una plantilla válida.'

                if (ex.message != '') {
                    messageError = ex.message
                }

                this.mensageAlerta(messageError, 'Formato no válido')
            }

            if (ex instanceof InternalServerException) {
                this.mensageAlerta('Hubo un error interno en el servidor. Por favor, intente nuevamente más tarde', 'Error interno del servidor', 'error')
            }

        }
    }

    subirArchivo() {
        const file = this.fileUpload.files[0];

        if (!file) {
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

    validarArchivo(): boolean {
        if (!this.tituloProyecto || this.tituloProyecto.trim() === '') {
            this.mensageAlerta('Por favor, asegúrate de ingresar un título antes de continuar', 'Título obligatorio')
            return false
        }

        if (this.tituloProyecto.length <= 12) {
            this.mensageAlerta('El título requiere al menos 12 caracteres', 'Título obligatorio')
            return false
        }

        if (!this.descripcionProyecto) {
            this.descripcionProyecto = ''
        }

        if (!this.archivoBase64 || this.archivoBase64 === ''){
            this.mensageAlerta('No se detectó ningún archivo cargado. Por favor, selecciona un archivo para proceder.', 'Plantilla de excel requerida')
            return false
        }

        return true
    }

    mensageAlerta(message: string, title: string = 'Alerta', type: string = 'warn',) {
        this.messageService.add({
            severity: type,
            summary: title,
            detail: message
        })
    }

    async buscarProyectos() {
        const response = await this.projectDatasource.buscarProyectos()

        if (response._tag === 'Right') {
            this.projects = response.right
        }

        if (response._tag === 'Left') {
            this.mensageAlerta('Hubo un error interno en el servidor. Por favor, intente nuevamente más tarde', 'error', 'Error interno del servidor')
        }
    }

}

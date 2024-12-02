import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { ProjectModel } from "../model/project.model";
import { ProjectDatasource } from "./project.datasource";
import { ProjectEndpoints } from "./project.endpoints";
import { firstValueFrom } from "rxjs";
import { plainToInstance } from "class-transformer";
import { LocalStorageService } from "../../localStorage/localStorageService";
import { BadRequestException, ForbiddenException, InternalServerException, NotFoundException } from "src/app/demo/exceptions/exception";

export class ProjectDatasourceImpl implements ProjectDatasource {

    headers = new HttpHeaders({
        "Authorization": `Bearer ${this.local.getToken()}`,
        "Content-Type": "application/json"
    });

    constructor(
        private readonly local: LocalStorageService,
        private readonly http: HttpClient
    ) {}

    async nuevoProyecto(archivoBase64: string): Promise<boolean> {
        const headers = new HttpHeaders({
            "Authorization": `Bearer ${this.local.getToken()}`,
            "Content-Type": "application/json",
            "File": archivoBase64
        });

        const endpoint = ProjectEndpoints.nuevoProyecto;

        try {
            const response = await firstValueFrom(
                this.http.post(endpoint, {}, {headers: headers})
            )

            return true;
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 400) throw new BadRequestException();
                if (error.status === 403) throw new ForbiddenException();
                if (error.status === 404) throw new NotFoundException();
                if (error.status === 500) throw new InternalServerException();
            }
            return false;
        }
    }

    async buscarProyectos(): Promise<ProjectModel[]> {  
        const endpoint = ProjectEndpoints.buscarProyectos;

        try {
            const response = await firstValueFrom(
                this.http.get<any[]>(endpoint, {headers: this.headers})
            )

            const projects = response.map(project => {
                return plainToInstance(ProjectModel, project)
            });

            return projects
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 400) throw new BadRequestException();
                if (error.status === 403) throw new ForbiddenException();
                if (error.status === 404) throw new NotFoundException();
                if (error.status === 500) throw new InternalServerException();
            }
            return [];
        }
    }

    async buscarProyectoPorId(idProyecto: number): Promise<ProjectModel> {
        const endpoint = ProjectEndpoints.buscarProyectoPorId;

        try {
            const response = await firstValueFrom(
                this.http.get(endpoint, {headers: this.headers})
            )

            return plainToInstance(ProjectModel, response)
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 400) throw new BadRequestException();
                if (error.status === 403) throw new ForbiddenException();
                if (error.status === 404) throw new NotFoundException();
                if (error.status === 500) throw new InternalServerException();
            }

            throw new Error('Error')
        }
    }
}
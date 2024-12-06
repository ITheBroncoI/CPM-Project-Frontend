import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { ProjectModel } from "../model/project.model";
import { ProjectDatasource } from "./project.datasource";
import { ProjectEndpoints } from "./project.endpoints";
import {catchError, firstValueFrom, map, of} from "rxjs";
import {instanceToPlain, plainToInstance} from "class-transformer";
import { LocalStorageService } from "../../localStorage/local-storage.service";
import { BadRequestException, ForbiddenException, InternalServerException, NotFoundException } from "src/app/demo/exceptions/exception";
import {Injectable} from "@angular/core";
import {ProjectRequestModel} from "../model/project-request.model";
import {Either, left, right} from "fp-ts/Either";

@Injectable({
    providedIn: 'root'
})
export class ProjectDatasourceImpl implements ProjectDatasource {

    headers = new HttpHeaders({
        "Authorization": `Bearer ${this.local.getToken()}`,
        "Content-Type": "application/json"
    });

    constructor(
        private readonly local: LocalStorageService,
        private readonly http: HttpClient
    ) {}

    async nuevoProyecto(request: ProjectRequestModel): Promise<Either<Error, boolean>> {

        const endpoint = ProjectEndpoints.nuevoProyecto;

        return firstValueFrom(
            this.http
                .post(endpoint, instanceToPlain(request), { headers: this.headers })
                .pipe(
                    map(() => {
                        return right(true);
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 400) return of(left(new BadRequestException()))
                        if (error.status === 403) return of(left(new ForbiddenException()))
                        if (error.status === 500) return of(left(new InternalServerException()))

                        return of(left(new Error('Error desconocido')));
                    })
                )
        )
    }

    async buscarProyectos(): Promise<Either<Error, ProjectModel[]>> {

        const endpoint = ProjectEndpoints.buscarProyectos;

        return firstValueFrom(
            this.http
                .get<any[]>(endpoint, { headers: this.headers })
                .pipe(
                    map((response: any[]) => {
                        const projects = response.map(project => plainToInstance(ProjectModel, project));
                        return right(projects);
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 400) return of(left(new BadRequestException()));
                        if (error.status === 403) return of(left(new ForbiddenException()));
                        if (error.status === 404) return of(left(new NotFoundException()));
                        if (error.status === 500) return of(left(new InternalServerException()));

                        return of(left(new Error('Error desconocido')));
                    })
                )
        )
    }

    async buscarProyectoPorId(idProyecto: number): Promise<Either<Error, ProjectModel>> {
        const endpoint = `${ProjectEndpoints.buscarProyectoPorId}${idProyecto}`;

        return firstValueFrom(
            this.http
                .get(endpoint, { headers: this.headers })
                .pipe(
                    map((response: any) => {
                        const project = plainToInstance(ProjectModel, response);
                        return right(project);
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 400) return of(left(new BadRequestException()));
                        if (error.status === 403) return of(left(new ForbiddenException()));
                        if (error.status === 404) return of(left(new NotFoundException()));
                        if (error.status === 500) return of(left(new InternalServerException()));

                        return of(left(new Error('Error desconocido')));
                    })
                )
        )
    }
}

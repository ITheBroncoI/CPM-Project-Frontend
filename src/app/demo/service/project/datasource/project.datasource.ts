import {ProjectModel} from "../model/project.model";
import {Either} from "fp-ts/Either";
import {ProjectRequestModel} from "../model/project-request.model";

export interface ProjectDatasource {
    nuevoProyecto(request: ProjectRequestModel): Promise<Either<Error, boolean>>
    buscarProyectos(): Promise<Either<Error, ProjectModel[]>>
    buscarProyectoPorId(idProyecto: number): Promise<Either<Error, ProjectModel>>
}

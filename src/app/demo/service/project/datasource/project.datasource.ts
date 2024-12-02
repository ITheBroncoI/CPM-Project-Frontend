import {ProjectModel} from "../model/project.model";

export interface ProjectDatasource {
    nuevoProyecto(archivoBase64: string): Promise<boolean>
    buscarProyectos(): Promise<ProjectModel[]>
    buscarProyectoPorId(idProyecto: number): Promise<ProjectModel>
}
import { baseUrl } from "../../baseurl";

export class ProjectEndpoints {
    static readonly nuevoProyecto = `${baseUrl}/api/proyecto`
    static readonly buscarProyectos = `${baseUrl}/api/proyecto`
    static readonly buscarProyectoPorId = `${baseUrl}/api/proyecto/{id}`
}
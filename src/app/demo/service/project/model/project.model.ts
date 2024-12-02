import {Expose} from "class-transformer";
import { TaskModel } from "./task.model";

export class ProjectModel {
    @Expose({ name: 'id_proyecto' })
    idProyecto: number
    titulo: string
    descripcion: string
    @Expose({ name: 'fecha_inicio' })
    fechaInicio: string
    @Expose({ name: 'unidad_tiempo' })
    unidadTiempo: string
    @Expose({ name: 'horas_trabajo_dia' })
    horasTrabajoDia: number
    @Expose({ name: 'num_decimales' })
    numDecimales: number
    estado: string
    tareas: TaskModel[]

    constructor(options: {
        idProyecto? : number
        titulo? : string
        descripcion? : string
        fechaInicio? : string
        unidadTiempo? : string
        horasTrabajoDia? : number
        numDecimales? : number
        estado? : string
        tareas? : TaskModel[]
    } = {}) {
        this.idProyecto = options.idProyecto
        this.titulo = options.titulo
        this.descripcion = options.descripcion
        this.fechaInicio = options.fechaInicio
        this.unidadTiempo = options.unidadTiempo
        this.horasTrabajoDia = options.horasTrabajoDia
        this.numDecimales = options.numDecimales
        this.estado = options.estado
        this.tareas = options.tareas
    }
}
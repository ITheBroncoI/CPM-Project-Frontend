import {Expose} from "class-transformer";
import { ResponsibleModel } from "./responsible.model";

export class TaskModel {

    @Expose({ name: 'id_tarea' })
    idTarea: number

    @Expose({ name: 'numero_tarea' })
    numeroTarea: number

    accion: string

    @Expose({ name: 'tiempo_optimista' })
    tiempoOptimista: number

    @Expose({ name: 'tiempo_probable' })
    tiempoProbable: number

    @Expose({ name: 'tiempo_pesimista' })
    tiempoPesimista: number

    @Expose({ name: 'inicio_temprano' })
    inicioTemprano: number

    duracion: number

    @Expose({ name: 'final_temprano' })
    finalTemprano: number

    @Expose({ name: 'inicio_tardio' })
    inicioTardio: number

    holgura: number

    @Expose({ name: 'final_tardio' })
    finalTardio: number

    @Expose({ name: 'fecha_inicio' })
    fechaInicio: string

    @Expose({ name: 'fecha_final' })
    fechaFinal: string

    color: string
    notas: string
    estado: string
    responsables: ResponsibleModel[]

    @Expose({ name: 'tareas_dependencias' })
    tareasDependencias: number[]

    constructor(options: {
        idTarea? : number
        numeroTarea? : number
        accion? : string
        tiempoOptimista? : number
        tiempoProbable? : number
        tiempoPesimista? : number
        inicioTemprano? : number
        duracion? : number
        finalTemprano? : number
        inicioTardio? : number
        finalTardio? : number
        holgura? : number
        fechaInicio? : string
        fechaFinal? : string,
        color?: string,
        notas? : string
        estado? : string
        responsables? : ResponsibleModel[]
        tareasDependencias? : number[]
    } = {}) {
        this.idTarea = options.idTarea
        this.numeroTarea = options.numeroTarea
        this.accion = options.accion
        this.tiempoOptimista = options.tiempoOptimista
        this.tiempoProbable = options.tiempoProbable
        this.tiempoPesimista = options.tiempoPesimista
        this.inicioTemprano = options.inicioTemprano
        this.duracion = options.duracion
        this.finalTemprano = options.finalTemprano
        this.inicioTardio = options.inicioTardio
        this.finalTardio = options.finalTardio
        this.holgura = options.holgura
        this.fechaInicio = options.fechaInicio
        this.fechaFinal = options.fechaFinal
        this.color = options.color
        this.notas = options.notas
        this.estado = options.estado
        this.responsables = options.responsables
        this.tareasDependencias = options.tareasDependencias || []
    }
}

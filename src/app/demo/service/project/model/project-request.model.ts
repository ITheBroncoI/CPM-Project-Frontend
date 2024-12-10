import {Expose} from "class-transformer";

export class ProjectRequestModel {

    titulo: string
    descripcion: string

    @Expose({ name: 'file_bytes' })
    file: string

    constructor(options:{
        titulo?: string,
        descripcion?: string,
        file?: string
    } = {}) {
        this.titulo = options.titulo
        this.descripcion = options.descripcion
        this.file = options.file
    }

}

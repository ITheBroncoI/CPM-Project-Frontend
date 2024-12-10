import {Expose} from "class-transformer";

export class ResponsibleModel {

    @Expose({ name: 'id_responsable' })
    idResponsable: number
    nombre: string

    constructor(options: {
        idResponsable?: number;
        nombre? : string
    } = {}) {
        this.idResponsable = options.idResponsable;
        this.nombre = options.nombre;
    }
}

export class ResponsibleModel {
    id: number
    responsable: string
    nombre: string

    constructor(options: {
        id?: number;
        responsable?: string;
        nombre? : string
    } = {}) {
        this.id = options.id;
        this.responsable = options.responsable;
        this.nombre = options.nombre;
    }
}
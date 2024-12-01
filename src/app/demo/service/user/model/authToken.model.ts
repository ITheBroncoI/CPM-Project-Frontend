import {Expose} from "class-transformer";

export class AuthTokenModel {
    token: string
    
    @Expose({ name: 'fecha_expiracion' })
    fechaExpiracion: string

    constructor(options: {
        token?: string;
        fechaExpiracion?: string;
    } = {}) {
        this.token = options.token;
        this.fechaExpiracion = options.fechaExpiracion;
    }
}
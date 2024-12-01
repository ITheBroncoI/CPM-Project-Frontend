import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    constructor() { }

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken(): string {
        return localStorage.getItem('token');
    }

    setFechaExpiracion(fecha_expiracion: string) {
        localStorage.setItem('fecha_expiracion', fecha_expiracion);
    }

    getFechaExpiracion(): string {
        return localStorage.getItem('fecha_expiracion');
    }
}
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

    setCSRFToken(token: string) {
        localStorage.setItem('csrf_token', token)
    }

    getCSRFToken(): string {
        return localStorage.getItem('csrf_token')
    }

}

import validator from 'validator';
import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserModel } from 'src/app/demo/service/user/model/user.model';
import {Router} from "@angular/router";
import {UserDatasourceImpl} from "../../../service/user/datasource/user.datasource.impl";
import {MessageService} from "primeng/api";
import {BadCredentialsException, InternalServerException} from "../../../exceptions/exception";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    password!: string;
    email!: string;

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private messageService: MessageService,
        private userDatasource: UserDatasourceImpl
    ) {}

    async onLogin() {

        if (!this.validarCampos()) {
            return
        }

        const user = new UserModel({
            email: this.email,
            password: this.password
        })

        const response = await this.userDatasource.autenticacion(user, 'login')

        if (response._tag === 'Right') {
            await this.router.navigate(['/dashboard'])
        }

        if (response._tag === 'Left') {
            const ex = response.left

            if (ex instanceof BadCredentialsException) {
                this.mensageAlerta('Las credenciales ingresadas son incorrectas')
            }

            if (ex instanceof InternalServerException) {
                this.mensageAlerta('Hubo un error interno en el servidor. Por favor, intente nuevamente más tarde', 'error', 'Error interno del servidor')
            }

        }

    }

    validarCampos(): boolean {

        let message = ''

        if (!this.email || this.email.trim() === '') {
            message = 'El campo de email no puede estar vacío'
            this.mensageAlerta(message)
            return false
        }

        if (!validator.isEmail(this.email)) {
            message = 'El email ingresa no tiene un formato válido'
            this.mensageAlerta(message)
            return false
        }

        if (!this.password || this.password.trim() === '') {
            message = 'El campo de contraseña no puede estar vacío'
            this.mensageAlerta(message)
            return false
        }

        if (this.password.length < 8) {
            message = 'La contraseña debe tener al menos 8 caracteres'
            this.mensageAlerta(message)
            return false
        }

        if (!/[a-z]/.test(this.password)) {
            message = 'La contraseña debe contener al menos una letra minúscula'
            this.mensageAlerta(message)
            return false
        }

        if (!/[A-Z]/.test(this.password)) {
            message = 'La contraseña debe contener al menos una letra mayúscula'
            this.mensageAlerta(message)
            return false
        }

        if(!/[0-9]/.test(this.password)) {
            message = 'La contraseña debe contener al menos un número'
            this.mensageAlerta(message)
            return false
        }

        return true
    }

    mensageAlerta(message: string, type: string = 'warn', title: string = 'Alerta') {
        this.messageService.add({
            severity: type,
            summary: title,
            detail: message
        })
    }

}

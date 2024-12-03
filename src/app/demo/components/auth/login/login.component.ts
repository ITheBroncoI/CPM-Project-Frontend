import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from "@angular/router";
import { UserDatasourceImpl } from 'src/app/demo/service/user/datasource/user.datasource.impl';
import { UserModel } from 'src/app/demo/service/user/model/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from 'src/app/demo/service/localStorage/localStorageService';
import { BadCredentialsException, BadRequestException, InternalServerException } from 'src/app/demo/exceptions/exception';

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

    valCheck: string[] = ['remember'];
    password!: string;
    email!: string;
    errorMessage: string = '';
    private userDatasource: UserDatasourceImpl;

    constructor(
        public layoutService: LayoutService,
        private  router: Router,
        private http: HttpClient
    ) { 
        this.userDatasource = new UserDatasourceImpl(new LocalStorageService(), this.http);
    }

    async onLogin() {
        const user: UserModel = {
            email: this.email,
            password: this.password
        };

        try {
            const success = await this.userDatasource.iniciarSesion(user);
            if (success) this.router.navigate(['/dashboard']);
        } catch (error) {
            // Incluir lógica para toast notification
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) throw new BadCredentialsException
                if (error.status === 400) throw new BadRequestException();
                if (error.status === 500) throw new InternalServerException();
            }
        }
    }
}

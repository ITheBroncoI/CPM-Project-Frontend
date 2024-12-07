import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserModel } from 'src/app/demo/service/user/model/user.model';
import {Router} from "@angular/router";
import {UserDatasourceImpl} from "../../../service/user/datasource/user.datasource.impl";

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

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private userDatasource: UserDatasourceImpl
    ) {}

    async onLogin() {

        const user = new UserModel({
            email: this.email,
            password: this.password
        })

        const response = await this.userDatasource.autenticacion(user, 'login')

        if (response._tag === 'Right') {
            console.log('Autenticado')
            await this.router.navigate(['/dashboard'])
        }

        if (response._tag === 'Left') {
            const ex = response.left

        }

    }
}

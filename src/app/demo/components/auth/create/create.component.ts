import { Component } from '@angular/core';
import { UserModel } from 'src/app/demo/service/user/model/user.model';
import { Router } from '@angular/router';
import {UserDatasourceImpl} from "../../../service/user/datasource/user.datasource.impl";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  password: string;
  email: string;

  constructor(
    private readonly router: Router,
    private readonly userDatasource: UserDatasourceImpl
  ) {}

  async onCreateUser() {

      const newUser = new UserModel({
          email: this.email,
          password: this.password
      })

      const response = await this.userDatasource.crearCuenta(newUser)

      if (response._tag === 'Right') {
          await this.router.navigate(['/dashboard'])
      }

      if (response._tag === 'Left') {

      }

  }
}

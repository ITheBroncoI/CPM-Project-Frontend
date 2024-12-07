import { Component } from '@angular/core';
import { UserModel } from 'src/app/demo/service/user/model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import {UserDatasource} from "../../../service/user/datasource/user.datasource";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  password: string;
  email: string;
  private userDatasource: UserDatasource;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  async onCreateUser() {

      const newUser = new UserModel({
          email: this.email,
          password: this.password
      })

      const response = await this.userDatasource.autenticacion(newUser, 'signup')

  }
}

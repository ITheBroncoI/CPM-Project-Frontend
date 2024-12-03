import { Component } from '@angular/core';
import { UserDatasourceImpl } from 'src/app/demo/service/user/datasource/user.datasource.impl';
import { UserModel } from 'src/app/demo/service/user/model/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from 'src/app/demo/service/localStorage/localStorageService';
import { ActivatedRoute, Router } from '@angular/router';
import { BadCredentialsException, BadRequestException, InternalServerException } from 'src/app/demo/exceptions/exception';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  password: string;
  email: string;
  private userDatasource: UserDatasourceImpl;

  constructor(
    http: HttpClient,
    localStorageService: LocalStorageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.userDatasource = new UserDatasourceImpl(localStorageService, http);
  }

  async onCreateUser() {
    const newUser: UserModel = { email: this.email, password: this.password };

    try {
      const result = await this.userDatasource.crearCuenta(newUser);

      if (result) this.router.navigate(['/dashboard'], { relativeTo: this.route })
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

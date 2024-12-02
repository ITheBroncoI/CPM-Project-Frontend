import { UserModel } from "../model/user.model";
import { UserDatasource } from "./user.datasource";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import { LocalStorageService } from "../../localStorage/localStorageService";
import { AuthTokenModel } from "../model/authToken.model";
import { UserEndpoints } from "./user.endpoints";
import { firstValueFrom, throwError } from "rxjs";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { BadCredentialsException, BadRequestException, InternalServerException } from "src/app/demo/exceptions/exception";

export class UserDatasourceImpl implements UserDatasource {
    constructor(
        private readonly local: LocalStorageService,
        private readonly http: HttpClient
    ) {}

    async crearCuenta(request: UserModel): Promise<boolean> {
        const endpoint = UserEndpoints.crearCuenta;
        try {
            const response = await firstValueFrom(
                this.http.post(endpoint, instanceToPlain(request))
            )

            const auth = plainToInstance(AuthTokenModel, response);

            this.local.setToken(auth.token);
            this.local.setFechaExpiracion(auth.fechaExpiracion);

            return true;
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) throw new BadCredentialsException
                if (error.status === 400) throw new BadRequestException();
                if (error.status === 500) throw new InternalServerException();
            }
            return false;
        }
    }

    async iniciarSesion(request: UserModel): Promise<boolean> {
        const endpoint = UserEndpoints.iniciarSesion;
        try {
            const response = await firstValueFrom(
                this.http.post(endpoint, instanceToPlain(request))
            )

            const auth = plainToInstance(AuthTokenModel, response);

            this.local.setToken(auth.token);
            this.local.setFechaExpiracion(auth.fechaExpiracion);

            return true;
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) throw new BadCredentialsException
                if (error.status === 400) throw new BadRequestException();
                if (error.status === 500) throw new InternalServerException();
            }
            return false;
        }
    }
    
    
}
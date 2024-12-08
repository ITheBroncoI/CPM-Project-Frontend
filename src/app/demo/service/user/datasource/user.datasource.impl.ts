import { UserModel } from "../model/user.model";
import { UserDatasource } from "./user.datasource";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { LocalStorageService } from "../../localStorage/local-storage.service";
import { UserEndpoints } from "./user.endpoints";
import {catchError, firstValueFrom, map, of} from "rxjs";
import { instanceToPlain } from "class-transformer";
import { BadCredentialsException, BadRequestException, InternalServerException } from "src/app/demo/exceptions/exception";
import {Injectable} from "@angular/core";
import {Either, left, right} from "fp-ts/Either";

@Injectable({
    providedIn: 'root'
})
export class UserDatasourceImpl implements UserDatasource {
    constructor(
        private readonly local: LocalStorageService,
        private readonly http: HttpClient
    ) {}

    async autenticacion(request: UserModel, accion: string): Promise<Either<Error, boolean>> {

        const endpoint = accion === 'login'
            ? UserEndpoints.iniciarSesion
            : UserEndpoints.crearCuenta

        return firstValueFrom(
            this.http
                .post(endpoint, instanceToPlain(request), { observe: 'response' })
                .pipe(
                    map((response: any) => {

                        const token = response.body?.access

                        if (!token) {
                            return left( new InternalServerException())
                        }

                        this.local.setToken(token)
                        return right(true)
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 401) return of(left(new BadCredentialsException()));
                        if (error.status === 400) return of(left(new BadRequestException()));
                        if (error.status === 500) return of(left(new InternalServerException()));

                        return of(left(new Error('Error desconocido')));
                    })
                )
        )

    }

    async buscarTokenCookie(): Promise<boolean> {

        return firstValueFrom(
            this.http.get(UserEndpoints.find_cookie, { observe: 'response' })
                .pipe(
                    map((response: any) => {
                        const token = response.body?.csrf_token

                        if(!token) {
                            return false
                        }
                        this.local.setCSRFToken(token)
                        return true
                    }),
                    catchError(() => {
                        return of(false)
                    })
                )
        )

    }

}

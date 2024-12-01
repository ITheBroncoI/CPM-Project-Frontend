import {UserModel} from "../model/user.model";

export interface UserDatasource {
    crearCuenta(request: UserModel): Promise<boolean>
    iniciarSesion(request: UserModel): Promise<boolean>
}
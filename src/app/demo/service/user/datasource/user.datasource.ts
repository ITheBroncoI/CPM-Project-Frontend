import {UserModel} from "../model/user.model";
import {Either} from "fp-ts/Either";

export interface UserDatasource {
    autenticacion(request: UserModel, accion: string): Promise<Either<Error, boolean>>
}

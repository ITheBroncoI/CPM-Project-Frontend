import { baseUrl } from "../../baseurl";

export class UserEndpoints {
    static readonly crearCuenta = `${baseUrl}/register/`
    static readonly iniciarSesion = `${baseUrl}/token/`
    static readonly find_cookie = `${baseUrl}/get-csrf-token/`
}

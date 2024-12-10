export class UserModel {

    username: string
    email: string
    password: string

    constructor(options: {
        email?: string;
        password?: string;
    } = {}) {
        this.username = options.email
        this.email = options.email
        this.password = options.password
    }
}

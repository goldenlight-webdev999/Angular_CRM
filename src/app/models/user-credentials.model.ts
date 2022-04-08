
export class UserCredentials {
    username: string;
    password: string;
    captcha: string;

    constructor(username: string, password: string, captcha: string) {
        this.username = username;
        this.password = password;
        this.captcha = captcha;
    }
}

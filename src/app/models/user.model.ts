
export class User {
    email: string;
    name: string;
    password: string;
    commercial: boolean;
    captcha: string;

    constructor(email: string, name: string, password: string, commercial: boolean, captcha: string) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.commercial = commercial;
        this.captcha = captcha;
    }
}

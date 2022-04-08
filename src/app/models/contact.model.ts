
export class Contact {
    name: string;
    email: string;
    phone: string;
    message: string;
    commercial: boolean;
    captcha: string;

    constructor(name: string, email: string, phone: string, message: string, commercial: boolean, captcha: string) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.message = message;
        this.commercial = commercial;
        this.captcha = captcha;
    }
}

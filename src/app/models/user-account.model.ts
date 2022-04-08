
export class UserAccount {
    username: string;
    firstName: string;
    lastName: string;
    role: string;

    constructor(username: string, firstName: string, lastName: string, role: string) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }
}

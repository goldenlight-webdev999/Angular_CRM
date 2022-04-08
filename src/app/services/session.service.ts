import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DialogMessageComponent } from '../components/dialog-message/dialog-message.component';

@Injectable()
export class SessionService {

    /**
     * SessionService constructor
     *
     * @param route
     * @param snackBar
     */
    constructor(
        private route: Router,
        public snackBar: MatSnackBar,
        public dialog: MatDialog
    ) {}

    /**
     * Method to save session on LocalStorage
     *
     * @param session
     */
    public saveSession(session: any): void {
        localStorage.setItem('session', JSON.stringify(session));
    }

    /**
     * Method to get session from LocalStorage
     */
    public getSession(): any {
        let session;
        const storedSession = localStorage.getItem('session');

        if (storedSession) {
            session = JSON.parse(storedSession);
        }
        return session;
    }

    /**
     * Methot to get token from session
     */
    public getToken(): string {
        let token;
        const session = this.getSession();

        if (session) {
            token = session['access_token'];
        }
        return token;
    }

    /**
     * Method to delete session from LocalStorage
     */
    public deleteSession(): void {
        localStorage.removeItem('session');
        this.route.navigate(['/']);
    }

    /**
     * Method to check if user is authenticated
     */
    public isAuthenticated(): boolean {
        let authenticated = false;
        const session = this.getSession();

        if (session) {
            const token = session['access_token'];
            const expiration = session['expires_at'];
            const currentTime: number = (new Date()).getTime();

            if (token && (currentTime < expiration)) {
                authenticated = true;
            }
        }
        return authenticated;
    }

    /**
     * Method to show snackbar message
     *
     * @param message
     */
    public showMessage(message: string): void {
        this.snackBar.open(
            message, 'Close', { duration: 3500 }
        );
    }

    /**
     * Method to show error message from response error
     *
     * @param error
     */
    public showError(error: any): void {
        const msgsKeys = Object.keys(error);

        // Get first error message
        const msgsContent = msgsKeys[0];

        this.showMessage(error[msgsContent]);
    }

    public showDialog(data: any): any {
        const dialogRef = this.dialog.open(DialogMessageComponent, {
            minWidth: '350px',
            data: {
                id: data.id,
                title: data.title,
                msg: data.msg,
                buttons: data.buttons,
            }
        });

        return dialogRef;
    }
}

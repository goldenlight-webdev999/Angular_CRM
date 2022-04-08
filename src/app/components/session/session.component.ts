import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit, OnChanges {

    userAccount: any;
    authenticated: boolean;
    privateMode: boolean;
    responsiveMode: boolean;
    minScreenAnchor: number;

    /**
     * SessionComponent constructor
     *
     * @param sessionHandler
     * @param api
     * @param analytics
     * @param router
     */
    constructor(
        public sessionHandler: SessionService,
        public api: MetacleanerAPIService,
        public analytics: GoogleAnalyticsService,
        public router: Router,
    ) {
        this.authenticated = false;
        this.userAccount = {};
        this.minScreenAnchor = 960;
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.privateMode = this.checkCurrentRoute('dashboard');
        this.responsiveMode = (window.innerWidth <= this.minScreenAnchor) ? true : false;
        this.authenticated = this.sessionHandler.isAuthenticated();

        if (this.authenticated) {
            this.api.getProfile().subscribe(
                responseData => {
                    this.userAccount = responseData;
                    let session = this.sessionHandler.getSession();
                    session = {... session, ...responseData};
                    this.sessionHandler.saveSession(session);
                },
                response => {
                    // Use 205 Reset Content - if successful
                    if ((response.status >= 200) && (response.status < 300)) {

                    } else if (response.status >= 401) {
                        this.sessionHandler.deleteSession();
                    } else {
                        this.sessionHandler.showMessage('Unknown error');
                    }
                }
            );
            // this.router.navigate(['dashboard']);
        }
    }

    /**
     * OnChanges method
     */
    ngOnChanges(): void {
        // console.log('ngOnChanges');
    }

    /**
     *Method to check if current route is public o private
     *
     * @param value
     */
    checkCurrentRoute(value: string): boolean {
        const url = this.router.url;

        let route: string;
        route = url.substr(url.indexOf(value), value.length);

        if (route !== value) {
            return false;
        }
        return true;
    }

    /**
     * On resize event handler
     *
     * @param event
     */
    onResize(event: any): void {
        this.responsiveMode = (event.target.innerWidth <= this.minScreenAnchor) ? true : false;
    }

    /**
     * Method to go to login page
     */
    goLogin(): void {
        if (!this.authenticated) {
            this.router.navigate(['login']);
        }
    }

    /**
     * Method to go to register page with plan selected
     *
     * @param value
     */
    goRegister(value: string): void {
        if (!this.authenticated) {
            this.router.navigate(['register'], { queryParams: { plan: value } });
        }
    }

    /**
     * Method to go to dashboard page
     */
    goDashboard(): void {
        if (this.authenticated) {
            this.router.navigate(['dashboard']);
        }
    }

    /**
     * Method to do session logout
     */
    logout(): void {
        const session = this.sessionHandler.getSession();

        // Logout request
        this.api.logout(session['access_token']).subscribe(
            responseData => {
                this.analytics.removeUserTrack();
                this.sessionHandler.deleteSession();
                this.authenticated = this.sessionHandler.isAuthenticated();
            },
            response => {
                // Use 205 Reset Content - if successful
                if (response.status === 205) {
                    this.sessionHandler.deleteSession();
                } else if ((response.status >= 200) && (response.status < 300)) {
                    // Delete this when 205 confirmed
                    this.sessionHandler.deleteSession();
                } else {
                    this.sessionHandler.showMessage('Unknown error');
                }
                this.sessionHandler.deleteSession();
            }
        );
    }
}

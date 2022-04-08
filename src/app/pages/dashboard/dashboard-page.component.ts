import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { SessionService } from '../../services/session.service';

import { Angulartics2 } from 'angulartics2';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

    userAccount: any;
    authenticated: boolean;
    angulartics: Angulartics2;

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches)
    );

    /**
     * DashboardPageComponent constructor
     *
     * @param sessionHandler
     * @param api
     * @param router
     * @param angulartics2
     * @param breakpointObserver
     */
    constructor(
        public sessionHandler: SessionService,
        public api: MetacleanerAPIService,
        public router: Router,
        public angulartics2: Angulartics2,
        private breakpointObserver: BreakpointObserver,
    ) {
        this.authenticated = false;
        this.userAccount = {};
        this.angulartics = angulartics2;
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.authenticated = this.sessionHandler.isAuthenticated();

        if (this.authenticated) {
            this.api.getProfile().subscribe(
                responseData => {
                    this.userAccount = responseData;
                },
                response => {
                    // Use 205 Reset Content - if successful
                    if ((response.status >= 200) && (response.status < 300)) {

                    } else if (response.status >= 401) {

                    } else {
                        this.sessionHandler.showMessage('Unknown error');
                    }
                }
            );
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
                this.angulartics.setUsername.next(null);
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

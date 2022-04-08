import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { SessionService } from '../../services/session.service';
import { environment } from '../../../environments/environment';
import { UserCredentials } from '../../models/user-credentials.model';

@Component({
    selector: 'app-verify-page',
    templateUrl: './verify-page.component.html',
    styleUrls: ['./verify-page.component.scss']
})
export class VerifyPageComponent implements OnInit, OnDestroy {

    private subscriber: any;

    isEmailVerified: boolean;

    token: string;
    expiry: string;
    uuid: string;

    loading: boolean;

    /**
     * VerifyPageComponent constructor
     *
     * @param router
     * @param route
     * @param api
     * @param analytics
     * @param sessionHandler
     */
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public api: MetacleanerAPIService,
        public analytics: GoogleAnalyticsService,
        public sessionHandler: SessionService,
    ) {
        this.isEmailVerified = false;
    }

    /**
     * OnInit method
     */
    ngOnInit() {

        this.loading = false;
        this.token = this.route.snapshot.params['token'];
        this.expiry = this.route.snapshot.params['expiry'];
        this.uuid = this.route.snapshot.params['uuid'];
        this.api.validateEmailVerification(
            this.token,
            this.expiry,
            this.uuid
        ).subscribe(
            responseData => {
                this.sessionHandler.showMessage(responseData.toString());
                this.isEmailVerified = true;
            },
            response => {
                this.sessionHandler.showError(response.error.payload);
            }
        )

        console.log(this.token);
    }

    /**
     * Method to go to register page with plan selected
     *
     * @param value
     */
    goLoginPage(value: string): void {
        this.router.navigate(['login']);
    }

    /**
     * Unsuscriber method
     */
    ngOnDestroy(): void {
    }

}

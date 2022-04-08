import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MetacleanerAPIService } from '../../../services/metacleaner-api.service';
import { SessionService } from '../../../services/session.service';

@Component({
    selector: 'app-account-dashboard',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountDashboardComponent implements OnInit {

    authenticated: boolean;
    userAccount: any;
    subscription: any;
    subscriptionPlan: string;
    subscriptionStatus: string;
    subscriptions: boolean;
    history: any;
    historyCount: number;
    loading: boolean;
    breakpoint: number;

    /**
     * AccountDashboardComponent constructor
     *
     * @param router
     * @param location
     * @param api
     * @param sessionHandler
     */
    constructor(
        public router: Router,
        private location: Location,
        public api: MetacleanerAPIService,
        public sessionHandler: SessionService
    ) {
        this.authenticated = false;
        this.userAccount = {};
        this.subscriptions = false;
        this.loading = false;
        this.breakpoint = 1;
        this.historyCount = 0;
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.breakpoint = (window.innerWidth <= 1200) ? 1 : 2;

        this.authenticated = this.sessionHandler.isAuthenticated();

        if (!this.authenticated) {
            this.sessionHandler.deleteSession();
        } else {
            this.loading = true;

            this.checkSubscription();

            this.api.getProfile().subscribe(
                responseData => {
                    this.userAccount = responseData;

                    this.api.getHistory().subscribe(
                        responseHistory => {
                            this.history = responseHistory;
                            this.historyCount = this.history.length;
                        },
                        response => {
                            this.sessionHandler.showError(response.error.payload);
                            if (response.status === 401) {
                                this.sessionHandler.deleteSession();
                            }
                            this.location.back();
                        }
                    );
                },
                response => {
                    this.sessionHandler.showError(response.error.payload);
                    if (response.status === 401) {
                        this.sessionHandler.deleteSession();
                    }
                    this.location.back();
                }
            );
        }
    }

    /**
     * Checks if user has subscription
     */
    checkSubscription(): void {
        this.loading = true;

        this.api.getSubscriptions().subscribe(
            responseData => {
                this.subscription = responseData;

                if (this.subscription['subscriptions'].length !== 0) {
                    this.subscriptionPlan = this.subscription['subscriptions'][0]['type'];
                    this.subscriptionStatus = this.subscription['subscriptions'][0]['subscriptionStatus'];
                    this.subscriptions = true;
                } else {
                    this.subscriptionPlan = 'free';
                    this.subscriptionStatus = 'without plan';
                    this.subscriptions = false;
                }
                this.loading = false;
            },
            response => {
                this.sessionHandler.showError(response.error.payload);
                if (response.status === 401) {
                    this.sessionHandler.deleteSession();
                }
                this.loading = false;
                this.location.back();
            }
        );
    }

    /**
     * On resize event handler
     *
     * @param event
     */
    onResize(event: any): void {
        this.breakpoint = (event.target.innerWidth <= 1200) ? 1 : 2;
    }

    /**
     * Method to go to historical page
     */
    goHistorical(): void {
        this.router.navigate(['dashboard/historical']);
    }

    /**
     * Method to go to subscriptions page
     */
    goPlans(): void {
        this.router.navigate(['dashboard/subscriptions']);
    }

    /**
     * Method to go to uploader page
     */
    goUploader(): void {
        this.router.navigate(['dashboard/uploader']);
    }
}

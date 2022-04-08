import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MetacleanerAPIService } from '../../../services/metacleaner-api.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.scss']
})
export class MySubscriptionsComponent implements OnInit {

    subscription: any;
    currentPlan: string;
    nextPlan: string;
    allPlans: any;
    otherPlans: any;
    planAction: string;
    loading: boolean;

    /**
     * MySubscriptionsComponent contructor
     *
     * @param router
     * @param location
     * @param api
     * @param sessionHandler
     */
    constructor(
        private router: Router,
        private location: Location,
        public api: MetacleanerAPIService,
        public sessionHandler: SessionService
    ) {
        this.allPlans = [
            'basic',
            'advance',
            'enterprise'
        ];
        this.nextPlan = '';
        this.planAction = 'Change plan';
    }

    /**
     * OnInit method
     */
    ngOnInit() {
        const session = this.sessionHandler.getSession();
        this.currentPlan = session['plan'];

        this.loading = true;
        this.api.getSubscriptions().subscribe(
            responseData => {
                this.subscription = responseData;

                this.currentPlan = this.subscription['subscriptions'][0]['type'];

                if (this.subscription['subscriptions'].length > 1) {
                    this.nextPlan = this.subscription['subscriptions'][1]['type'];
                }
            },
            response => {
                this.sessionHandler.showError(response.error.payload);
                this.location.back();
            },
            () => {
                this.loading = false;
            }
        );
        this.otherPlans = this.allPlans.filter(plan => plan !== this.currentPlan);
    }
}

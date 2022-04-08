import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { MetacleanerAPIService } from '../../../services/metacleaner-api.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-next-subscription',
  templateUrl: './next-subscription.component.html',
  styleUrls: ['./next-subscription.component.scss']
})
export class NextSubscriptionComponent implements OnInit {

    @Input() plan: string;

    subscription: any;
    planType: string;
    planData: object;
    planAction: string;
    loading: boolean;

    /**
     * NextSubscriptionComponent constructor
     *
     * @param location
     * @param api
     * @param sessionHandler
     */
    constructor(
        private location: Location,
        public api: MetacleanerAPIService,
        public sessionHandler: SessionService
    ) {
        this.planType = '';
        this.planData = {
            'planStart': '',
            'nextCharge': '',
            'paymentStatus': '',
        };
        this.planAction = '';
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.planType = this.plan;
        this.planAction = 'Cancel plan';

        this.loading = true;

        this.api.getSubscriptions().subscribe(
            responseData => {
                this.subscription = responseData;

                let statusPlan: string;
                statusPlan = this.subscription['subscriptions'][0]['subscriptionStatus'];

                this.planData = {
                    'planStart': this.subscription['subscriptions'][0]['dateStart'],
                    'planEnd': this.subscription['subscriptions'][0]['dateEnd'],
                    'subscriptionStatus': (statusPlan === 'cancelled') ? 'Does not renew' : statusPlan,
                };
                this.loading = false;
            },
            response => {
                this.loading = false;
                this.sessionHandler.showError(response.error.payload);
                this.location.back();
            }
        );
    }
}

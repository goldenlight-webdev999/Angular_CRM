import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { MetacleanerAPIService } from '../../../services/metacleaner-api.service';
import { SessionService } from '../../../services/session.service';
import moment from 'moment';

@Component({
    selector: 'app-active-subscription',
    templateUrl: './active-subscription.component.html',
    styleUrls: ['./active-subscription.component.scss']
})
export class ActiveSubscriptionComponent implements OnInit {

    @Input() plan: string;

    subscription: any;
    planType: string;
    planData: object;
    planAction: string;
    current: boolean;
    selected: boolean;
    loading: boolean;
    percentage: number;
    trafficLimit: number;

    /**
     * ActiveSubscriptionComponent constructor
     *
     * @param location
     * @param sessionHandler
     * @param api
     */
    constructor(
        private location: Location,
        public sessionHandler: SessionService,
        public api: MetacleanerAPIService
    ) {
        this.planType = 'basic';
        this.planData = {
            'planStart': '',
            'planEnd': '',
            'subscriptionStatus': '',
            'consumption': '',
            'nextCharge': ''
        };
        this.planAction = '';
        this.percentage = 0;
        this.trafficLimit = 0;
        this.current = true;
        this.selected = false;
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.planType = this.plan;
        this.trafficLimit = this.getLimit(this.planType);
        this.planAction = 'Cancel plan';

        this.loading = true;

        this.api.getSubscriptions().subscribe(
            responseData => {
                this.subscription = responseData;

                if (this.subscription['subscriptions'].length > 1) {
                    this.current = false;
                    this.selected = true;
                }

                const nextCharge = this.remainingTime(
                    Date.parse(this.subscription['subscriptions'][0]['dateEnd'])
                );

                this.percentage = this.calculatePercentage(
                    this.subscription['traffic'],
                    this.trafficLimit
                );

                this.planData = {
                    'planStart': this.subscription['subscriptions'][0]['dateStart'],
                    'planEnd': this.subscription['subscriptions'][0]['dateEnd'],
                    'subscriptionStatus': this.subscription['subscriptions'][0]['subscriptionStatus'],
                    'consumption': this.subscription['traffic'],
                    'nextCharge': (nextCharge > 1) ? nextCharge + ' days' : (nextCharge < 0) ? 'Expired' : 'Tomorrow',
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

    /**
     * Calculate consumption percentage
     *
     * @param traffic
     * @param limit
     */
    private calculatePercentage(traffic: any, limit: any): number {
        return (traffic * 100) / limit;
    }

    /**
     * Calculate remaining time
     *
     * @param dateEnd
     */
    private remainingTime(dateEnd: any): number {
        const today = moment(new Date());
        const endDate = moment(new Date(dateEnd));

        return endDate.diff(today, 'days');
    }

    /**
     * Calculate plan limits
     *
     * @param plan
     */
    private getLimit(plan: any): number {
        let trafficLimit = 0;
        switch (plan) {
            case 'basic':
                trafficLimit = 1073741824;
                break;
            case 'advance':
                trafficLimit = 10737418240;
                break;
            case 'enterprise':
                trafficLimit = 107374182400;
                break;
        }
        return trafficLimit;
    }
}

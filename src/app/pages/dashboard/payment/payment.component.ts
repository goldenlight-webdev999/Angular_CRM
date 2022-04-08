import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MetacleanerAPIService } from '../../../services/metacleaner-api.service';
import { GoogleAnalyticsService } from '../../../services/google-analytics.service';
import { SessionService } from '../../../services/session.service';

@Component({
    selector: 'app-payment-dashboard',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentDashboardComponent implements OnInit, OnDestroy {

    private subscriber: any;
    plan: string;
    subscription: any;
    subscriptions: boolean;
    subscriptionPlan: any;
    planType: string;
    planAction: string;
    action: string;
    actionText: string;
    stripeAction: string;
    loading: boolean;

    /**
     * PaymentDashboardComponent constructor
     *
     * @param router
     * @param route
     * @param location
     * @param api
     * @param analytics
     * @param sessionHandler
     */
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public api: MetacleanerAPIService,
        public analytics: GoogleAnalyticsService,
        public sessionHandler: SessionService,
    ) {
        this.subscription = [];
        this.subscriptions = false;
        this.subscriptionPlan = [];
        this.action = '';
        this.actionText = '';
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.loading = true;
        this.subscriber = this.route.queryParams.subscribe(params => {
            this.plan = params['plan'];
        });

        this.stripeAction = this.plan;

        this.planType = this.plan;
        this.planAction = 'Selected plan';
        this.action = 'Change plan';
        this.actionText = 'By clicking on Confirm button, you accept to be charged with your current credit card.';

        if (this.planType === 'free') {
            const session = this.sessionHandler.getSession();
            this.planType = session['plan'];
            this.planAction = 'Current plan';
            this.action = 'Cancel plan';
            this.actionText = 'By clicking on Confirm button, you will cancel your current subscription.';
        }

        this.api.getSubscriptions().subscribe(
            responseData => {
                this.subscription = responseData;

                const subscriptionsCount = this.subscription['subscriptions'].length;
                switch (subscriptionsCount) {
                    case 0:
                        this.action = 'Add subscription';
                        this.actionText = 'By clicking on Add Plan button, you accept to be charged with your credit card.';
                        this.subscriptions = false;
                        break;
                    case 1:
                        this.subscriptions = true;
                        if (this.subscription['subscriptions'][0]['subscriptionStatus'] === 'cancelled') {
                            this.action = 'Add subscription';
                            this.actionText = 'By clicking on Add Plan button, you accept to be charged with your credit card.';
                            this.subscriptions = false;
                        }
                        break;
                    case 2:
                        this.subscriptions = true;
                        break;
                }

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
     * Method to confirm if cancel or change subscription
     */
    confirmChange(): void {
        this.loading = true;

        this.subscriptionPlan = { 'type' : this.plan };

        this.api.changeSubscription(this.subscriptionPlan).subscribe(
            responseData => {
                let message: string;

                if (this.plan !== 'free') {
                    this.analytics.eventTrack('user-change-plan', this.plan, 'User Change Plan', 'User');
                    message = 'Your subscription has been changed successfully!';
                } else {
                    this.analytics.eventTrack('user-cancel-plan', this.plan, 'User Cancel Plan', 'User');
                    message = 'Your subscription has been deleted successfully!';
                }

                this.sessionHandler.showMessage(message);
                this.router.navigate(['dashboard/subscriptions']);
            },
            response => {
                this.sessionHandler.showError(response.error.payload);
                this.location.back();
            },
            () => {
                this.loading = false;
            }
        );
    }

    /**
     * Method for go back button
     */
    goBack(): void {
        this.location.back();
    }

    /**
     * Unsuscriber method
     */
    ngOnDestroy(): void {
        this.subscriber.unsubscribe();
    }
}

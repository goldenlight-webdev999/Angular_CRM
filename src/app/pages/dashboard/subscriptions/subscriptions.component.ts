import { Component, OnInit  } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MetacleanerAPIService } from '../../../services/metacleaner-api.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-subscriptions-dashboard',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsDashboardComponent implements OnInit {

    subscription: any;
    subscriptions: boolean;
    cardTitle: string;
    loading: boolean;
    errors: any;

    /**
     * SubscriptionsDashboardComponent constructor
     *
     * @param location
     * @param api
     * @param sessionHandler
     */
    constructor(
        private location: Location,
        private route: ActivatedRoute,
        public api: MetacleanerAPIService,
        public sessionHandler: SessionService
    ) {
        this.subscription = [];
        this.subscriptions = false;
        this.cardTitle = 'Add Subscription';
     }


    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.loading = true;

        this.api.getSubscriptions().subscribe(
            responseData => {
                this.subscription = responseData;
                let session = this.sessionHandler.getSession();

                if (this.subscription['subscriptions'].length !== 0) {
                    const plan = this.subscription['subscriptions'][0]['type'];
                    session = { ... session, plan };
                    this.cardTitle = 'My Subscriptions';
                    this.subscriptions = true;
                } else {
                    const plan = 'free';
                    session = { ... session, plan };
                    this.cardTitle = 'Add Subscription';
                    this.subscriptions = false;
                }
                this.sessionHandler.saveSession(session);
                this.loading = false;

                if (this.route.snapshot.queryParams['cancelled']) {
                    this.sessionHandler.showError(['Payment is cancelled']);
                }
                if (this.route.snapshot.queryParams['session_id']) {
                    this.sessionHandler.showMessage('Your payment is being processed, check back in a moment');
                }
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

import { Component, OnInit } from '@angular/core';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-current-card',
    templateUrl: './current-card.component.html',
    styleUrls: [ './current-card.component.scss' ]
})
export class CurrentCardComponent implements OnInit {

    subscription: any;
    cardDetails: object;

    /**
     * CurrentCardComponent constructor
     *
     * @param api
     * @param sessionHandler
     */
    constructor(
        public api: MetacleanerAPIService,
        public sessionHandler: SessionService
    ) {
        this.cardDetails = {
            brand: 'unknown',
            funding: 'payment',
            lastDigits: '0000'
        };
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.api.getSubscriptions().subscribe(
            responseData => {
                this.subscription = responseData;

                if (this.subscription['subscriptions'].length !== 0 ) {
                    this.cardDetails = this.subscription['subscriptions'][0]['paymentMethodMetadata'];
                } else {
                    this.cardDetails = {
                        brand: 'unknown',
                        funding: 'payment',
                        lastDigits: '0000'
                    };
                }
            },
            response => {
                this.sessionHandler.showError(response.error.payload);
            }
        );
    }
}

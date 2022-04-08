import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.scss']
})
export class AddSubscriptionComponent implements OnInit {

    basicPlan: string;
    advancePlan: string;
    enterprisePlan: string;
    planAction: string;

    /**
     * AddSubscriptionComponent constructor
     *
     * @param sessionHandler
     */
    constructor(
        public sessionHandler: SessionService,
    ) {
        this.basicPlan = 'basic';
        this.advancePlan = 'advance';
        this.enterprisePlan = 'enterprise';
        this.planAction = 'Select plan';
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.basicPlan = 'basic';
        this.advancePlan = 'advance';
        this.enterprisePlan = 'enterprise';
        this.planAction = 'Select plan';
    }
}

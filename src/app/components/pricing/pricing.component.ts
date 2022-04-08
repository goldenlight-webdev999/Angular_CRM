import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollingService } from '../../services/srolling.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: [ './pricing.component.scss' ]
})
export class PricingComponent implements OnInit {

    unregisterPlan: object;
    registerPlan: object;
    basicPlan: string;
    advancePlan: string;
    enterprisePlan: string;
    planAction: string;

    /**
     * PricingComponent constructor
     *
     * @param router
     * @param scrollHandler
     */
    constructor(
        public router: Router,
        public scrollHandler: ScrollingService
    ) {
        this.unregisterPlan = {};
        this.registerPlan = {};
        this.basicPlan = '';
        this.advancePlan = '';
        this.enterprisePlan = '';
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.unregisterPlan = environment.unregisterPlan;
        this.registerPlan = environment.registerPlan;
        this.basicPlan = 'basic';
        this.advancePlan = 'advance';
        this.enterprisePlan = 'enterprise';
        this.planAction = 'Select plan';
    }

    /**
     * Method to go to register page with plan selected
     *
     * @param value
     */
    goRegisterPage(value: string): void {
        this.router.navigate(['register'], { queryParams: { plan: value } });
    }

    /**
     * Navigate to element
     *
     * @param locationId
     */
    public navigateToItem(locationId: string): void {
        this.scrollHandler.scrollToItem('/', locationId);
    }
}

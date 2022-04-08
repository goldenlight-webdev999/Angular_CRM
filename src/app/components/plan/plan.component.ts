import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { SessionService } from '../../services/session.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-plan',
    templateUrl: './plan.component.html',
    styleUrls: [ './plan.component.scss' ],
})
export class PlanComponent implements OnInit {

    @Input() plan: string;
    @Input() action: string;
    @Input() dashboard: boolean;
    @Input() current: boolean;
    @Input() selected: boolean;
    @Input() planSelected: any;
    @ViewChild('selectDiag') public selectDiag: ElementRef<any>;
    protected selectDiagReference?: NgbModalRef = null;


    planType: string;
    planContent: object;
    checkoutSession: object;

    public planChosen: string;
    public lookupKey: string;

    /**
     * PlanComponent constructor
     *
     * @param router
     */
    constructor(
        public router: Router,
        private location: Location,
        public api: MetacleanerAPIService,
        public sessionHandler: SessionService,
        private modalService: NgbModal
    ) {
        this.planContent = {
            price: '0',
            name: 'Unknown',
            size: 'Unknown',
            traffic: 'Unknown',
            access: 'Unknown',
            lookupKey: null,
        };
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.planType = this.plan;

        switch (this.planType) {
            case 'basic': {
                this.planContent = environment.basicPlan;
                break;
            }
            case 'advance': {
                this.planContent = environment.advancePlan;
                break;
            }
            case 'enterprise': {
                this.planContent = environment.enterprisePlan;
                break;
            }
        }
    }

    /**
     * Method to go to appropriate route with selected plan
     */
    selectPlan(): void {
        if (!this.dashboard) {
            this.router.navigate(['register'], { queryParams: { plan: this.plan }});
        } else if (this.action === 'Cancel plan') {
            alert('wow');
            this.router.navigate(['dashboard/payment'], { queryParams: { plan: 'free' }});
        } else {
            this.api.getCheckoutSession(this.planContent['lookupKey']).subscribe(
                responseData => {
                    if (responseData['payload']['url'] !== undefined) {
                        window.location.href = responseData['payload']['url'];
                    }
                },
                response => {
                    this.sessionHandler.showError(response.error.payload);
                }
            );
        }
    }

    openModal(): void {
        if (this.action === 'Cancel plan') {
           // alert('wow');
            this.router.navigate(['dashboard/payment'], { queryParams: { plan: 'free' }});
        } else {
            console.log(this.planContent);
            this.planChosen = this.planContent['paypalKey'];
            this.lookupKey = this.planContent['lookupKey'];
            this.selectDiagReference = this.modalService.open(
                this.selectDiag,
                {
                    backdropClass: 'custom-backdrop',
                }
            );
        }

    }
    closeModal() {
        this.selectDiagReference.close();
    }


}

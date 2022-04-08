import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { SessionService } from '../../services/session.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-stripe-form',
    templateUrl: './stripe-form.component.html',
    styleUrls: ['./stripe-form.component.scss']
})
export class StripeFormComponent implements OnInit, AfterViewInit {

    @Input() action: string;

    stripeForm: FormGroup;
    submitted = false;

    formOptions: any;
    actionForm: string;

    name = new FormControl;

    loading: boolean;

   /**
     * StripeFormComponent constructor
     *
     * @param router
     * @param location
     * @param formBuilder
     * @param stripeService
     * @param api
     * @param analytics
     * @param sessionHandler
     */
    constructor(
        private router: Router,
        private location: Location,
        private formBuilder: FormBuilder,
        public api: MetacleanerAPIService,
        public analytics: GoogleAnalyticsService,
        public sessionHandler: SessionService
    ) {
        this.actionForm = 'Submit';
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {

        this.loading = false;
        this.createForm();

        this.actionForm = (this.action === 'change-card') ? 'Change card' : 'Add plan';
        this.submitted = false;
    }

    /**
     * Method to create the form
     */
    createForm(): void {
        this.submitted = false;

        this.name = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]);

        this.stripeForm = this.formBuilder.group({
            name: this.name,
        });
    }

    /**
     * Method for get form controls
     */
    get form() {
        return this.stripeForm.controls;
    }

    /**
     * AfterViewInit method
     */
    ngAfterViewInit(): void {
    }

    /**
     * OnSubmit form method
     */
    onSubmit(): void {
        this.submitted = true;
        return;
    }

    /**
     * Method for go back button
     */
    goBack(): void {
        this.location.back();
    }
}

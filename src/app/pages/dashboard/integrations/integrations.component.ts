import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MetacleanerAPIService } from '../../../services/metacleaner-api.service';
import { GoogleAnalyticsService } from '../../../services/google-analytics.service';
import { SessionService } from '../../../services/session.service';
import { FileSizePipe } from 'ngx-filesize';

@Component({
    selector: 'app-integrations-dashboard',
    templateUrl: './integrations.component.html',
    styleUrls: ['./integrations.component.scss']
})
export class IntegrationsDashboardComponent implements OnInit {

    authenticated: boolean;
    breakpoint: number;

    subscription: any;
    subscriptionPlan: string;
    subscriptionStatus: string;
    subscriptions: boolean;

    advanceActive: boolean;
    enterpriseActive: boolean;
    actionAdvanceMsg: string;
    actionEnterpriseMsg: string;

    applications: any;

    externalAppsForm: FormGroup;
    submitted = false;

    name: FormControl;
    redirect: FormControl;

    loading: boolean;
    loadingForm: boolean;

    showId: boolean;
    showSecret: boolean;

    public fileSizeFormatter = new FileSizePipe();

    // Doughnut
    public chartLabels: string[];
    public chartData: number[];
    // public chartType = 'doughnut';
    public chartType = 'pie';
    public chartOptions: any = {
        responsive: true,
        legend: {
            display: true,
            position: 'right',
            labels: {
                boxWidth: 14,
                fontSize: 14
            }
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem, data) =>
                    ' ' + data.labels[tooltipItem.index] + ': ' +
                    this.fileSizeFormatter.transform(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index])
            }
        }
    };

    public chartColors: Array<any> = [
        {
            backgroundColor: '#49535e',
            borderColor: '#fafafb',
            hoverBackgroundColor: '#66cc66',
            hoverBorderColor: '#fafafb'
        }
    ];
    public pageLoaded: boolean;

    /**
     * IntegrationsDashboardComponent constructor
     *
     * @param router
     * @param location
     * @param formBuilder
     * @param api
     * @param sessionHandler
     * @param analytics
     */
    constructor(
        public router: Router,
        private location: Location,
        private formBuilder: FormBuilder,
        public api: MetacleanerAPIService,
        public sessionHandler: SessionService,
        public analytics: GoogleAnalyticsService,
    ) {
        this.authenticated = false;
        this.breakpoint = 1;
        this.subscriptions = false;
        this.actionAdvanceMsg = 'Select plan';
        this.actionEnterpriseMsg = 'Select plan';
        this.loading = false;
        this.loadingForm = false;
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.breakpoint = (window.innerWidth <= 1200) ? 1 : 2;

        this.authenticated = this.sessionHandler.isAuthenticated();

        if (!this.authenticated) {
            this.sessionHandler.deleteSession();
        } else {
            this.loading = true;
            this.checkSubscription();
        }
    }

    /**
     * Screen event handler to delimit the view's columns
     *
     * @param event
     */
    onResize(event) {
        this.breakpoint = (event.target.innerWidth <= 1200) ? 1 : 2;
    }

    /**
     * Checks if user has subscription
     */
    checkSubscription(): void {
        this.loading = true;

        this.api.getSubscriptions().subscribe(
            responseData => {
                this.subscription = responseData;

                if (this.subscription['subscriptions'].length !== 0) {

                    this.subscriptionPlan = this.subscription['subscriptions'][0]['type'];
                    this.subscriptionStatus = this.subscription['subscriptions'][0]['subscriptionStatus'];

                    const availableStatus = this.subscriptionStatus === 'pending';
                    if (this.subscriptionPlan === 'advance' && !availableStatus) {
                        this.subscriptions = true;
                    } else if (this.subscriptionPlan === 'advance' && availableStatus) {
                        this.advanceActive = true;
                        this.actionAdvanceMsg = this.subscriptionStatus;
                    }

                    if (this.subscriptionPlan === 'enterprise' && !availableStatus) {
                        this.subscriptions = true;
                    } else if (this.subscriptionPlan === 'enterprise' && availableStatus) {
                        this.enterpriseActive = true;
                        this.actionEnterpriseMsg = this.subscriptionStatus;
                    }

                    this.checkApplications();
                } else {
                    this.subscriptionPlan = 'free';
                    this.subscriptions = false;
                }
                this.loading = false;
                this.initForm();
            },
            response => {
                this.sessionHandler.showError(response.error.payload);
                if (response.status === 401) {
                    this.sessionHandler.deleteSession();
                }
                this.loading = false;
                this.location.back();
            }
        );
    }

    /**
     * Checks if user has integrated applications
     */
    checkApplications(): void {
        this.pageLoaded = false;

        this.api.getApplications().subscribe(
            responseData => {
                this.applications = responseData['applications'];

                if (this.applications.length !== 0) {
                    const rawTraffic = responseData['traffic'];
                    this.applications.forEach(function (part) {
                        part.traffic = rawTraffic[part.id];
                    });
                    this.loadChart();
                }
            },
            response => {
                this.sessionHandler.showError(response.error.payload);
                if (response.status === 401) {
                    this.sessionHandler.deleteSession();
                }
                this.location.back();
            },
        );
    }

    /**
     * Method to create the form
     */
    initForm(): void {
        this.submitted = false;

        this.name = new FormControl(
            '', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(40)
            ]
        );
        this.redirect = new FormControl(
            '', [
                Validators.required,
                Validators.maxLength(60)
            ]
        );

        this.externalAppsForm = this.formBuilder.group({
            name: this.name,
            redirect: this.redirect,
        });
    }

    /**
     * Method for get form controls
     */
    get form() {
        return this.externalAppsForm.controls;
    }

    /**
     * OnSubmit form method
     */
    addApplication(): void {
        this.submitted = true;

        if (this.externalAppsForm.invalid) {
            return;
        } else {
            this.loadingForm = true;

            this.api.setApplication({name: this.name.value, redirect: this.redirect.value}).subscribe(
                () => {
                    this.checkApplications();
                    this.resetForm();
                    this.analytics.eventTrack('integrate-app', 'integrations', 'Integrate app', 'User');
                    this.sessionHandler.showMessage('Your external app has been added successfully!');
                },
                response => {
                    if (response.error.hasOwnProperty('payload')) {
                        this.sessionHandler.showError(response.error.payload);
                    } else {
                        this.sessionHandler.showMessage(response.error);
                    }
                },
                () => {
                    this.loadingForm = false;
                }
            );
        }
    }

    /**
     * Remove the selected integrated application
     *
     * @param applicationId
     */
    removeApplication(applicationId: string) {

        const dialogResult = this.sessionHandler.showDialog(
            {
                id: applicationId,
                title: 'Remove app',
                msg: 'Are you sure you want to delete the application?',
                buttons: [
                    {
                        label: 'remove',
                        action: 'remove',
                        class: 'button-danger'
                    },
                    {
                        label: 'cancel',
                        action: 'cancel',
                        class: 'button-dark'
                    },
                ],
            }
        );

        dialogResult.afterClosed().subscribe(
            actionResponse => {
                if (actionResponse === 'remove') {
                    this.api.removeApplication(applicationId).subscribe(
                        () => {
                            this.checkApplications();
                            this.sessionHandler.showMessage('Your external app has been removed successfully!');
                        },
                        response => {
                            this.sessionHandler.showError(response.error.payload);
                            if (response.status === 401) {
                                this.sessionHandler.deleteSession();
                            }
                            this.location.back();
                        },
                    );
                }
            }
        );
    }

    /**
     * Method to load the Chart
     */
    loadChart(): void {
        this.chartLabels = [];
        this.chartData = [];

        const that = this;
        this.applications.forEach(function (part) {
            that.chartLabels.push(part.name);
            that.chartData.push(part.traffic);
        });

        this.pageLoaded = true;
    }

    /**
     * Method for reset form
     */
    resetForm(): void {
        this.externalAppsForm.markAsUntouched();
        this.initForm();
    }

    /**
     * Method to get the error message appropriate to form controls
     *
     * @param formControl
     * @param controlName
     * @param minLength
     * @param maxLength
     */
    getErrorMessage(formControl: FormControl, controlName: string, minLength?: string, maxLength?: string) {
        let message: string;
        message =
            formControl.hasError('required') ? 'The ' + controlName + ' field is required' :
            formControl.hasError('maxlength') ? 'The value entered exceeds the field maximum length (' + maxLength + ' characters)' :
            formControl.hasError('minlength') ? 'The ' + controlName + ' must be at least ' + minLength + ' characters' :
            formControl.hasError('pattern') ? 'Please enter a valid ' + controlName : '';
        return message;
    }

    /**
     * Method to reset password inputs
     */
    initPasswordInputs(): void {
        this.showId = false;
        this.showSecret = false;
    }
}

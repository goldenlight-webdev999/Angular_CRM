import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { SessionService } from '../../services/session.service';
import { environment } from '../../../environments/environment';
import { UserCredentials } from '../../models/user-credentials.model';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

    token: string;
    expiry: string;
    uuid: string;

    loginForm: FormGroup;
    submitted = false;
    password: FormControl;
    isPasswordReset: boolean;

    loading: boolean;

    /**
     * VerifyPageComponent constructor
     *
     * @param router
     * @param route
     * @param api
     * @param analytics
     * @param sessionHandler
     */
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        public api: MetacleanerAPIService,
        public analytics: GoogleAnalyticsService,
        public sessionHandler: SessionService,
    ) {
    }

    /**
     * OnInit method
     */
    ngOnInit() {

        this.loading = false;
        this.createForm();
        this.token = this.route.snapshot.params['token'];
        this.expiry = this.route.snapshot.params['expiry'];
        this.uuid = this.route.snapshot.params['uuid'];
    }

    /**
     * Method to go to register page with plan selected
     *
     * @param value
     */
    goLoginPage(value: string): void {
        this.router.navigate(['login']);
    }

    /**
     * Method to create the form
     */
    createForm(): void {
        this.submitted = false;

        this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);

        this.loginForm = this.formBuilder.group({
            password: this.password,
        });
    }

    /**
     * Method to get form controls
     */
    get form() {
        return this.loginForm.controls;
    }

    /**
     * Login handler when submit form
     */
    login() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        } else {
            this.loading = true;
            this.api.validateResetPassword(
                this.token,
                this.expiry,
                this.uuid,
                this.loginForm.value.password
            ).subscribe(
                responseData => {
                    this.sessionHandler.showMessage(responseData.toString());
                    this.isPasswordReset = true;
                    this.loading = false;
                },
                response => {
                    this.sessionHandler.showError(response.error.payload);
                    this.loading = false;
                }
            );

        }
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
            formControl.hasError('minlength') ? 'The ' + controlName + ' must be at least ' + minLength + ' characters' :
            '';
        return message;
    }



    /**
     * Unsuscriber method
     */
    ngOnDestroy(): void {
    }

}

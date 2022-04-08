import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { SessionService } from '../../services/session.service';
import { environment } from '../../../environments/environment';
import { UserCredentials } from '../../models/user-credentials.model';
import { ReCaptchaComponent } from 'angular2-recaptcha';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

    private subscriber: any;
    plan: string;

    loginForm: FormGroup;
    submitted = false;

    gCaptchaKey: String;
    validCaptcha: string;
    isEmailVerified: boolean;
    isPasswordWrong: boolean;

    patternEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

    email: FormControl;
    password: FormControl;

    loading: boolean;

    /**
     * LoginPageComponent constructor
     *
     * @param router
     * @param route
     * @param formBuilder
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
        this.gCaptchaKey = environment.google_recaptcha_key;
    }

    /**
     * OnInit method
     */
    ngOnInit() {
        this.subscriber = this.route.queryParams.subscribe(params => {
            this.plan = (params['plan'] !== undefined) ? params['plan'] : 'free';
        });

        this.loading = false;
        this.createForm();
        this.isEmailVerified = true;
        this.isPasswordWrong = false;
    }

    /**
     * Method to create the form
     */
    createForm(): void {
        this.submitted = false;
        this.validCaptcha = '';

        this.email = new FormControl('', [Validators.required, Validators.pattern(this.patternEmail), Validators.maxLength(64)]);
        this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);

        this.loginForm = this.formBuilder.group({
            email: this.email,
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

        if (this.loginForm.invalid || !this.validCaptcha) {
            return;
        } else {
            this.loading = true;
            this.api.login(new UserCredentials(
                this.loginForm.value.email,
                this.loginForm.value.password,
                this.validCaptcha,
            )).subscribe(
                responseData => {
                    const expiration = new Date();
                    expiration.setSeconds(expiration.getSeconds() + Number(responseData['expires_in']));
                    const session = {
                        'access_token': responseData['access_token'],
                        'expires_at': expiration.getTime()
                    };
                    this.sessionHandler.saveSession(session);
                    this.sessionHandler.isAuthenticated();

                    this.api.getProfile().subscribe(
                        data => {
                            this.analytics.setUserTrack(data['id']);
                            this.analytics.eventTrack('user-sign-in', this.plan, 'User Sign In', 'User');

                            if (!this.plan) {
                                this.router.navigate(['dashboard']);
                            } else {
                                this.router.navigate(['dashboard'], { queryParams: { plan: this.plan } });
                            }
                        },
                    );
                },
                response => {
                    this.captcha.reset();
                    this.loading = false;
                    this.sessionHandler.showError(response.error.payload);
                    if (response.error.payload.email !== undefined
                        && response.error.payload.email[0] !== undefined
                        && response.error.payload.email[0] === 'Email Address is not verified'
                    ) this.isEmailVerified = false;
                    this.isPasswordWrong = response.error.payload.invalid_grant !== undefined;
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
            formControl.hasError('required') ? 'The ' + controlName + ' field is required' :
            formControl.hasError('maxlength') ? 'The value entered exceeds the field maximum length (' + maxLength + ' characters)' :
            formControl.hasError('minlength') ? 'The ' + controlName + ' must be at least ' + minLength + ' characters' :
            formControl.hasError('pattern') ? 'Please enter a valid ' + controlName :
            '';
        return message;
    }

    /**
     * Checks if recaptcha has response
     *
     * @param captchaResponse
     */
    validateCaptcha(captchaResponse: string): void {
        this.validCaptcha = ((!captchaResponse) ? '' : captchaResponse);
    }

    /**
     * Method to cancel button
     */
    cancel(): void {
        this.router.navigate(['/']);
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
     * Unsuscriber method
     */
    ngOnDestroy(): void {
        this.subscriber.unsubscribe();
    }

    sendEmailVerification(): void {

        if (!this.loginForm.value.email) {
            this.sessionHandler.showError(['You need to enter an email address']);
            return;
        }

        this.api.sendEmailVerification(
            this.loginForm.value.email,
        ).subscribe(
            responseData => {
                this.sessionHandler.showMessage(responseData.toString());
                this.isEmailVerified = true;
            },
            response => {
                this.sessionHandler.showError(response.error.payload);
            }
        )
    }

    sendResetPassword(): void {

        if (!this.loginForm.value.email) {
            this.sessionHandler.showError(['You need to enter an email address']);
            return;
        }

        this.api.sendResetPassword(
            this.loginForm.value.email,
        ).subscribe(
            responseData => {
                this.sessionHandler.showMessage(responseData.toString());
            },
            response => {
                this.sessionHandler.showError(response.error.payload);
            }
        )
    }

}

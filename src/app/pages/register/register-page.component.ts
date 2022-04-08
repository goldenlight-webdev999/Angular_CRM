import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { SessionService } from '../../services/session.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

import { CustomValidators } from 'ng2-validation';
import { ReCaptchaComponent } from 'angular2-recaptcha';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

    private subscriber: any;
    plan: string;

    registerForm: FormGroup;
    submitted = false;

    gCaptchaKey: String;
    validCaptcha: string;

    patternEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

    email: FormControl;
    name: FormControl;
    password: FormControl;
    password2: FormControl;
    legal: FormControl;
    commercial: FormControl;

    loading: boolean;

    /**
     * RegisterPageComponent constructor
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
    ngOnInit(): void {
        this.subscriber = this.route.queryParams.subscribe(params => {
          this.plan = params['plan'];
        });

        this.loading = false;
        this.createForm();
    }

    /**
     * Method to create the form
     */
    createForm(): void {
        this.submitted = false;
        this.validCaptcha = '';

        this.email = new FormControl('', [Validators.required, Validators.pattern(this.patternEmail), Validators.maxLength(64)]);
        this.name = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]);
        this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
        this.password2 = new FormControl('', CustomValidators.equalTo(this.password));
        this.commercial = new FormControl(false, [Validators.required]);
        this.legal = new FormControl(false);

        this.registerForm = this.formBuilder.group({
            email: this.email,
            name: this.name,
            password: this.password,
            password2: this.password2,
            commercial: this.commercial,
            legal: this.legal,
        });
    }

    /**
     * Method to get form controls
     */
    get form() {
        return this.registerForm.controls;
    }

    /**
     * Register handler when submit form
     */
    register(): void {
        this.submitted = true;

        if (this.registerForm.invalid || !this.validCaptcha) {
            return;
        } else {
            this.loading = true;

            this.api.register(new User(
                this.registerForm.value.email,
                this.registerForm.value.name,
                this.registerForm.value.password,
                (this.registerForm.value.commercial) ? true : false,
                this.validCaptcha,
            )).subscribe(
                responseData => {
                    this.analytics.eventTrack('user-sign-up', this.plan, 'User Sign Up', 'User');

                    this.captcha.reset();
                    this.sessionHandler.showMessage('Your registration was successful!');
                    this.loading = false;
                    this.router.navigate(['login'], { queryParams: { plan: this.plan } });
                },
                response => {
                    this.captcha.reset();
                    this.validCaptcha = '';
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
     * Method to go to login page with plan selected
     *
     * @param value
     */
    goLoginPage(value: string): void {
        this.router.navigate(['login'], { queryParams: { plan: value } });
    }

    /**
     * Unsuscriber method
     */
    ngOnDestroy(): void {
        this.subscriber.unsubscribe();
    }
}

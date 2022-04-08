import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { SessionService } from '../../services/session.service';
import { environment } from '../../../environments/environment';
import { Contact } from '../../models/contact.model';
import { ReCaptchaComponent } from 'angular2-recaptcha';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

    contactForm: FormGroup;
    submitted = false;

    gCaptchaKey: String;
    validCaptcha: string;

    patternEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    patternNumeric = /[0-9\+\-\ ]/;

    email: FormControl;
    name: FormControl;
    phone: FormControl;
    message: FormControl;
    legal: FormControl;
    commercial: FormControl;

    loading: boolean;

    /**
     * ContactComponent constructor
     *
     * @param formBuilder
     * @param api
     * @param analytics
     * @param sessionHandler
     */
    constructor(
        private formBuilder: FormBuilder,
        public api: MetacleanerAPIService,
        public analytics: GoogleAnalyticsService,
        public sessionHandler: SessionService
    ) {
        this.gCaptchaKey = environment.google_recaptcha_key;
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
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
        this.phone = new FormControl('', [Validators.minLength(8), Validators.maxLength(12), Validators.pattern(this.patternNumeric)]);
        this.message = new FormControl('', [Validators.required, Validators.maxLength(1000)]);
        this.commercial = new FormControl(false, [Validators.required]);
        this.legal = new FormControl(false);

        this.contactForm = this.formBuilder.group({
            email: this.email,
            name: this.name,
            phone: this.phone,
            message: this.message,
            commercial: this.commercial,
            legal: this.legal,
        });
    }

    /**
     * Method for get form controls
     */
    get form() {
        return this.contactForm.controls;
    }

    /**
     * OnSubmit form method
     */
    onSubmit(): void {
        this.submitted = true;

        if (this.contactForm.invalid || !this.validCaptcha) {
            return;
        } else {
            this.loading = true;

            this.api.contact(new Contact(
                this.contactForm.value.name,
                this.contactForm.value.email,
                this.contactForm.value.phone,
                this.contactForm.value.message,
                (this.contactForm.value.commercial) ? true : false,
                this.validCaptcha,
            )).subscribe(
                responseData => {
                    this.analytics.eventTrack('contact-message', 'contact', 'Contact Message', 'User');

                    this.captcha.reset();
                    this.resetForm();
                    this.sessionHandler.showMessage('Your message has been successfully sent!');
                    this.loading = false;
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
     * Method for reset form
     */
    resetForm(): void {
        this.createForm();
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
     * Keyboard event handler to force to enter only numbers with +/-
     *
     * @param event
     */
    onlyNumeric(event: any): void {
        const inputChar = String.fromCharCode(event.charCode);

        if (event.keyCode !== 8 && !this.patternNumeric.test(inputChar)) {
          event.preventDefault();
        }
    }
}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
    MatSnackBarModule,
    MatGridListModule,
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatExpansionModule,
    MatTableModule,
    MatBadgeModule,
    MatDialogModule
} from '@angular/material';

// Main component
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';

// Custom services
import { AuthGuardService } from './services/auth-guard.service';
import { SessionService } from './services/session.service';
import { MetacleanerAPIService } from './services/metacleaner-api.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { ScrollingService } from './services/srolling.service';

// Token interceptor
import { TokenInterceptor } from './interceptors/token.interceptor';

// Public page components
import { HomePageComponent } from './pages/home/home-page.component';
import { FeaturesComponent } from './components/features/features.component';
import { PluginsComponent } from './components/plugins/plugins.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServiceAgreementComponent } from './pages/legal/service-agreement/service-agreement.component';
import { PrivacyPolicyComponent } from './pages/legal/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './pages/legal/legal-notice/legal-notice.component';
import { CookiesPolicyComponent } from './pages/legal/cookies-policy/cookies-policy.component';

// Auth page components
import { LoginPageComponent } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { VerifyPageComponent } from './pages/verify/verify-page.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

// Layout components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

// Uploader component
import { UploaderComponent,  DialogMetadata } from './components/uploader/uploader.component';

// Private page components
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { UploaderDashboardComponent } from './pages/dashboard/uploader/uploader.component';
import { SubscriptionsDashboardComponent } from './pages/dashboard/subscriptions/subscriptions.component';
import { HistoricalDashboardComponent } from './pages/dashboard/historical/historical.component';
import { AccountDashboardComponent } from './pages/dashboard/account/account.component';
import { IntegrationsDashboardComponent } from './pages/dashboard/integrations/integrations.component';
import { PaymentDashboardComponent } from './pages/dashboard/payment/payment.component';

// Subscriptions components
import { MySubscriptionsComponent } from './components/subscriptions/my-subscriptions/my-subscriptions.component';
import { AddSubscriptionComponent } from './components/subscriptions/add-subscription/add-subscription.component';
import { ActiveSubscriptionComponent } from './components/subscriptions/active-subscription/active-subscription.component';
import { NextSubscriptionComponent } from './components/subscriptions/next-subscription/next-subscription.component';

// Extra components
import { SessionComponent } from './components/session/session.component';
import { PlanComponent } from './components/plan/plan.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DialogMessageComponent } from './components/dialog-message/dialog-message.component';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner.component';

// Google ReCaptcha tool
import { ReCaptchaModule } from 'angular2-recaptcha';

// File size pipe
import { FileSizeModule } from 'ngx-filesize';

// Google Analytics
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

// Stripe
import { StripeFormComponent } from './components/stripe-form/stripe-form.component';
import { CurrentCardComponent } from './components/current-card/current-card.component';

// Cookie Service
import { CookieService } from 'ngx-cookie-service';

// Chart JS
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectionDialogComponent } from './components/selection-dialog/selection-dialog.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            AppRoutes,
            { enableTracing: false } // <-- debugging purposes only
        ),
        FormsModule,
        ReactiveFormsModule,
        LayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatGridListModule,
        MatCardModule,
        MatSidenavModule,
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatTabsModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        MatOptionModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatExpansionModule,
        MatTableModule,
        MatBadgeModule,
        MatDialogModule,
        ReCaptchaModule,
        FileSizeModule,
        Angulartics2Module.forRoot([ Angulartics2GoogleTagManager ]),
        ChartsModule,
        NgbModule.forRoot()
    ],
    entryComponents: [
        DialogMessageComponent,
        DialogMetadata,
    ],
    declarations: [
        AppComponent,
        HomePageComponent,
        LoginPageComponent,
        RegisterPageComponent,
        VerifyPageComponent,
        ForgotPasswordComponent,
        DashboardPageComponent,

        UploaderComponent,
        DialogMetadata,

        HeaderComponent,
        FooterComponent,

        FeaturesComponent,
        PluginsComponent,
        PricingComponent,
        AboutComponent,
        ContactComponent,
        ServiceAgreementComponent,
        PrivacyPolicyComponent,
        LegalNoticeComponent,
        CookiesPolicyComponent,

        UploaderDashboardComponent,
        SubscriptionsDashboardComponent,
        HistoricalDashboardComponent,
        AccountDashboardComponent,
        IntegrationsDashboardComponent,
        PaymentDashboardComponent,

        SessionComponent,
        PlanComponent,
        LoadingComponent,
        CookieBannerComponent,

        StripeFormComponent,
        CurrentCardComponent,

        MySubscriptionsComponent,
        AddSubscriptionComponent,
        ActiveSubscriptionComponent,
        NextSubscriptionComponent,

        DialogMessageComponent,

        SelectionDialogComponent
    ],
    exports: [
        HttpClientModule
    ],
    providers: [
        SessionService,
        AuthGuardService,
        MetacleanerAPIService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        CookieService,
        GoogleAnalyticsService,
        ScrollingService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

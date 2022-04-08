import { Routes, CanActivate } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

import { HomePageComponent } from './pages/home/home-page.component';
import { ServiceAgreementComponent } from './pages/legal/service-agreement/service-agreement.component';
import { PrivacyPolicyComponent } from './pages/legal/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './pages/legal/legal-notice/legal-notice.component';
import { CookiesPolicyComponent } from './pages/legal/cookies-policy/cookies-policy.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { VerifyPageComponent } from './pages/verify/verify-page.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { UploaderDashboardComponent } from './pages/dashboard/uploader/uploader.component';
import { SubscriptionsDashboardComponent } from './pages/dashboard/subscriptions/subscriptions.component';
import { HistoricalDashboardComponent } from './pages/dashboard/historical/historical.component';
import { AccountDashboardComponent } from './pages/dashboard/account/account.component';
import { IntegrationsDashboardComponent } from './pages/dashboard/integrations/integrations.component';
import { PaymentDashboardComponent } from './pages/dashboard/payment/payment.component';

export const AppRoutes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'service-agreement', component: ServiceAgreementComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'legal-notice', component: LegalNoticeComponent },
    { path: 'cookies', component: CookiesPolicyComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'verify/:token/:expiry/:uuid', component: VerifyPageComponent },
    { path: 'forgot-password/:token/:expiry/:uuid', component: ForgotPasswordComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'dashboard',
        component: DashboardPageComponent,
        children: [
        { path: 'uploader', component: UploaderDashboardComponent },
        { path: 'subscriptions', component: SubscriptionsDashboardComponent },
        { path: 'historical', component: HistoricalDashboardComponent },
        { path: 'account', component: AccountDashboardComponent },
        { path: 'integrations', component: IntegrationsDashboardComponent },
        { path: 'payment', component: PaymentDashboardComponent },
        { path: '**',
            redirectTo: 'subscriptions'},
        ],
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '' }
];

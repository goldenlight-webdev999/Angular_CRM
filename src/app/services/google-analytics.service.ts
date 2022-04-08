import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class GoogleAnalyticsService {

    analytics: Angulartics2;
    cookieValue: string;
    cookieconsent: boolean;

    /**
     * GoogleAnalyticsService constructor
     *
     * @param cookieService
     * @param angulartics2
     */
    constructor(
        private cookieService: CookieService,
        public angulartics2: Angulartics2,
    ) {
        this.analytics = angulartics2;
    }

    /**
     * Set event into Google Tracking
     *
     * @param userAction
     * @param eventValue
     * @param eventLabel
     * @param eventCategory
     */
    public eventTrack(userAction: string, eventValue?: string, eventLabel?: string, eventCategory?: string): void {
        if (this.checkCookieConsent()) {
            this.analytics.eventTrack.next({
                action: userAction,
                properties: {
                    value: eventValue,
                    label: eventLabel,
                    category: eventCategory
                }
            });
        }
    }

    /**
     * Set UserId into Google Tracking
     *
     * @param userId
     */
    public setUserTrack(userId: any): void {
        if (this.checkCookieConsent()) {
            this.analytics.setUsername.next(userId);
        }
    }

    /**
     * Remove userId from Google Tracking
     */
    public removeUserTrack(): void {
        if (this.checkCookieConsent()) {
            this.analytics.setUsername.next(null);
        }
    }

    /**
     * Checks if user has been accept cookies
     */
    private checkCookieConsent(): boolean {
        this.cookieValue = this.cookieService.get('metacleaner_cookieconsent');
        this.cookieconsent = (this.cookieValue === 'true') ? true : false;

        return this.cookieconsent;
    }
}

import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-cookie-banner',
    templateUrl: './cookie-banner.component.html',
    styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit {

    cookieValue: string;
    cookieconsent: boolean;

    /**
     * CookieBannerComponent constructor
     *
     * @param cookieService
     * @param sessionHandler
     */
    constructor(
        private cookieService: CookieService,
        public sessionHandler: SessionService,
    ) { }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.cookieValue = this.cookieService.get('metacleaner_cookieconsent');
        this.cookieconsent = (this.cookieValue === 'true') ? true : false;
    }

    /**
     * Method to save the one-year consent cookie
     */
    saveCookie(): void {
        this.cookieService.set('metacleaner_cookieconsent', 'true', 365, '/');
        this.cookieconsent = true;

        this.sessionHandler.showMessage('Cookies preferences have been updated!');
    }
}

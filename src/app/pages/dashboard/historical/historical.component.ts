import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MetacleanerAPIService } from '../../../services/metacleaner-api.service';
import { SessionService } from '../../../services/session.service';

@Component({
    selector: 'app-historical-dashboard',
    templateUrl: './historical.component.html',
    styleUrls: ['./historical.component.scss']
})
export class HistoricalDashboardComponent implements OnInit {

    history: any;
    loading: boolean;

    /**
     * HistoricalDashboardComponent constructor
     *
     * @param location
     * @param api
     * @param sessionHandler
     */
    constructor(
        private location: Location,
        public api: MetacleanerAPIService,
        public sessionHandler: SessionService
    ) {
        this.history = [];
        this.loading = true;
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.loading = true;
        this.api.getHistory().subscribe(
            responseData => {
                this.history = responseData;
                this.loading = false;
            },
            response => {
                this.sessionHandler.showError(response.error.payload);
                if (response.status === 401) {
                    this.sessionHandler.deleteSession();
                }
                this.loading = false;
                this.location.back();
            },
        );
    }
}

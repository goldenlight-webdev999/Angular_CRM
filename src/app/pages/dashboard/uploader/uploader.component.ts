import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MetacleanerAPIService } from '../../../services/metacleaner-api.service';
import { SessionService } from '../../../services/session.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-uploader-dashboard',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss']
})
export class UploaderDashboardComponent implements OnInit {

    allowedExtensions: string[];
    authenticated: boolean;
    maxFileSize: number;
    trafficLimit: number;
    userTraffic: number;
    subscription: any;
    planType: string;
    loading: boolean;

    /**
     * UploaderDashboardComponent constructor
     *
     * @param location
     * @param api
     * @param sessionHandler
     */
    constructor(
        private location: Location,
        public api: MetacleanerAPIService,
        public sessionHandler: SessionService,
    ) {
        this.authenticated = false;
        this.allowedExtensions = environment.extensions;
        this.maxFileSize = 0;
        this.trafficLimit = 0;
        this.loading = false;
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.authenticated = this.sessionHandler.isAuthenticated();
        if (!this.authenticated) {
            this.sessionHandler.deleteSession();
        } else {
            this.loading = true;
            this.api.getSubscriptions().subscribe(
                responseData => {
                    this.subscription = responseData;
                    if (this.subscription['subscriptions'].length !== 0) {
                        this.planType = this.subscription['subscriptions'][0].type;

                        switch (this.planType) {
                            case 'basic':
                                this.maxFileSize = 31457280; // 30 MB
                                this.trafficLimit = 1073741824; // 1 GB
                                break;
                            case 'advance':
                                this.maxFileSize = 52428800; // 50 MB
                                this.trafficLimit = 10737418240; // 1 GB
                                break;
                            case 'enterprise':
                                this.maxFileSize = 52428800; // 50 MB
                                this.trafficLimit = 107374182400; // 1 GB
                                break;
                        }

                        this.userTraffic = this.subscription['traffic'];
                    } else {
                        this.maxFileSize = 5242880; // 5 MB
                    }
                },
                response => {
                    this.sessionHandler.showError(response.error.payload);
                    this.location.back();
                },
                () => {
                    this.loading = false;
                }
            );
        }
    }
}

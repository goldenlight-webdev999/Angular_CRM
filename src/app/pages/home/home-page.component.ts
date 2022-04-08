import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { ScrollingService } from '../../services/srolling.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    allowedExtensions: string[];
    activeSection: string;

    /**
     * HomePageComponent constructor
     *
     * @param router
     * @param route
     * @param api
     * @param scrollHandler
     */
    constructor(
        public router: Router,
        private route: ActivatedRoute,
        public api: MetacleanerAPIService,
        public scrollHandler: ScrollingService
    ) {
        this.allowedExtensions = environment.extensions;
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.route.fragment.subscribe((fragment: string) => {
            if (fragment === null || fragment === undefined) {
                this.router.navigate(['/'], { fragment: 'home' });
            } else {
                this.navigateToItem(fragment);
            }
        });
    }

    /**
     * Header scrolling handler
     *
     * @param section
     */
    public headerNavigation(section: string): void {
        this.navigateToItem(section);
    }

    /**
     * Navigate to element
     *
     * @param locationId
     */
    public navigateToItem(locationId: string): void {
        this.scrollHandler.scrollToItem('/', locationId);
    }
}

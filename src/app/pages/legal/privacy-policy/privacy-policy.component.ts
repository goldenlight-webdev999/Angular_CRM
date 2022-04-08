import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollingService } from '../../../services/srolling.service';

@Component({
    selector: 'app-legal-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['../legal-page.scss']
})
export class PrivacyPolicyComponent implements OnInit {

    modified_date: string;

    /**
     * PrivacyPolicyComponent constructor
     *
     * @param router
     * @param route
     */
    constructor(
        public router: Router,
        private route: ActivatedRoute,
    ) {
        ScrollingService.scrollToTop();
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.modified_date = document.lastModified;
    }

    /**
     * Method to navigate on header
     *
     * @param page
     * @param section
     */
    headerNavigation(page, section): void {
        this.router.navigate([page], {fragment: section});
    }
}

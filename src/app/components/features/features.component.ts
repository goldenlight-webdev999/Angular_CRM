import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollingService } from '../../services/srolling.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-features',
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {

    public extensions: string[];

    /**
     * FeaturesComponent constructor
     *
     * @param router
     * @param scrollHandler
     */
    constructor(
        public router: Router,
        public scrollHandler: ScrollingService
    ) {
        this.extensions = environment.extensions;
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

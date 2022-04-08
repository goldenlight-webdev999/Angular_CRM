import { Component } from '@angular/core';
import { ScrollingService } from '../../services/srolling.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {

    /**
     * AboutComponent constructor
     *
     * @param scrollHandler
     */
    constructor(
        public scrollHandler: ScrollingService
    ) { }

    /**
     * Navigate to element
     *
     * @param locationId
     */
    public navigateToItem(locationId: string): void {
        this.scrollHandler.scrollToItem('/', locationId);
    }
}

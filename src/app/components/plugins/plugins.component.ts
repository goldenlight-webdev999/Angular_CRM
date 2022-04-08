import { Component } from '@angular/core';
import { ScrollingService } from '../../services/srolling.service';

@Component({
    selector: 'app-plugins',
    templateUrl: './plugins.component.html',
    styleUrls: ['./plugins.component.scss']
})
export class PluginsComponent {

    /**
     * PluginsComponent constructor
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

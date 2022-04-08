import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable()
export class ScrollingService {

    /**
     * ScrollingService constructor
     *
     * @param location
     */
    constructor(
        private location: Location
    ) {}

    /**
     * Scroll to top page
     */
    public static scrollToTop(): void {
        window.scroll(0, 0);
    }

    /**
     * Scroll to element
     *
     * @param currentUrl
     * @param locationId
     */
    public scrollToItem(currentUrl: string, locationId: string): void {
        const element = document.querySelector('#' + locationId);

        if (element) {
            setTimeout(() => {
                element.scrollIntoView({behavior: 'smooth', block: 'start'});
            }, 100);
        }
        this.location.replaceState(currentUrl + '#' + locationId);
    }
}

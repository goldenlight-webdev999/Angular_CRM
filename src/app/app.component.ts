import { Component } from '@angular/core';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

@Component({
    selector: 'app-metacleaner',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'Metacleaner';

    /**
     * AppComponent constructor
     *
     * @param angulartics2GoogleTagManager
     */
    constructor(
        angulartics2GoogleTagManager: Angulartics2GoogleTagManager
    ) { }
}

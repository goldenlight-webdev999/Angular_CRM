import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @ViewChild('mainNav') MainNav: ElementRef;
    @ViewChild('navbarCollapse') NavbarCollapse: ElementRef;

    @Input() shrink: boolean;

    @Output() home: EventEmitter<null> = new EventEmitter();
    @Output() features: EventEmitter<null> = new EventEmitter();
    @Output() plugins: EventEmitter<null> = new EventEmitter();
    @Output() pricing: EventEmitter<null> = new EventEmitter();
    @Output() about: EventEmitter<null> = new EventEmitter();
    @Output() contact: EventEmitter<null> = new EventEmitter();

    activeItem: string;
    section: Element[];
    responsiveMode: boolean;
    minScreenWidth: number;
    scrollPosition: number;

    /**
     * HeaderComponent constructor
     *
     * @param renderer
     */
    constructor(
        private renderer: Renderer2,
    ) {
        this.minScreenWidth = 1200;
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.responsiveMode = (window.innerWidth <= this.minScreenWidth) ? true : false;
        this.changeNavStyle();
    }

    /**
     * Listen to scroll event to change the active class on navigation links
     *
     * @param $event
     */
    @HostListener('window:scroll', []) onWindowScroll($event: any): void {
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        this.section = Array.from(document.querySelectorAll('section>div[id], header[id]'));
        const sections = {};
        Array.prototype.forEach.call(this.section, function(e) {
            sections[e.id] = e.offsetTop;
        });

        let i: string;
        for (i in sections) {
            if (sections[i] <= this.scrollPosition) {
                if (document.querySelectorAll('.nav-item') !== null) {
                    document.querySelectorAll('.nav-item').forEach(function(item) {
                        item.querySelector('.nav-item a').removeAttribute('class');
                        item.querySelector('.nav-item a').setAttribute('class', 'nav-link section-link');
                    });
                }
                document.querySelector('#nav_' + i + ' a').setAttribute('class', 'nav-link section-link active');
            }
        }
        this.changeNavStyle();
    }

    /**
     * Change navigation bar style
     */
    changeNavStyle(): void {
        if (this.scrollPosition > 100 || this.shrink || this.responsiveMode) {
            this.renderer.addClass(this.MainNav.nativeElement, 'navbar-shrink');
        } else {
            this.renderer.removeClass(this.MainNav.nativeElement, 'navbar-shrink');
        }

        if (this.responsiveMode) {
            this.renderer.removeClass(this.MainNav.nativeElement, 'navbar-expand-lg');
        } else {
            this.renderer.addClass(this.MainNav.nativeElement, 'navbar-expand-lg');
        }
    }

    /**
     * Change navigation bar depending screen width
     *
     * @param event
     */
    onResize(event: any): void {
        this.responsiveMode = (event.target.innerWidth <= this.minScreenWidth) ? true : false;
        this.changeNavStyle();
    }

    /**
     * Collapse navigation bar on responsive device when click on a link
     */
    collapse(): void {
        this.renderer.removeClass(this.NavbarCollapse.nativeElement, 'show');
    }
}

import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    /**
     * AuthGuardService constructor
     *
     * @param session
     * @param router
     */
    constructor(
        public session: SessionService,
        public router: Router
    ) {}

    canActivate(): boolean {
        if (!this.session.isAuthenticated()) {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}

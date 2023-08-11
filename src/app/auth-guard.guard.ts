import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router) {

  }
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    if (this.authService.isUserAuthenticated()) {
      return true
    }
    else {
      return this.router.createUrlTree(['/login']);
    }
  }

}

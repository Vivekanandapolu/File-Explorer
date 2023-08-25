import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthServiceService } from './auth-service.service';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router, private tokenservice: TokenService) {

  }
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('token')
    if (this.tokenservice.validateTokenAndRefresh()) {
      return true
    }
    else {
      alert("Session Expired Resfresh and Login Again")
      localStorage.clear()
      this.router.navigate(['/'])
      return false
    }
  }

}

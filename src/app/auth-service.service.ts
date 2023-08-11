import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { apiurls } from './shared/apiurls';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private router: Router, private http: HttpClient) { }
  isUserAuthenticated() {
    if (localStorage.getItem('token')) {
      return true;
    }
    else {
      return this.router.navigate(['/'])

    }
  }
}

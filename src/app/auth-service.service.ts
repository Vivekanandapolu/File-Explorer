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

      //Set the User type using api [Except :Login-Api]

      // this.http.get(apiurls.usertype).subscribe((res: any) => {
      //   console.log(res.User_type);
      //   localStorage.setItem('user-type',"")
      // })
      return true;
    }
    else {
      return this.router.navigate(['/'])

    }
  }
}

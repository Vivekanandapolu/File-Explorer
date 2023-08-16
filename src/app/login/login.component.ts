import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs';
import { apiurls } from '../shared/apiurls';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginDetails: any = {
    username: '',
    password: ''
  }

  AllfieldsErr = false
  invalidDetailsErr = false
  spinner = false
  spinnerBtn = true
  disabledbyAdmin = false
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {

  }
  ngOnInit(): void {

  }
  submitForm(form: NgForm) {
    this.spinner = true
    this.spinnerBtn = false
    if (this.loginDetails.username == '' || this.loginDetails.password == '') {
      this.spinner = false
      this.spinnerBtn = true
      this.AllfieldsErr = true
      setTimeout(() => {
        this.AllfieldsErr = false
      }, 2500)
    }
    else {

      //Login API
      this.http.post(apiurls.login, form.value).subscribe((res: any) => {
        if (res.msg) {
          this.spinner = false
          this.spinnerBtn = true
          console.log(res.msg);
          this.invalidDetailsErr = true
          setTimeout(() => {
            this.invalidDetailsErr = false
          }, 2500)
        }
        if (res.detail) {
          this.spinner = false
          this.spinnerBtn = true
          this.disabledbyAdmin = true
          console.log(res.detail);

          setTimeout(() => {
            this.disabledbyAdmin = false
          }, 2500)
        }
        else if (res.token) {
          this.spinner = false
          this.spinnerBtn = true
          this.toastr.success("Login Successfull", '', { timeOut: 1500 })
          localStorage.setItem('token', res.token)
          localStorage.setItem('userType', res.User_type)
          localStorage.setItem('view', "grid")
          this.router.navigate(['/buckets'])
        }
      })
    }
  }

}

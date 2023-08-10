import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  constructor(private http: HttpClient, private toaster: ToastrService, private router: Router) {

  }
  ngOnInit(): void {

  }
  submitForm(form: NgForm) {
    if (this.loginDetails.username == '' || this.loginDetails.password == '') {
      this.toaster.error('Enter a vaild Credentials', '', {
        timeOut: 2000,
      });
    }
    else {
      this.http.post("http://192.168.1.151:8000/auth/login", form.value).subscribe((res: any) => {
        if (res.msg) {
          this.toaster.error("Invalid User")
        }
        else if (res.token) {
          localStorage.setItem('token', res.token)
          console.log(localStorage.getItem('token'));
        }
      })
    }
  }
}

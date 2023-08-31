import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { apiurls } from '../shared/apiurls';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  loginDetails: any = {
    username: ''
  }
  emailMsg: any = false
  emailMsg_1 = false
  spinner = false
  spinnerBtn = true
  constructor(private toastr: ToastrService, private http: HttpClient, private router: Router) {

  }
  ngOnInit(): void {

  }
  async submitForm(form: NgForm) {
    this.spinner = true
    this.spinnerBtn = false
    if (this.loginDetails.username == '') {
      this.spinner = false
      this.spinnerBtn = true
      this.emailMsg = true
      await setTimeout(() => {
        this.emailMsg = false
      }, 2500)
    }
    else {
      try {

        this.http.post(apiurls.forgotPass, form.value).subscribe((res: any) => {
          if (res.invalid) {
            this.spinner = false
            this.spinnerBtn = true
            this.emailMsg_1 = true
            setTimeout(() => {
              this.emailMsg_1 = false
            }, 2500)
          }
          if (res.success) {
            this.spinner = true
            this.spinnerBtn = false

            this.toastr.success("Password Generated Successfully", '', { timeOut: 1500 })
            this.router.navigate(['/'])
          }

        })
      }
      catch {
        this.toastr.error("Internal server Error 500", '', { timeOut: 1500 })
      }
      //Forgot api
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { apiurls } from '../shared/apiurls';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  viewProfile: any = false
  spinnerBtn = true
  spinner = false
  errorMsg: any = false
  changeData: any = {

  }
  currentMsg = false
  newPassAndConbfirm = false
  minimumMsg = false
  constructor(private http: HttpClient, private router: Router, private modalservice: NgbModal, private toastr: ToastrService) {

  }
  username: any
  firstLetter: any = ''
  ngOnInit(): void {
    this.http.get(apiurls.usertype).subscribe((res: any) => {
      if (res.email) {
        localStorage.setItem('email', res?.email)
        this.username = res?.email
        this.firstLetter = this.username[0].toUpperCase()
      }
    })
  }

  logout() {
    localStorage.clear();
    this.toastr.success('Logout Successfull', '', { timeOut: 1000 })
    this.router.navigate(['/'])
  }
  open(content: any) {
    this.changeData = {}
    this.modalservice.open(content, {
      backdrop: "static"
    })
  }
  changePassword(form: NgForm) {
    console.log(form.value);
    this.spinnerBtn = false
    this.spinner = true
    if (!form.value.CurrentPassword || !form.value.NewPassword || !form.value.ConfirmPassword) {
      this.spinnerBtn = true
      this.spinner = false
      this.errorMsg = true
      setTimeout(() => {
        this.errorMsg = false
      }, 1500)
    }
    else {
      this.http.put(apiurls.changePassword, form.value).subscribe((res: any) => {
        if (res.msg) {
          this.spinnerBtn = true
          this.spinner = false
          this.currentMsg = true
          setTimeout(() => {
            this.currentMsg = false
          }, 2500)
        }
        if (res.msg2) {
          this.spinnerBtn = true
          this.spinner = false
          this.newPassAndConbfirm = true
          setTimeout(() => {
            this.newPassAndConbfirm = false
          }, 2500)
        }
        if (res.msg1) {
          this.spinner = false
          this.spinnerBtn = true
          this.minimumMsg = true
          setTimeout(() => {
            this.minimumMsg = false
          }, 2500)
        }
        if (res.success) {
          this.spinner = false
          this.spinnerBtn = true
          this.modalservice.dismissAll()
          this.toastr.success("Password Changed Successfully", '', { timeOut: 1000 })
          localStorage.clear()
          this.router.navigate(['/'])
        }
      })
    }
  }
}

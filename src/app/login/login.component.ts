import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  constructor(private http: HttpClient, private toaster: ToastrService) {

  }
  ngOnInit(): void {

  }
  submitForm(form: NgForm) {
    if (form.valid) {
      this.http.post("http://192.168.1.151:8000/auth/login", form.value).subscribe((res: any) => {
        console.log(res);
      })
    }
    else {
      this.toaster.error("Enter a Valid Credentials")

      console.log("values not found");
    }
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  loginDetails: any = {

  }
  constructor() {

  }
  ngOnInit(): void {

  }
  submitForm(form: any) {
    console.log(form.value);
  }
}

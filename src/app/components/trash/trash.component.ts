import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { apiurls } from 'src/app/shared/apiurls';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss'],
})
export class TrashComponent {
  TabName: any;
  smtpDetails: any = {};
  spinnerBtn = true;
  spinner = false;
  spinnerBtn1 = true;
  spinner1 = false;
  errMsg = false;
  errMsg1 = false;
  testEmail: any = {};
  gmail: any = '@gmail.com';
  emailFormat = false;
  marshaDetails: any = [];
  constructor(
    private route: Router,
    private http: HttpClient,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private modalSerive: NgbModal
  ) {}

  ngOnInit(): void {
    this.getSmtpUser();
    localStorage.setItem('tabname', 'Groups');
    let headername = {
      name: 'Trash',
    };
    this.route.navigate(['/trash'], { queryParams: headername });
    this.router.queryParamMap.subscribe((res: any) => {
      this.TabName = res.params.name;
    });
    this.getMarshDetails();
  }

  createSmtpUser(form: NgForm) {
    console.log(form.value);
    this.spinner = true;
    this.spinnerBtn = false;
    if (
      !this.smtpDetails.smtpHost ||
      !this.smtpDetails.smtpPort ||
      !this.smtpDetails.user ||
      !this.smtpDetails.password
    ) {
      this.spinner = false;
      this.spinnerBtn = true;
      this.errMsg = true;
      setTimeout(() => {
        this.errMsg = false;
      }, 2000);
    } else {
      this.http.put(apiurls.smptCreate, form.value).subscribe((res: any) => {
        if (res.msg1) {
          this.spinner = false;
          this.spinnerBtn = true;
          this.toastr.success('SMTP User Created Successfully', '', {
            timeOut: 2000,
          });
        }
        if (res.msg) {
          this.spinner = false;
          this.spinnerBtn = true;
          this.toastr.success('SMTP User Updated Successfully', '', {
            timeOut: 2000,
          });
        }
      });
    }
  }
  getSmtpUser() {
    this.http.get(apiurls.smptUser).subscribe((res: any) => {
      res.map((val: any) => {
        console.log(val);
        this.smtpDetails.smtpHost = val?.smtphost;
        this.smtpDetails.smtpPort = val?.smtpport;
        this.smtpDetails.user = val?.smtp_user;
        this.smtpDetails.password = val?.smtp_password;
      });
    });
  }
  testEmailOFSMTP(form: NgForm) {
    this.spinner1 = true;
    this.spinnerBtn1 = false;
    if (!this.testEmail.email) {
      this.spinner1 = false;
      this.spinnerBtn1 = true;
      this.errMsg1 = true;
      setTimeout(() => {
        this.errMsg1 = false;
      }, 2000);
    } else if (!this.testEmail.email.includes(this.gmail)) {
      this.emailFormat = true;
      setTimeout(() => {
        this.spinner1 = false;
        this.spinnerBtn1 = true;
        this.emailFormat = false;
      }, 1500);
    } else {
      this.http.post(apiurls.testMail, form.value).subscribe((res: any) => {
        console.log(res);
        if (res.message) {
          this.spinner1 = false;
          this.spinnerBtn1 = true;
          this.toastr.success('The Above SMTP User is Valid', '', {
            timeOut: 2000,
          });
        }
        if (res.error) {
          this.spinner1 = false;
          this.spinnerBtn1 = true;
          this.toastr.error('The Above SMTP User is Invalid', '', {
            timeOut: 2000,
          });
        }
      });
    }
  }

  getMarshDetails() {
    this.http.get(apiurls.marshaCode).subscribe((res: any) => {
      console.log(res);
      this.marshaDetails = res;
    });
  }
  updateMarshaDetails(form: NgForm, id: any) {
    console.log(form.value, typeof id);
    this.http
      .put(apiurls.updateMarshaHotel + id, form.value)
      .subscribe((res: any) => {
        console.log(res);
        this.modalSerive.dismissAll();
        this.getMarshDetails();
        this.toastr.success('Marsha Updated Successully', '', {
          timeOut: 1500,
        });
      });
  }
  marshaUpdate: any = {};
  detail: any = {};
  openmodal(content: any, marsha: any) {
    this.modalSerive.open(content, {
      backdrop: 'static',
    });
    this.detail = marsha;
  }
}

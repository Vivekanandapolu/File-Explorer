import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { apiurls } from 'src/app/shared/apiurls';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  TabName: any
  dropdownSettings = {};
  selectMsg: any = false
  spinnerBtn: any = true
  spinner = false
  firstletters: any = []
  constructor(private router: ActivatedRoute, private route: Router, private http: HttpClient, private toastr: ToastrService, private modalservice: NgbModal) {
    this.dropdownSettings = {
      singleSelection: false,
      textField: 'itemName',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3
    };
  }
  allUsers: any = []

  addbucket: any = {}
  allBuckets: any = []
  userData: any = {}
  ngOnInit(): void {
    this.getBuckets()
    this.getAllUsers()
    let headername = {
      name: "User management"
    }
    this.route.navigate(['/user-management'], { queryParams: headername })
    this.router.queryParamMap.subscribe((res: any) => {
      this.TabName = res.params.name
    })
  }
  getAllUsers() {
    this.http.get(apiurls.allUsers).subscribe((res: any) => {
      this.allUsers = res
      let ProfileName: any = []
      let data = {
        letter: '',
        name: '',
        bucketname: [],
        userstatus: '',
        member: null
      }
      for (let user in this.allUsers) {
        ProfileName.push(...this.allUsers[user].name.split(','))
        data.letter = ProfileName[user].split('')[0]
        data.name = this.allUsers[user].name
        data.bucketname = this.allUsers[user].bucketname,
          data.userstatus = this.allUsers[user].userstatus,
          data.member = this.allUsers[user].member
      }
      console.log(this.firstletters, "sjbdhsjuhdjsidj");
    })
  }
  enableUser(username: any, status: any) {
    let UserStatus = status
    let data: any = {
      username: username,
    }
    if (UserStatus == 'enabled') {
      data.action = false
    }
    else if (UserStatus == 'disabled') {
      data.action = true
    }
    this.http.post(apiurls.enableuser, data).subscribe((res: any) => {
      console.log(res.message);
      if (res.message == "User disable is successful") {
        this.toastr.error(`Username disable is successful`, '', { timeOut: 1000 })
      }
      if (res.message == "User enable is successful") {
        this.toastr.success(`Username enable is successful`, '', { timeOut: 1000 })
      }
      this.getAllUsers()
    })
  }



  viewUserBuckets(user: any) {
    this.userData.username = user.name
    this.userData.buckets = user?.bucketname?.split(',')
    console.log(this.userData);
  }
  //open modal
  open(content: any, user: any) {
    this.modalservice.open(content, { backdrop: 'static' })
    this.addbucket.username = user.name
    this.addbucket.buckets = user.bucketname.split(',')
  }

  //add buckets to user
  addUserBucket(form: NgForm) {
    this.spinnerBtn = false
    this.spinner = true
    if (!this.addbucket.buckets) {
      this.spinnerBtn = true
      this.spinner = false
      this.selectMsg = true
      setTimeout(() => {
        this.selectMsg = false
      }, 2500)
    }
    let selectedBuckets: any
    selectedBuckets = form.value.buckets.join(',')
    form.value.buckets = selectedBuckets
    console.log(form.value);
    this.http.post(apiurls.addBuckets, form.value).subscribe((res: any) => {
      this.spinnerBtn = true
      this.spinner = false
      this.modalservice.dismissAll();
      this.getAllUsers()
      this.toastr.success('Buckets added successfully')
      console.log(res);
    })

  }


  //get buckets
  getBuckets() {
    this.allBuckets = []
    this.http.get(apiurls.buckets).subscribe((res: any) => {

      for (let i in res.buckets) {
        this.allBuckets.push(res.buckets[i].name)
      }
      console.log(this.allBuckets);

    })
  }
}


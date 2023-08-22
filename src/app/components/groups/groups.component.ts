
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { apiurls } from 'src/app/shared/apiurls';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  groupView = true
  TabName: any
  allGroups: any = []
  BackIndexVal: any = 0
  FrontIndexVal: any = 0
  GroupData: any = []
  spinnerBtn: any = true
  spinner = false
  dropdownSettings = {};
  dropdownSettings1 = {};
  queryParams = {
    BackIndexVal: this.BackIndexVal,
    FrontIndexVal: this.FrontIndexVal
  }
  manageBucketsData: any = {

  }
  manageUsersData: any = {

  }
  constructor(private route: Router, private http: HttpClient, private router: ActivatedRoute, private modalservice: NgbModal, private toastr: ToastrService) {
    this.dropdownSettings = {
      singleSelection: false,
      itemsShowLimit: 3
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      itemsShowLimit: 2
    };
  }

  allBuckets: any = []
  allUsersData: any = []

  ngOnInit(): void {
    this.getAllUsers()
    this.getBuckets()
    localStorage.setItem('tabname', 'Groups')

    this.router.queryParamMap.subscribe((res: any) => {
      this.getAllGroups().then((val: any) => {
        if (!res.params.viewtype || res.params.viewtype == "outer") {
          this.TabName = localStorage.getItem('tabname')
          this.allGroups = val
          this.groupView = true
        }
        else if (res.params.viewtype == "inner") {
          this.TabName = ''
          this.groupView = false
          this.GroupData = [val[res.params?.indexPos]]
        }
      })
    })
  }
  getAllGroups() {
    return new Promise((resolve) => {
      this.http.get(apiurls.allGroups).subscribe((res: any) => {
        resolve(res.groups)
      })
    })
  }

  innerViewGroup(group: any) {
    this.groupView = false
    this.BackIndexVal = this.BackIndexVal + 1
    this.TabName = ''
    this.http.get(apiurls.allGroups).subscribe((res: any) => {
      for (let i of res.groups) {
        if (i.groupName == group?.groupName) {
          this.GroupData = [i]
        }
      }
      const queryParams = {
        viewtype: "inner",
        indexPos: this.allGroups.indexOf(group),
        backIndex: this.BackIndexVal,
        frontIndex: this.FrontIndexVal
      }
      this.route.navigate(['/groups'], { queryParams: queryParams });
    })
  }

  getBuckets() {
    this.http.get(apiurls.buckets).subscribe((res: any) => {
      res.buckets.filter((bucket: any) => {
        this.allBuckets.push(bucket.name)
      })
    })
  }

  open(content: any, group: any) {
    this.modalservice.open(content, {
      backdrop: "static"
    })
    console.log(group);
    this.manageBucketsData.groupName = group?.groupName
    this.manageUsersData.groupName = group?.groupName
    this.manageBucketsData.buckets = group?.groupPolicy
    this.manageUsersData.users = group.members
  }
  getallgroups() {
    this.http.get(apiurls.allGroups).subscribe((res: any) => {
      this.allGroups = res.groups
    })
  }


  getAllgroupBucketsAndUsers() {
    this.router.queryParamMap.subscribe((res: any) => {
      this.getAllGroups().then((val: any) => {
        if (!res.params.viewtype || res.params.viewtype == "outer") {
          this.TabName = localStorage.getItem('tabname')
          this.allGroups = val
          this.groupView = true
        }
        else if (res.params.viewtype == "inner") {
          this.TabName = ''
          this.groupView = false
          this.GroupData = [val[res.params?.indexPos]]
        }
      })
    })
  }
  newBukcet(val: any) {
    if (val) {
      this.getallgroups()
    }
  }
  manageBuckets(form: NgForm) {
    this.spinner = true
    this.spinnerBtn = false
    if (form.invalid) {
      this.spinner = false
      this.spinnerBtn = true
    }
    else {
      form.value.buckets = form.value.buckets?.join(',')
      this.http.post(apiurls.manageBuckets, form.value).subscribe((res: any) => {
        console.log(res);
        if (res?.group_update) {
          this.getAllgroupBucketsAndUsers()
          this.modalservice.dismissAll()
          this.spinner = false
          this.spinnerBtn = true
          this.toastr.success("Buckets Updated Successfully", '', {
            timeOut: 1500
          })
        }
      })
    }
  }

  getAllUsers() {
    this.http.get(apiurls.allUsers).subscribe((res: any) => {
      res.filter((user: any) => {
        console.log(user.name);
        return this.allUsersData.push(user.name)
      })
      console.log(this.allUsersData);
    })
  }

  manageUsers(form: NgForm) {
    this.spinner = true
    this.spinnerBtn = false
    if (form.invalid) {
      this.spinner = false
      this.spinnerBtn = true
    }
    else {
      form.value.users = form.value.users?.join(',')
      this.http.post(apiurls.manageUsers, form.value).subscribe((res: any) => {
        console.log(res);
        if (res?.group_users) {
          this.getAllgroupBucketsAndUsers()
          this.modalservice.dismissAll()
          this.spinner = false
          this.spinnerBtn = true
          this.toastr.success("Users Updated Successfully", '', {
            timeOut: 1500
          })
        }
        if (res.group_member) {
          this.getAllgroupBucketsAndUsers()
          this.modalservice.dismissAll()
          this.spinner = false
          this.spinnerBtn = true
          this.toastr.success("Users Updated Successfully", '', {
            timeOut: 1500
          })
        }
      })
    }
  }
}

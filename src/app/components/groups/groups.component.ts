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
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  groupView = true;
  TabName: any;
  allGroups: any = [];
  BackIndexVal: any = 0;
  FrontIndexVal: any = 0;
  GroupData: any = [];
  spinnerBtn: any = true;
  spinner = false;
  dropdownSettings = {};
  dropdownSettings1 = {};
  queryParams = {
    BackIndexVal: this.BackIndexVal,
    FrontIndexVal: this.FrontIndexVal,
  };
  manageBucketsData: any = {};
  manageUsersData: any = {};

  allBucketsView = false;
  constructor(
    private route: Router,
    private http: HttpClient,
    private router: ActivatedRoute,
    private modalservice: NgbModal,
    private toastr: ToastrService
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      itemsShowLimit: 3,
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      itemsShowLimit: 2,
    };
  }

  allBuckets: any = [];
  allUsersData: any = [];
  groupView1: any = false;
  groupBuckets: any = [];

  viewBtn = false;

  ngOnInit(): void {
    this.getAllUsers();
    this.getBuckets();
    localStorage.setItem('tabname', 'Groups');

    this.router.queryParamMap.subscribe((res: any) => {
      this.getAllGroups().then((val: any) => {
        console.log(res);
        if (!res.params.viewtype || res.params.viewtype == 'outer') {
          this.TabName = localStorage.getItem('tabname');
          this.allGroups = val;
          this.groupView = true;
          this.groupView1 = false;
          this.allBucketsView = false;
        } else if (res.params.viewtype == 'inner') {
          this.TabName = res.params.tabname;
          this.groupView = false;
          this.groupView1 = true;
          this.allBucketsView = false;
          this.GroupData = [val[res.params?.indexPos]];
        } else if (res.params.viewtype == 'viewallbuckets') {
          // console.log(val);
          this.TabName = res.params.tabname;
          this.groupView = false;
          this.groupView1 = false;
          this.allBucketsView = true;

          this.groupBuckets = val[res.params?.indexPos]?.groupPolicy;
          if (val[res.params?.indexPos]?.groupPolicy.length >= 3) {
            this.viewBtn = true;
          }
        }
      });
    });
  }
  getAllGroups() {
    return new Promise((resolve) => {
      this.http.get(apiurls.allGroups).subscribe((res: any) => {
        resolve(res.groups);
      });
    });
  }

  getBuckets() {
    this.http.get(apiurls.buckets).subscribe((res: any) => {
      res.buckets.filter((bucket: any) => {
        this.allBuckets.push(bucket.name.toLowerCase());
        console.log(bucket);
      });
    });
  }

  open(content: any, group: any) {
    this.modalservice.open(content, {
      backdrop: 'static',
    });
    console.log(group);
    this.manageBucketsData.groupName = group?.groupName;
    this.manageUsersData.groupName = group?.groupName;
    this.manageBucketsData.buckets = group?.groupPolicy;
    this.manageUsersData.users = group.members;
  }
  getallgroups() {
    this.http.get(apiurls.allGroups).subscribe((res: any) => {
      this.allGroups = res.groups;
    });
  }

  getAllgroupBucketsAndUsers() {
    this.router.queryParamMap.subscribe((res: any) => {
      this.getAllGroups().then((val: any) => {
        if (!res.params.viewtype || res.params.viewtype == 'outer') {
          this.TabName = localStorage.getItem('tabname');
          this.allGroups = val;
          this.groupView = true;
        } else if (res.params.viewtype == 'inner') {
          this.TabName = res.params.tabname;
          this.groupView = false;
          this.groupView1 = true;

          this.GroupData = [val[res.params?.indexPos]];
        }
      });
    });
  }
  newBukcet(val: any) {
    if (val) {
      this.getallgroups();
    }
  }
  manageBuckets(form: NgForm, group: any) {
    this.spinner = true;
    this.spinnerBtn = false;
    if (form.invalid) {
      this.spinner = false;
      this.spinnerBtn = true;
    } else {
      this.router.queryParamMap.subscribe((params: any) => {
        console.log(params.params.tabname, 'params');
      });
      form.value.buckets = form.value.buckets?.join(',').toLowerCase();
      this.http
        .post(apiurls.manageBuckets, form.value)
        .subscribe((res: any) => {
          console.log(res);
          if (res?.group_update) {
            this.getAllgroupBucketsAndUsers();
            this.modalservice.dismissAll();
            this.TabName = group.groupName;
            this.spinner = false;
            this.spinnerBtn = true;
            this.toastr.success('Buckets Updated Successfully', '', {
              timeOut: 1500,
            });
          }
          if (res.policies) {
            this.TabName = group.groupName;
            this.getAllgroupBucketsAndUsers();
            this.modalservice.dismissAll();
            this.spinner = false;
            this.spinnerBtn = true;
            this.toastr.success('Buckets Updated Successfully', '', {
              timeOut: 1500,
            });
          }
        });
    }
  }

  getAllUsers() {
    this.http.get(apiurls.allUsers).subscribe((res: any) => {
      res.filter((user: any) => {
        // console.log(user.name);
        return this.allUsersData.push(user.name);
      });
      // console.log(this.allUsersData);
    });
  }

  manageUsers(form: NgForm) {
    this.spinner = true;
    this.spinnerBtn = false;
    if (form.invalid) {
      this.spinner = false;
      this.spinnerBtn = true;
    } else {
      form.value.users = form.value.users?.join(',');
      this.http.post(apiurls.manageUsers, form.value).subscribe((res: any) => {
        console.log(res);
        if (res?.group_users) {
          this.getAllgroupBucketsAndUsers();
          this.modalservice.dismissAll();
          this.spinner = false;
          this.spinnerBtn = true;
          this.toastr.success('Users Updated Successfully', '', {
            timeOut: 1500,
          });
        }
        if (res.group_member) {
          this.getAllgroupBucketsAndUsers();
          this.modalservice.dismissAll();
          this.spinner = false;
          this.spinnerBtn = true;
          this.toastr.success('Users Updated Successfully', '', {
            timeOut: 1500,
          });
        }
      });
    }
  }

  innerViewGroup(group: any) {
    // console.log(group.groupName);
    this.groupView = false;
    this.groupView1 = true;
    this.BackIndexVal = this.BackIndexVal + 1;

    this.http.get(apiurls.allGroups).subscribe((res: any) => {
      const queryParams = {
        viewtype: 'inner',
        indexPos: this.allGroups.indexOf(group),
        backIndex: this.BackIndexVal,
        frontIndex: this.FrontIndexVal,
        tabname: group.groupName,
      };
      for (let i of res.groups) {
        if (i.groupName == group?.groupName) {
          this.GroupData = [i];
        }
      }
      this.route.navigate(['/groups'], { queryParams: queryParams });
    });
  }

  //All Buckets view

  ViewallBuckets(group: any) {
    this.allBucketsView = true;
    this.groupView1 = false;
    this.groupView = false;
    this.BackIndexVal = this.BackIndexVal + 1;
    this.http.get(apiurls.allGroups).subscribe((res: any) => {
      let queryParams = {
        viewtype: 'viewallbuckets',
        indexPos: this.allGroups.indexOf(group),
        backIndex: this.BackIndexVal,
        frontIndex: this.FrontIndexVal,
        tabname: group.groupName,
      };
      for (let i of res.groups) {
        if (i.groupName == group?.groupName) {
          this.groupBuckets = i.groupPolicy;
          queryParams.indexPos = res.groups.indexOf(i);
          console.log(this.groupBuckets);
        }
      }
      this.route.navigate(['/groups'], { queryParams: queryParams });
    });
  }

  groupSearch(groups: any) {
    this.allGroups = groups;
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
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
  constructor(private route: Router, private http: HttpClient, private router: ActivatedRoute) {

  }


  ngOnInit(): void {
    localStorage.setItem('tabname', 'Groups')
    let headername = {
      name: "Groups"
    }
    this.route.navigate(['/groups'], { queryParams: headername })
    this.router.queryParamMap.subscribe((res: any) => {
      this.TabName = res.params.name
      if (!res.get('groupData')) {
        this.groupView = true
        this.getAllGroups()
        this.GroupData = []
      }
      else {
        this.groupView = false
        this.getGroupDatabyParams(res.get('groupData'))
      }
    })
  }
  getAllGroups() {
    this.http.get(apiurls.allGroups).subscribe((res: any) => {
      this.allGroups = res.groups
      console.log(this.allGroups);
    })
  }

  innerViewGroup(groupName: any) {

    this.groupView = false
    this.BackIndexVal = this.BackIndexVal + 1
    console.log(this.BackIndexVal);
    this.TabName = ''
    this.http.get(apiurls.allGroups).subscribe((res: any) => {
      for (let i of res.groups) {
        if (i.groupName == groupName) {
          this.GroupData = [i]
        }
      }
      console.log(this.GroupData, "hello");
      const queryParams = {
        groupData: JSON.stringify(this.GroupData),
        backIndex: this.BackIndexVal,
        frontIndex: this.FrontIndexVal
      }
      this.route.navigate(['/groups'], { queryParams: queryParams });
    })
  }


  getGroupDatabyParams(groupData: any) {
    console.log(this.GroupData);
    this.loopArray(this.GroupData, groupData)
  }

  loopArray(arr: any, groupData: any) {
    console.log(arr, JSON.parse(groupData));
    // for (let i = 0; i < arr.length; i++) {
    //   if (arr[i].path == path) {
    //     this.groupView = false
    //     let data = {
    //       files: arr[i].files,
    //       folderName: arr[i].folderName,
    //       type: "folder",
    //       path: path
    //     }
    //     this.GroupData = [data]

    //     console.log(this.GroupData, "2");
    //     return
    //   } else {
    //     this.loopArray(arr[i].files, path);
    //   }
    // }
  }
}

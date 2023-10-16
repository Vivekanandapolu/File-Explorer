import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { apiurls } from 'src/app/shared/apiurls';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  TabName: any;
  series = [
    {
      name: `Success  ${70}`,
      value: 70,
      label: '70%',
    },
    {
      name: `Error   ${30}`,
      value: 20,
      label: '30%',
    },
  ];
  colorScheme: any = {
    domain: ['#47EC44', '#DD2025'],
  };
  allBuckets: any = [];
  allUsers: any = [];
  allGroups: any = [];
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.router.navigate(['/dashboard'], {
      queryParams: { name: 'Dashboard' },
    });
    // this.route.queryParamMap.subscribe((params: any) => {
    //   console.log(params.params);
    //   if (params.has('name')) {
    //     this.TabName = params.get('name');
    //   }
    // });

    this.getAllUsers();
    this.getBuckets();
    this.getAllGroups();
  }

  getAllUsers() {
    // this.TabName = localStorage.getItem('tabname');
    // console.log( this.TabName);
    this.http.get(apiurls.allUsers).subscribe((res: any) => {
      this.allUsers = res;
      console.log(this.allUsers.length);
    });
  }

  getBuckets() {
    this.allBuckets = [];
    this.http.get(apiurls.buckets).subscribe((res: any) => {
      console.log(res.buckets);
      this.allBuckets = res.buckets;
    });
  }

  getAllGroups() {
    this.http.get(apiurls.allGroups).subscribe((res: any) => {
      this.allGroups = res.groups;
      console.log(this.allGroups);
    });
  }
  pieChartLabel(series: any[], name: string): string {
    const item = series.filter((data) => data.name === name);
    if (item.length > 0) {
      return item[0].label;
    }
    return name;
  }
}

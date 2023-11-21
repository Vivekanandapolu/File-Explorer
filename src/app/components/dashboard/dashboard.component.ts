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
      name: `Hello  ${7}`,
      value: 7,
      label: '70%',
    },
    {
      name: `Error   ${3}`,
      value: 3,
      label: '30%',
    },
  ];
  softwareData: any = {};
  propertyDetails: any[] = [];
  title: any;
  innerView: boolean = true;
  statusLogs: any = [];
  colorScheme: any = {
    domain: ['#47EC44', '#DD2025'],
  };
  allBuckets: any = [];
  allUsers: any = [];
  allGroups: any = [];
  applications: any = [];
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.router.navigate(['/dashboard'], {
      queryParams: { name: 'Dashboard' },
    });
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.has('name')) {
        this.title = params.params.name;
        this.title = this.TabName = params.get('name');
        this.innerView = true;
      } else {
        this.innerView = false;
        this.title = params.params.softwareName;
      }
    });

    this.getAllUsers();
    this.getBuckets();
    this.getAllGroups();
    this.getServerStatusLogs();
    this.getApplications();
    this.getAllSoftwares();
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
  getApplications() {
    this.http.get(apiurls.applicationLogs).subscribe((res: any) => {
      this.applications = res;
    });
  }
  pieChartLabel(series: any[], name: string): string {
    const item = series.filter((data) => data.name === name);
    if (item.length > 0) {
      return item[0].label;
    }
    return name;
  }

  getServerStatusLogs() {
    let data = [];
    this.http.get(apiurls.charts).subscribe((res: any) => {
      this.statusLogs.push(...res);
      this.statusLogs.map((val: any) => {
        console.log(val);
      });
      // console.log(this.statusLogs, this.series);
    });
  }
  innerDashboardView(softwareName: any) {
    this.innerView = false;
    let params: any = {
      backIndex: 1,
      frontIndex: -1,
      softwareName: softwareName,
    };
    softwareName = softwareName[0].toUpperCase() + softwareName.slice(1);
    this.router.navigate(['/dashboard'], { queryParams: params });
    this.http
      .get(apiurls.softwarePropertyDetails + softwareName)
      .subscribe((res: any) => {
        this.propertyDetails = res;
        console.log(this.propertyDetails.length);
      });
  }

  getAllSoftwares() {
    this.http.get(apiurls.allSoftwares).subscribe((res: any) => {
      console.log(res);
      this.softwareData = res;
    });
  }
}

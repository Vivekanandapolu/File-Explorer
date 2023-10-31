import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { apiurls } from 'src/app/shared/apiurls';

@Component({
  selector: 'app-application-logs',
  templateUrl: './application-logs.component.html',
  styleUrls: ['./application-logs.component.scss'],
})
export class ApplicationLogsComponent implements OnInit {
  logs: any = [];
  currentSelectedMonth: any = '';
  currentProperty: any = '';
  date = new Date();
  monthNames: any = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  total_logs_data: any = [];
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    console.log(' ===== ngOnIn');
    // this.currentSelectedMonth = this.monthNames[this.date.getUTCMonth()];
    localStorage.setItem('tabname', 'Application Logs');
    this.route.queryParamMap.subscribe((params: any) => {
      console.log('params ==== ', params);
      this.currentSelectedMonth = params.params.month_name
        ? params.params.month_name
        : this.monthNames[this.date.getUTCMonth()];

      this.currentProperty = params.params.property_name
        ? params.params.property_name
        : 'Shiji';
      this.getApplicationLogs();
    });
  }
  getApplicationLogs() {
    console.log(' ===== ');
    this.http.get(apiurls.applicationLogs).subscribe((res: any) => {
      this.total_logs_data = res;
      this.logs = res.filter(
        (each: any) => each?.software == this.currentProperty.trim()
      );
    });
  }
  selectedMonth(monthName: any) {
    let name: any;

    this.route.queryParamMap.subscribe((params: any) => {
      name = params.params.property_name;
    });
    this.currentSelectedMonth = monthName;
    this.router.navigate(['/application_logs'], {
      queryParams: {
        month_name: monthName,
        name: 'Application Logs',
        property_name: name,
      },
    });
    let monthValues: any = [];
    this.logs.filter((property: any) => {
      monthValues = property.months;
    });
  }
  selectedProperty(Property: any) {
    let name: any;
    this.route.queryParamMap.subscribe((params: any) => {
      name = params.params.month_name;
    });
    this.router.navigate(['/application_logs'], {
      queryParams: {
        name: 'Application Logs',
        property_name: Property,
        month_name: name,
      },
    });
    this.logs = this.total_logs_data.filter((property: any) => {
      if (property.software == Property) {
        return property;
      }
    });
  }
}

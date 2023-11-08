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
  finalData: any = [];
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
    // this.currentSelectedMonth = this.monthNames[this.date.getUTCMonth()];
    localStorage.setItem('tabname', 'Application Logs');
    this.route.queryParamMap.subscribe((params: any) => {
      this.currentSelectedMonth = params.params.month_name
        ? params.params.month_name
        : this.monthNames[this.date.getUTCMonth()];

      this.currentProperty = params.params.property_name
        ? params.params.property_name
        : 'Shiji';
      this.getApplicationLogs();
      this.currentPropertyData(params.params.property_name);
    });
  }
  getApplicationLogs() {
    this.finalData = [];
    this.http.get(apiurls.applicationLogs).subscribe((res: any) => {
      this.total_logs_data = res;
      this.logs = res.filter((each: any) => {
        if (each?.software == this.currentProperty.trim()) {
          let data = {
            software: this.currentProperty.trim(),
            property: each?.property,
            property_name: each?.property_name,
            monthName: this.currentSelectedMonth,
            month: each.months[this.currentSelectedMonth],
          };
          this.finalData.push(data);
        }
      });
      console.log(this.finalData, '=======');
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
    this.currentPropertyData(name);
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
    this.currentPropertyData(name);
  }

  currentPropertyData(name: any) {
    this.finalData = [];
    this.logs.filter((property: any) => {
      if (property?.software == name) {
        let data = {
          software: name,
          property: property?.property,
          property_name: property?.property_name,
          monthName: this.currentSelectedMonth,
          month: property.months[this.currentSelectedMonth],
        };
        this.finalData.push(data);
      }
    });
  }
}

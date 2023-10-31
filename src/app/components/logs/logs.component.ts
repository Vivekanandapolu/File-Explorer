import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { apiurls } from 'src/app/shared/apiurls';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  userLogs: any[] = [];
  serverLogs: any[] = [];
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedDate: NgbDateStruct | undefined;

  filteredLogs: any = [];

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    localStorage.setItem('tabname', 'Logs');
    this.getUserLogs();
    this.getServerLogs();
  }

  getUserLogs() {
    this.http.get(apiurls.userLogs).subscribe((logs: any) => {
      this.userLogs = logs;
    });
  }

  getServerLogs() {
    this.http.get(apiurls.serverLogs).subscribe((logs: any) => {
      this.serverLogs = logs;
      console.log(this.serverLogs, '====');
    });
  }

  sortByDate(type: any) {
    // Toggle the sort direction
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    // Sort the userLogs array based on the 'created_at' date
    if (type == 'user') {
      this.userLogs.sort((a, b) => {
        const dateA: any = new Date(a.created_at);
        const dateB: any = new Date(b.created_at);

        if (this.sortDirection === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }
    if (type == 'server') {
      this.serverLogs.sort((a, b) => {
        const dateA: any = new Date(a.timestamp);
        const dateB: any = new Date(b.timestamp);

        if (this.sortDirection === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }
  }

  DateFilteredUserLogs(logs: any) {
    this.userLogs = logs;
    console.log(logs, '=====');
  }
  dateFilteredServerLogs(logs: any) {
    this.serverLogs = logs;
    console.log(logs, '++++');
  }
}

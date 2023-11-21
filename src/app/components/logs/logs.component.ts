import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { apiurls } from 'src/app/shared/apiurls';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  pageSize = 50;
  pageSizeServer = 150;
  showCount = true;
  totalServerCount!: number;
  totalUserCount!: number;
  collectionSize: any;
  serverLogCount: number = this.pageSizeServer;
  userLogs: any[] = [];
  serverLogs: any[] = [];
  users: any = [];
  servers: any = [];
  userLogCount: number = this.pageSize;
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedDate: NgbDateStruct | undefined;
  hasMore!: boolean;
  serverHasMore!: boolean;
  filteredLogs: any = [];

  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    localStorage.setItem('tabname', 'Logs');
    this.getUserLogs();
    this.getServerLogs();
  }

  getUserLogs() {
    this.http
      .get(apiurls.userLogs, {
        params: {
          start: 0,
          limit: this.pageSize,
        },
      })
      .subscribe((logs: any) => {
        this.totalUserCount = logs.logs_count;
        this.hasMore = logs.has_more;
        this.userLogs = logs.logs;
        this.users = logs.logs;
        this.collectionSize = this.userLogs.length;
        console.log(this.userLogs, '====users');
      });
  }

  getServerLogs() {
    this.http
      .get(apiurls.serverLogs, {
        params: {
          start: 0,
          limit: this.pageSizeServer,
        },
      })
      .subscribe((logs: any) => {
        this.totalServerCount = logs.logs_count;
        this.serverHasMore = logs.has_more;

        this.serverLogs = logs.logs;
        this.servers = logs.logs;
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

  loadMoreLogs(type: any) {
    if (type == 'user') {
      this.http
        .get(apiurls.userLogs, {
          params: {
            start: this.userLogs.length,
            limit: this.pageSize,
          },
        })
        .subscribe((logs: any) => {
          this.hasMore = logs.has_more;
          this.userLogs.push(...logs.logs);
          this.userLogCount = this.userLogs.length;
          console.log(this.userLogs, '====server');
        });
    }
    if (type == 'server') {
      this.http
        .get(apiurls.serverLogs, {
          params: {
            start: this.serverLogs.length,
            limit: this.pageSizeServer,
          },
        })
        .subscribe((logs: any) => {
          this.serverHasMore = logs.has_more;
          this.serverLogs.push(...logs.logs);
          console.log(this.serverLogs, '====server');
          this.serverLogCount = this.serverLogs.length;
        });
    }
  }
  selectedDateOnCalendar(e: any) {
    this.showCount = false;
    let log1: any = [];
    let log2: any = [];
    log1 = this.userLogs.filter((user: any) => {
      if (user.created_at.split('T').includes(e)) {
        return user;
      }
    });
    if (log1.length) {
      this.userLogs = log1;
      this.showCount = false;
    } else {
      this.showCount = true;
      this.userLogs = this.users;
    }
    if (log2.length) {
      this.serverLogs = log2;
      this.showCount = false;
    } else {
      this.showCount = true;
      this.serverLogs = this.servers;
    }
    this.serverLogs = this.serverLogs.filter((user: any) => {
      if (user.timestamp.split(' ').includes(e)) {
        return user;
      }
    });
    if (e == null) {
      this.showCount = true;
      this.getUserLogs();
      this.getServerLogs();
    }
  }
}

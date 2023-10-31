declare var $: any;
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { apiurls } from '../shared/apiurls';
import { FormControl, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ParseSpan } from '@angular/compiler';

import {
  NgbDateStruct,
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss'],
})
export class GlobalHeaderComponent implements OnInit {
  selectedMonth: any;
  selectedProperty: any;
  currentMonth = new Date();
  date!: { year: number; month: number };

  selectedDate: NgbDateStruct | undefined;

  serverLogs: any[] = [];
  filteredUserLogs: any = [];
  filteredServerLogs: any = [];
  userLogs: any[] = [];
  @ViewChild('datePicker') datePicker!: ElementRef;
  @Input() Label: any;
  @Input() Back: any;
  @Input() Forward: any;
  @Input() tabname: any;
  @Output() userLogData: EventEmitter<string> = new EventEmitter<string>();
  @Output() month: EventEmitter<string> = new EventEmitter<string>();
  @Output() property: EventEmitter<string> = new EventEmitter<string>();
  @Output() serverLogData: EventEmitter<string> = new EventEmitter<string>();
  @Output() outputData: EventEmitter<string> = new EventEmitter<string>();
  @Output() view_con: EventEmitter<string> = new EventEmitter<string>();
  @Output() createbucket_res: EventEmitter<string> = new EventEmitter<string>();
  @Output() creategroup: EventEmitter<string> = new EventEmitter<string>();
  @Output() createuser: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchBucket: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchInnerBucektData: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() searchUsers: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchGroups: EventEmitter<string> = new EventEmitter<string>();
  nameErr: any = false;
  prev = true;
  next = true;
  previousVal: number = 0;
  list: any;
  viewVal: Boolean = true;
  viewIcons = true;
  errMsg = false;
  emailErr = false;
  newBucketData: any = {
    bucket_name: '',
  };

  NewUserData: any = {
    Name: '',
    username: '',
    Bukcets: [],
  };
  dateOptions: string[] = [
    '2023-10-17',
    '2023-10-18',
    '2023-10-19',
    // Add more date options as needed
  ];

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

  Groupdata: any = {};
  bucketName: any;
  searchVal: any = '';
  alreadyExists = false;
  dropdownSettings: any;
  spinner = false;
  spinnerBtn = true;
  specialChars = false;
  usertype: any = false;
  allBuckets: any = [];
  buckets: any = [];
  category = true;
  dateControl = new FormControl();
  constructor(
    private toastr: ToastrService,
    private location: Location,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalservice: NgbModal,
    private calendar: NgbCalendar,
    private formatter: NgbDateParserFormatter
  ) {
    this.dropdownSettings = {
      singleSelection: false, // Allow multiple selections
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      // ... other settings
    };
  }

  ngOnInit(): void {
    this.selectedMonth = this.monthNames[this.currentMonth.getUTCMonth()];
    this.selectedProperty = 'Shiji';

    let tabname = localStorage.getItem('tabname');

    if (tabname == 'Logs') {
      this.getUserLogs();
      this.getServerLogs();
    }
    if (tabname == 'User management') {
      this.getAllUsers();
    }

    if (
      tabname == 'User management' ||
      tabname == 'Groups' ||
      tabname == 'Trash' ||
      tabname == 'Dashboard' ||
      tabname == 'Logs' ||
      tabname == 'Application Logs'
    ) {
      this.category = false;
    }
    if (tabname == 'Buckets') {
      this.category = true;
      this.getBuckets();
    }
    if (localStorage.getItem('userType') == 'admin') {
      this.usertype = true;
    }
    if (localStorage.getItem('view') == 'grid') {
      this.viewVal = true;
    } else if (localStorage.getItem('view') == 'list') {
      this.viewVal = false;
    }
    this.route.queryParamMap.subscribe((res: any) => {
      this.list = res.get('view');
    });
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.params.month_name) {
        this.selectedMonth = params.params.month_name;
      } else {
        this.selectedMonth = this.monthNames[this.currentMonth.getUTCMonth()];
      }
      if (params.params.property_name) {
        this.selectedProperty = params.params.property_name;
      } else {
        this.selectedProperty = 'Shiji';
      }
      this.searchVal = '';
      // console.log(params);
      this.tabname = params.get('name') || params.get('tabname');
      this.Back = Number(params.get('backIndex'));
      this.Forward = Number(params.get('frontIndex'));
      if (this.Back == 0) {
        this.prev = true;
      }
      if (this.Back > 0) {
        this.prev = false;
      }
      if (this.previousVal == 0) {
        this.next = true;
      } else if (this.previousVal > 0) {
        this.next = false;
      }
    });
  }
  onMonthSelected() {
    this.month.emit(this.selectedMonth);
  }
  open(content: any) {
    this.modalservice.open(content, { backdrop: 'static' });
  }
  //All Buckets
  getBuckets() {
    this.allBuckets = [];
    this.http.get(apiurls.buckets).subscribe((res: any) => {
      for (let i in res.buckets) {
        this.buckets.push(res.buckets[i].name);
      }
    });
  }

  //Create Bucket
  createBucket(form: NgForm) {
    this.spinnerBtn = false;
    this.spinner = true;
    let pattern = /\s/;
    let pattern1 = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

    if (
      this.newBucketData.bucket_name == '' ||
      this.newBucketData.bucket_name.length < 3
    ) {
      this.spinnerBtn = true;
      this.spinner = false;
      this.errMsg = true;
      setTimeout(() => {
        this.errMsg = false;
      }, 2500);
    } else if (
      pattern.test(form.value.bucket_name) ||
      pattern1.test(form.value.bucket_name)
    ) {
      this.spinnerBtn = true;
      this.spinner = false;
      this.specialChars = true;
      setTimeout(() => {
        this.specialChars = false;
      }, 2500);
    } else {
      form.value.bucket_name = form.value.bucket_name.toLowerCase();
      this.http.post(apiurls.newBucket, form.value).subscribe((res: any) => {
        if (res.message1) {
          this.spinner = false;
          this.spinnerBtn = true;
          this.nameErr = true;
          setTimeout(() => {
            this.nameErr = false;
          }, 2000);
        } else {
          this.modalservice.dismissAll();
          this.newBucketData = {};
          this.spinnerBtn = true;
          this.spinner = false;
          this.createbucket_res.emit(res.message);
        }
      });
    }
  }

  goBack() {
    this.location.back();
    this.previousVal++;
  }

  goForward() {
    this.location.forward();
    this.previousVal--;
  }

  sendData(folder: any) {
    this.outputData.emit(folder);
    for (let i in this.Label) {
      if (folder?.folder == this.Label[i]?.folder) {
        this.Label = this.Label.slice(
          0,
          this.Label?.indexOf(this.Label[i]) + 1
        );
      }
    }
    this.route.queryParamMap.subscribe((params: any) => {
      if (params?.params) {
        let dataOfFolder: any = JSON.parse(params?.params?.data || null);
        this.Label = dataOfFolder;
      }
    });
  }

  viewType(type: string) {
    localStorage.setItem('view', type);

    if (localStorage.getItem('view') == 'grid') {
      this.viewVal = true;
    } else if (localStorage.getItem('view') == 'list') {
      this.viewVal = false;
    }
    this.list = localStorage.getItem('view');
    this.view_con.emit(this.list);
  }

  //Create User
  AllfieldsErr = false;

  createUser(form: NgForm) {
    this.spinnerBtn = false;
    this.spinner = true;
    if (form.value.name == '' || form.value.username == '') {
      this.spinnerBtn = true;
      this.spinner = false;
      this.AllfieldsErr = true;
      setTimeout(() => {
        this.AllfieldsErr = false;
      }, 2500);
    } else if (!form?.value?.username?.includes('@gmail.com')) {
      this.spinner = false;
      this.spinnerBtn = true;
      this.emailErr = true;
      setTimeout(() => {
        this.emailErr = false;
      }, 2000);
    } else {
      form.value.username = form.value.username.toLowerCase();
      this.http.post(apiurls.createUser, form.value).subscribe((res: any) => {
        if (res.detail) {
          this.spinnerBtn = true;
          this.spinner = false;
          this.alreadyExists = true;
          setTimeout(() => {
            this.alreadyExists = false;
          }, 2500);
        }
        if (res.msg) {
          this.createuser.emit(res.msg);
          this.spinner = true;
          this.modalservice.dismissAll();
          this.spinnerBtn = true;
          this.spinner = false;
          this.toastr.success('User Created Successfully');
          this.getAllUsers();
          this.NewUserData = {};
        }
      });
    }
  }

  getAllUsers() {
    this.http.get(apiurls.allUsers).subscribe((res: any) => {});
  }

  createGroup(form: NgForm) {
    this.spinnerBtn = false;
    this.spinner = true;
    if (!this.Groupdata.group) {
      this.spinnerBtn = true;
      this.spinner = false;
      this.AllfieldsErr = true;
      setTimeout(() => {
        this.AllfieldsErr = false;
      }, 2000);
    } else {
      this.http.post(apiurls.addGroup, form.value).subscribe((res: any) => {
        this.spinnerBtn = true;
        this.spinner = false;
        if (res?.exists) {
          this.spinnerBtn = true;
          this.spinner = false;
          this.alreadyExists = true;
          setTimeout(() => {
            console.log(this.alreadyExists);
            this.alreadyExists = false;
          }, 1500);
        }
        if (res?.created) {
          this.creategroup.emit(res.created);
          this.toastr.success('Group Added Successfully', '', {
            timeOut: 1500,
          });
          this.modalservice.dismissAll();
        }
      });
    }
  }

  performSearch() {
    let arr: any = [];
    this.http.get(apiurls.buckets).subscribe((res: any) => {
      res.buckets.filter((val: any) => {
        if (val.name.toLowerCase().includes(this.searchVal.toLowerCase())) {
          arr.push(val);
        } else if (
          val.property_name.toLowerCase().includes(this.searchVal.toLowerCase())
        ) {
          arr.push(val);
        }
      });
      this.searchBucket.emit(arr);
    });
  }
  userSearch() {
    let users: any = [];
    this.http.get(apiurls.allUsers).subscribe((res: any) => {
      res.filter((val: any) => {
        if (val.name.split('@')[0].includes(this.searchVal.toLowerCase())) {
          console.log(val);
          users.push(val);
        }
      });
    });
    this.searchUsers.emit(users);
  }

  groupSearch() {
    let groupArr: any = [];
    this.http.get(apiurls.allGroups).subscribe((res: any) => {
      res.groups.filter((val: any) => {
        if (val.groupName.includes(this.searchVal)) {
          groupArr.push(val);
        }
      });
    });
    this.searchGroups.emit(groupArr);
  }

  getUserLogs() {
    this.http.get(apiurls.userLogs).subscribe((logs: any) => {
      this.userLogs = logs;
    });
  }

  getServerLogs() {
    this.http.get(apiurls.serverLogs).subscribe((logs: any) => {
      this.serverLogs = logs;
    });
  }
  onDateSelect(selectedDate: NgbDateStruct) {
    this.selectedDate = selectedDate;

    this.filteredUserLogs = this.userLogs.filter((log) => {
      const logDateParts = log.created_at.split(' ')[0].split('-');
      const logDate: NgbDateStruct = {
        year: +logDateParts[0],
        month: +logDateParts[1],
        day: +logDateParts[2].slice(0, 2),
      };
      return (
        logDate?.year === selectedDate?.year &&
        logDate?.month === selectedDate?.month &&
        logDate?.day === selectedDate?.day
      );
    });
    if (this.selectedDate == null) {
      this.filteredUserLogs = this.userLogs;
    }
    this.userLogData.emit(this.filteredUserLogs);

    this.filteredServerLogs = this.serverLogs.filter((log) => {
      const logDateParts = log.timestamp.split(' ')[0].split('-');
      const logDate: NgbDateStruct = {
        year: +logDateParts[0],
        month: +logDateParts[1],
        day: +logDateParts[2].slice(0, 2),
      };

      return (
        logDate?.year === selectedDate?.year &&
        logDate?.month === selectedDate?.month &&
        logDate?.day === selectedDate?.day
      );
    });
    if (this.selectedDate == null) {
      this.filteredServerLogs = this.serverLogs;
    }

    this.serverLogData.emit(this.filteredServerLogs);
  }

  onPropertySelected() {
    this.property.emit(this.selectedProperty);
  }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { apiurls } from '../shared/apiurls';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent implements OnInit, OnChanges {

  @Input() Label: any
  @Input() Back: any
  @Input() Forward: any
  @Input() tabname: any
  @Output() outputData: EventEmitter<string> = new EventEmitter<string>();
  @Output() view_con: EventEmitter<string> = new EventEmitter<string>();
  @Output() createbucket_res: EventEmitter<string> = new EventEmitter<string>();
  prev = true
  next = true
  previousVal: number = 0
  list: any
  viewVal: Boolean = true
  viewIcons = true
  errMsg = false
  newBucketData: any =
    {
      bucket_name: ''
    }

  NewUserData: any =
    {
      Name: '',
      username: '',
      Bukcets: []
    }

  alreadyExists = false
  dropdownSettings: any
  spinner = false
  spinnerBtn = true
  specialChars = false
  usertype: any = false
  allBuckets: any = []
  buckets: any = []
  constructor(private toastr: ToastrService, private location: Location, private http: HttpClient, private route: ActivatedRoute, private router: Router, private modalservice: NgbModal) {
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

    if (localStorage.getItem('userType') == 'admin') {
      this.usertype = true
    }

    if (localStorage.getItem('view') == 'grid') {
      this.viewVal = true
    }
    else if (localStorage.getItem('view') == 'list') {
      this.viewVal = false
    }
    this.route.queryParamMap.subscribe((res: any) => {
      this.list = res.get('view')
    })
    this.route.queryParamMap.subscribe((params: any) => {
      this.Back = Number(params.get('backIndex'))
      this.Forward = Number(params.get('frontIndex'))

      if (this.Back == 0) {
        this.prev = true
      }
      if (this.Back > 0) {
        this.prev = false
      }
      if (this.previousVal == 0) {
        this.next = true

      }
      else if (this.previousVal > 0) {
        this.next = false
      }
    })
    this.getBuckets()
    this.getAllUsers()
  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  open(content: any) {
    this.modalservice.open(content, { backdrop: 'static' })
  }
  //All Buckets
  getBuckets() {

    this.allBuckets = []
    this.http.get(apiurls.buckets).subscribe((res: any) => {

      for (let i in res.buckets) {
        this.buckets.push(res.buckets[i].name)
      }
      // console.log(this.buckets);

    })
  }


  //Create Bucket
  createBucket(form: NgForm) {
    this.spinnerBtn = false
    this.spinner = true
    let pattern = /\s/;
    let pattern1 = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

    if (this.newBucketData.bucket_name == '' || this.newBucketData.bucket_name.length < 3) {
      this.spinnerBtn = true
      this.spinner = false
      this.errMsg = true
      setTimeout(() => {
        this.errMsg = false
      }, 2500)
    }
    else if (pattern.test(form.value.bucket_name) || pattern1.test(form.value.bucket_name)) {
      this.spinnerBtn = true
      this.spinner = false
      this.specialChars = true
      setTimeout(() => {
        this.specialChars = false
      }, 2500)
    }


    else {
      form.value.bucket_name = form.value.bucket_name.toLowerCase()
      this.http.post(apiurls.newBucket, form.value).subscribe((res: any) => {
        console.log(res);
        this.modalservice.dismissAll()
        this.newBucketData = {}
        this.spinnerBtn = true
        this.spinner = false
        this.createbucket_res.emit(res.message)
      })
    }
  }



  goBack() {
    this.location.back();
    this.previousVal++
  }

  goForward() {
    this.location.forward();
    this.previousVal--
  }

  sendData(folder: any) {
    this.outputData.emit(folder)
    for (let i in this.Label) {
      if (folder?.folder == this.Label[i]?.folder) {
        this.Label = this.Label.slice(0, this.Label?.indexOf(this.Label[i]) + 1)
      }
    }
    this.route.queryParamMap.subscribe((params: any) => {
      if (params?.params) {
        let dataOfFolder: any = JSON.parse(params?.params?.data || null)
        this.Label = dataOfFolder
      }
    })
  }

  viewType(type: string) {

    localStorage.setItem("view", type)

    if (localStorage.getItem('view') == 'grid') {
      this.viewVal = true
      console.log(this.viewVal);
    }
    else if (localStorage.getItem('view') == 'list') {
      this.viewVal = false
      console.log(this.viewVal);
    }
    this.list = localStorage.getItem('view')
    this.view_con.emit(this.list)
  }

  //Create User
  AllfieldsErr = false

  createUser(form: NgForm) {
    this.spinnerBtn = false
    this.spinner = true
    console.log(form.value);
    if (form.value.name == '' || form.value.username == '') {
      this.spinnerBtn = true
      this.spinner = false
      this.AllfieldsErr = true
      setTimeout(() => {
        this.AllfieldsErr = false
      }, 2500)
    }
    form.value.username = form.value.username.toLowerCase()
    this.http.post(apiurls.createUser, form.value).subscribe((res: any) => {
      console.log(form.value);
      if (res.detail) {
        this.spinnerBtn = true
        this.spinner = false
        this.alreadyExists = true
        setTimeout(() => {
          this.alreadyExists = false
        }, 2500)
      }
      if (res.msg) {
        this.spinnerBtn = false
        this.spinner = true
        this.modalservice.dismissAll()
        this.spinnerBtn = true
        this.spinner = false
        this.toastr.success("User Created Successfully")
        this.getAllUsers()
      }
    })
  }

  getAllUsers() {
    this.http.get(apiurls.allUsers).subscribe((res: any) => {
      console.log(res);
    })
  }


}
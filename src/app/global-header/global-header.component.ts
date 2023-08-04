import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent implements OnInit, OnChanges {

  @Input() Label: any = new EventEmitter();
  @Input() Back: any = new EventEmitter();
  @Input() Forward: any = new EventEmitter();
  prev = true
  next = true

  @Output() outputData: EventEmitter<string> = new EventEmitter<string>();
  constructor(private location: Location, private http: HttpClient, private route: ActivatedRoute, private router: Router) {

  }
  ngOnInit(): void {
    console.log(JSON?.parse(JSON.stringify(this.Label)), "lables");
    this.route.queryParamMap.subscribe((params: any) => {
      this.Back = Number(params.get('backIndex'))
      this.Forward = Number(params.get('frontIndex'))

      if (this.Back == 0) {
        this.prev = true
      }
      if (this.Back > 0) {
        this.prev = false
      }
      if (this.Forward < 0) {
        this.next = true
      }
      else {
        this.next = false
      }
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  goBack() {
    this.location.back();
    this.Label.pop()
  }

  goForward() {
    this.location.forward();
  }

  sendData(folder: any) {
    this.route.queryParamMap.subscribe((params: any) => {
      let bucket = params.get('mainbucket')
      let path = params.get('path')
      let foldername = JSON.parse(params.get('data'))
      // let allDataFromChild: any = {
      //   bucketName: bucket,
      //   path: path,
      //   folderData: foldername
      // }
      this.outputData.emit(folder)
    })
  }
}
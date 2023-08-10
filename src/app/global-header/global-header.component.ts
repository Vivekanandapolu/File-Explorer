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

  @Input() Label: any
  @Input() Back: any
  @Input() Forward: any
  @Input() tabname: any
  @Output() outputData: EventEmitter<string> = new EventEmitter<string>();
  @Output() view_con: EventEmitter<string> = new EventEmitter<string>();
  prev = true
  next = true
  previousVal: number = 0
  list: any

  constructor(private location: Location, private http: HttpClient, private route: ActivatedRoute, private router: Router) {

  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((res: any) => {
      this.list = res.get('view')
    })

    // this.view_con.emit(this.list)
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
  }
  ngOnChanges(changes: SimpleChanges): void {
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
    this.list = localStorage.getItem('view')
    this.view_con.emit(this.list)
  }

}
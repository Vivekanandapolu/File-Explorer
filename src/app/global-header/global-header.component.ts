import { Component, EventEmitter, Input, OnInit } from '@angular/core';

import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent implements OnInit {

  @Input() Label: any = new EventEmitter();
  @Input() Back: any = new EventEmitter();
  @Input() Forward: any = new EventEmitter();
  prev = true
  next = true
  constructor(private location: Location, private http: HttpClient, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    // this.getFiles()
    this.route.queryParamMap.subscribe((params: any) => {
      this.Back = Number(params.get('backIndex'))
      this.Forward = Number(params.get('frontIndex'))
      // console.log(this.Forward);

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

  goBack() {
    this.location.back();
  }

  goForward() {
    this.location.forward();
  }
}

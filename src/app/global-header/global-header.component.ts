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

  @Input() Label = new EventEmitter();
  @Input() Back = new EventEmitter();
  @Input() Forward = new EventEmitter();
  // @Input() bucketName = new EventEmitter();

  constructor(private location: Location, private http: HttpClient, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
  }
  goBack() {
    this.location.back();
    // this.route.queryParamMap.subscribe(params => {
    //   const name = params.get('folderName')
    //   const path = params.get('path')
    //   const bucketName = params.get("mainbucket")
    //   console.log(bucketName);
    //   this.http.get("http://192.168.1.151:8000/bucket/get_bucket_data/" + bucketName).subscribe((res: any) => {
    //     console.log(res, "response");
    //   })
    // });
  }

  goForward() {

    this.location.forward();
  }
}

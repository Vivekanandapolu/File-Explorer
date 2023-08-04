import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';


@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.scss']
})
export class BucketsComponent implements OnInit {
  buckets: any = []
  singleBucketsData: any = []
  bucketsView = true
  allBuckets: any = []
  dataToSend: any = ""
  BackIndexVal: any = 0
  FrontIndexVal: any = 0
  queryParams: any = {}
  bucketNameGlobal: any

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      if (!params.has("mainbucket")) {
        this.getBuckets()
        this.bucketsView = true
        this.singleBucketsData = []
        this.dataToSend = '';
      }
      else {
        this.getBucketsData(params.get('mainbucket')).then((res: any) => {
          if (params.has("path")) {
            this.getBucketsDataByPath(params.get('path'))
          }
        })
      }
    });
  }

  getBuckets() {
    this.allBuckets = []
    this.http.get("http://192.168.1.151:8000/bucket/list").subscribe((res: any) => {
      this.buckets = [res]
      console.log(this.buckets)
      for (let bucket in this.buckets) {
        this.allBuckets.push(...this.buckets[bucket].buckets)
      }
      const queryParams = {
        backIndex: 0,
        frontIndex: 0
      }
      this.router.navigate(['/'], { queryParams: queryParams });
    })
  }


  getBucketsData(bucketName: any) {
    return new Promise((resolve, reject) => {
      this.bucketNameGlobal = bucketName
      this.http.get("http://192.168.1.151:8000/bucket/get_bucket_data/" + bucketName).subscribe((res: any) => {
        this.singleBucketsData.push(...res);
        resolve(true)
      })
    })

  }


  getBucketsDataByPath(path: any) {
    this.loopArray(this.singleBucketsData, path)
    this.dataToSend = "  / " + path
    // console.log(path, "path");
  }


  loopArray(arr: any, path: any) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].type == "folder") {
        if (arr[i].path == path) {
          this.bucketsView = false
          // console.log(arr[i].path, arr[i].files, path)
          let data = {
            files: arr[i].files,
            folderName: arr[i].folderName,
            type: "folder",
            path: path
          }
          this.singleBucketsData = [data]
          // console.log(this.singleBucketsData)
          return
        } else {
          this.loopArray(arr[i].files, path);
        }
      }

    }
  }


  bucketClick(bucketName: any) {
    this.BackIndexVal = this.BackIndexVal + 1
    this.FrontIndexVal = this.FrontIndexVal + 1
    this.bucketsView = false
    this.singleBucketsData = []
    const queryParams = {
      mainbucket: bucketName,
      path: bucketName,
      backIndex: this.BackIndexVal,
      frontIndex: this.FrontIndexVal
    }
    this.router.navigate(['/'], { queryParams: queryParams });

  }


  innerFolderNavigation(InnerFiles: any, bucketName: any, folderName: any, path: any) {
    this.BackIndexVal = this.BackIndexVal + 1
    this.FrontIndexVal = this.FrontIndexVal + 1
    let data = {
      files: InnerFiles,
      folderName: folderName,
      type: "folder",
      path: path,
    }
    this.queryParams = {
      path: path,
      mainbucket: this.bucketNameGlobal,
      backIndex: this.BackIndexVal,
      frontIndex: this.FrontIndexVal
    };
    this.router.navigate(['/'], { queryParams: this.queryParams });
    this.singleBucketsData = [data]
  }



}

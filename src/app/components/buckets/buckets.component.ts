import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  dataToSend: any = "Buckets"


  back: any = false
  front: any = false
  BackIndexVal = 0
  FrontIndexVal = 0
  queryParams: any = {}
  bucketNameGlobal: any

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.getBuckets()
    this.getCurrentFolders()
  }
  getBuckets() {
    this.http.get("http://192.168.1.151:8000/bucket/list").subscribe((res: any) => {
      this.buckets.push(res)
      for (let bucket in this.buckets) {
        this.allBuckets.push(...this.buckets[bucket].buckets)
      }
    })
  }

  getCurrentFolders() {
    this.singleBucketsData = []
    this.route.queryParamMap.subscribe(params => {
      const name = params.get('folderName')
      const path = params.get('path')
      const bucketName = params.get("bucket")
      // console.log(bucketName);
      this.http.get("http://192.168.1.151:8000/bucket/get_bucket_data/" + bucketName).subscribe((res: any) => {
        // console.log(res, "response");
        for (let i in res) {
          console.log(res[i].files);
          this.singleBucketsData.push(res[i].files)
        }
      })
    });
  }

  bucketClick(bucketName: any) {
    this.bucketsView = false
    this.singleBucketsData = []
    this.BackIndexVal += 1
    console.log(bucketName);
    const queryParams = {
      bucket: bucketName
    }
    this.router.navigate(['/'], { queryParams: queryParams });
    this.bucketNameGlobal = bucketName
    this.dataToSend = bucketName
    this.http.get("http://192.168.1.151:8000/bucket/get_bucket_data/" + bucketName).subscribe((res: any) => {
      this.singleBucketsData.push(...res);
      // console.log(this.singleBucketsData, "Data");
    })
  }

  innerFolderNavigation(InnerFiles: any, bucketName: any, folderName: any, path: any) {
    let data = {
      files: InnerFiles,
      folderName: folderName,
      type: "folder",
      path: path
    }
    this.queryParams = {
      folderName: bucketName.folderName,
      path: path,
      mainbucket: this.bucketNameGlobal
    };
    console.log(bucketName, "Hello");
    this.dataToSend = folderName

    this.router.navigate(['/'], { queryParams: this.queryParams });

    this.singleBucketsData = [data]
  }
}

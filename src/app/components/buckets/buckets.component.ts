import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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

  constructor(private http: HttpClient, private router: Router, private location: Location) {

  }

  ngOnInit(): void {
    this.getBuckets()
  }
  getBuckets() {
    this.http.get("http://192.168.1.151:8000/bucket/list").subscribe((res: any) => {
      this.buckets.push(res)
      for (let bucket in this.buckets) {
        this.allBuckets.push(...this.buckets[bucket].buckets)
      }
    })
  }

  goBack() {
    this.location.back();
  }


  bucketClick(bucketName: any) {
    this.bucketsView = false
    this.singleBucketsData = []
    this.http.get("http://192.168.1.151:8000/bucket/get_bucket_data/" + bucketName).subscribe((res: any) => {
      this.singleBucketsData.push(...res);
      const queryParams = { folder: this.singleBucketsData.folderName };
      this.router.navigate(['/'], { queryParams });
      // console.log(this.singleBucketsData, "Data");
      if (this.singleBucketsData[0].type) {
        console.log(this.singleBucketsData[0].type);
        // this.title = true
      }

    })
  }
  innerFolderNavigation(InnerFiles: any, bucketName: any, type: any) {
    let data = {
      files: InnerFiles,
      folderName: bucketName,
      type: "folder"
    }
    console.log(data.folderName);
    const queryParams = { folder: data.folderName };
    this.router.navigate(['/'], { queryParams });
    if (!type) {
      console.log("success");
    }
    this.singleBucketsData = [data]
    console.log(this.singleBucketsData[0].files, "data")
  }
}

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
  dataToSend: any[] = []
  BackIndexVal: any = 0
  FrontIndexVal: any = 0
  queryParams: any = {}
  bucketNameGlobal: any
  FileTypes: any = []

  clickedFolder: any = []
  extensionsArray: any = [".docx", ".pdf", ".xlsx", ".csv", ".pptx", ".jpg"]
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      if (!params.has("mainbucket")) {
        this.getBuckets()
        this.bucketsView = true
        this.singleBucketsData = []
        this.dataToSend = []
      }
      else {
        this.getBucketsData(params.get('mainbucket')).then((res: any) => {
          if (params.has("path")) {
            this.getBucketsDataByPath(params.get('path'), params.get("mainbucket"))
          }
        })
      }
    });
  }

  getBuckets() {
    this.allBuckets = []
    this.http.get("http://192.168.1.151:8000/bucket/list").subscribe((res: any) => {
      this.buckets = [res]
      for (let bucket in this.buckets) {
        this.allBuckets.push(...this.buckets[bucket].buckets)
      }
      // const queryParams = {
      //   backIndex: 0,
      //   frontIndex: 0
      // }
      // this.router.navigate(['/'], { queryParams: queryParams });
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



  getBucketsDataByPath(path: any, folderName: any) {
    this.loopArray(this.singleBucketsData, path)

  }


  loopArray(arr: any, path: any) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].type == "folder") {
        if (arr[i].path == path) {
          this.bucketsView = false
          let data = {
            files: arr[i].files,
            folderName: arr[i].folderName,
            type: "folder",
            path: path
          }
          this.singleBucketsData = [data]
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
    let data = {
      folder: bucketName,
      path: bucketName
    }

    if (!this.dataToSend.includes(data)) {
      this.dataToSend.push(data)
    }
    const queryParams = {
      mainbucket: bucketName,
      path: bucketName,
      // backIndex: this.BackIndexVal,
      // frontIndex: this.FrontIndexVal,
      data: JSON.stringify(this.dataToSend)
    }
    this.router.navigate(['/'], { queryParams: queryParams });
  }

  innerFolderNavigation(InnerFiles: any, bucketName: any, folderName: any, path: any, files: any) {

    for (let file in files.files) {
      if (files.files[file].type == "file") {
        this.FileTypes.push(files.files[file].filetype)
      }
    }
    this.BackIndexVal = this.BackIndexVal + 1
    this.FrontIndexVal = this.FrontIndexVal + 1


    let innerData = {
      folder: folderName,
      path: path
    }
    console.log(innerData, "data");


    let isFolderExist = this.dataToSend.some((res: any) => res.folder == innerData.folder)
    if (!isFolderExist) {
      this.dataToSend.push(innerData)

    }
    // if (this.dataToSend.includes((res: any) => res.folder != innerData.folder)) {
    // }

    let data = {
      files: InnerFiles,
      folderName: folderName,
      type: "folder",
      path: path
    }
    this.singleBucketsData = [data]
    this.queryParams = {
      path: path,
      mainbucket: this.bucketNameGlobal,
      // backIndex: this.BackIndexVal,
      // frontIndex: this.FrontIndexVal,
      data: JSON.stringify(this.dataToSend)
    };
    console.log()
    this.router.navigate(['/'], { queryParams: this.queryParams });


  }


  clickFolder(value: any) {

    // console.log(value)
    // let data = {
    //   bucketname: value.bucketName,
    //   data: value.folderData,
    //   mainPath: value.path
    // }
    // console.log(data, "values");
    let queryParams = {
      path: value.path,
      mainbucket: this.bucketNameGlobal,
      // backIndex: this.BackIndexVal,
      // frontIndex: this.FrontIndexVal,
      data: JSON.stringify(this.dataToSend)
    };
    console.log(queryParams)
    this.router.navigate(['/'], { queryParams: queryParams });
    // this.getBucketsData(data.bucketname);

    // this.innerFolderNavigation(null, data.bucketname, data.data, data.mainPath, "")
  }



}
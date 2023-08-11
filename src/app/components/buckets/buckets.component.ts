import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { apiurls } from 'src/app/shared/apiurls';

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
  Loader: Boolean = false
  BackIndexVal: any = 0
  FrontIndexVal: any = 0
  queryParams: any = {}
  bucketNameGlobal: any
  FileTypes: any = []
  TabName: any = ''
  clickedFolder: any = []
  extensionsArray: any = [".docx", ".pdf", ".xlsx", ".csv", ".pptx", ".jpg"]
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
  }
  viewtype: any
  dataOfFolder: any = []


  createdArrow: Boolean = true
  sizeArrow: Boolean = true
  nameArrow: Boolean = true

  ngOnInit(): void {

    this.viewtype = localStorage.getItem('view') || 'grid'
    console.log(this.viewtype)
    this.bucketsView = false
    this.route.queryParamMap.subscribe((params: any) => {
      if (!params.has("mainbucket")) {

        this.getBuckets()
        this.bucketsView = true
        this.singleBucketsData = []
        this.TabName = params.get('name')
        this.dataToSend = []
      }
      else {

        this.getBucketsData(params.get('mainbucket')).then((res: any) => {

          if (params.has("path")) {
            this.getBucketsDataByPath(params.get('path'), params.get("mainbucket"))
          }
        })
        if (params?.params?.data) {
          this.dataToSend = JSON.parse(params?.params?.data)
          console.log(this.dataToSend, "Params");
        }
      }

    });
  }


  //Get Buckets

  getBuckets() {

    this.allBuckets = []
    this.http.get(apiurls.buckets).subscribe((res: any) => {
      this.buckets = [res]
      for (let bucket in this.buckets) {
        this.allBuckets.push(...this.buckets[bucket].buckets)
      }

      const queryParams = {
        backIndex: 0,
        frontIndex: 0,
        tabName: 'Buckets',
      }
      this.router.navigate(['/buckets'], { queryParams: { name: 'Buckets' } })
    })
  }

  getBucketsData(bucketName: any) {

    return new Promise((resolve, reject) => {
      this.bucketNameGlobal = bucketName
      this.http.get(apiurls.bucketsData + bucketName).subscribe((res: any) => {
        this.singleBucketsData.push(...res);

        console.log(this.singleBucketsData, "1");
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

          console.log(this.singleBucketsData, "2");
          return
        } else {
          this.loopArray(arr[i].files, path);
        }
      }

    }
  }


  bucketClick(bucketName: any) {

    this.BackIndexVal = this.BackIndexVal + 1
    this.bucketsView = false
    this.singleBucketsData = []
    console.log(this.singleBucketsData, "3");
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
      backIndex: this.BackIndexVal,
      frontIndex: this.FrontIndexVal,
      data: JSON.stringify(this.dataToSend),
    }
    this.TabName = ''
    this.router.navigate(['/buckets'], { queryParams: queryParams });

  }

  innerFolderNavigation(InnerFiles: any, bucketName: any, folderName: any, path: any, files: any) {

    console.log("innerfolder")
    for (let file in files.files) {
      if (files.files[file].type == "file") {
        this.FileTypes.push(files.files[file].filetype)
      }
    }
    this.BackIndexVal = this.BackIndexVal + 1

    let innerData = {
      folder: folderName,
      path: path
    }

    let isFolderExist = this.dataToSend.some((res: any) => res.folder == innerData.folder)
    if (!isFolderExist) {
      this.dataToSend.push(innerData)
    }


    let data = {
      files: InnerFiles,
      folderName: folderName,
      type: "folder",
      path: path
    }
    this.singleBucketsData = [data]

    console.log(this.singleBucketsData, "4");
    this.queryParams = {
      path: path,
      mainbucket: this.bucketNameGlobal,
      backIndex: this.BackIndexVal,
      frontIndex: this.FrontIndexVal,
      data: JSON.stringify(this.dataToSend),
    };
    this.router.navigate(['/buckets'], { queryParams: this.queryParams });

  }

  clickFolder(value: any) {

    this.route.queryParamMap.subscribe((res: any) => {
      let data = {
        bucketname: res.params.mainbucket,
        data: res.params.data,
        mainPath: res.params.path
      }
    })

    for (let i in this.dataToSend) {
      if (value?.folder == this.dataToSend[i]?.folder) {
        this.dataToSend = this.dataToSend.slice(0, this.dataToSend?.indexOf(this.dataToSend[i]) + 1)
      }
    }

    let queryParams = {
      path: value.path,
      mainbucket: this.bucketNameGlobal,
      backIndex: this.BackIndexVal,
      frontIndex: this.FrontIndexVal,
      data: JSON.stringify(this.dataToSend),
    };

    this.router.navigate(['/buckets'], { queryParams: queryParams });
  }
  type(type: any) {

    this.viewtype = type || localStorage.getItem('view')
    let queryParams = {
      mainbucket: this.bucketNameGlobal,
      backIndex: this.BackIndexVal,
      frontIndex: this.FrontIndexVal,
      data: JSON.stringify(this.dataToSend),
    };

    this.router.navigate(['/buckets'], { queryParams: queryParams });
  }



  lastmodified(type: string) {

    console.log(type, "modified");
    let modified: any = []
    if (type == 'asc') {
      this.createdArrow = false
      this.allBuckets.filter((buckets: any) => {
        if (buckets) {
          buckets.created = new Date(buckets.created)
          modified.push(buckets)
        }
      })
      this.allBuckets = modified.sort((a: any, b: any) => a.created.getTime() - b.created.getTime());

      console.log(this.allBuckets, "Ascending Order");
    }


    if (type == 'dec') {

      this.createdArrow = true
      this.allBuckets.filter((buckets: any) => {
        buckets.created = new Date(buckets.created)
        modified.push(buckets)
      })
      this.allBuckets = modified.sort((a: any, b: any) => b.created.getTime() - a.created.getTime());

      console.log(this.allBuckets, "Descneding Order");
    }
    if (type == "size") {
      let folderArr: any = []
      this.singleBucketsData.filter((res: any) => {
        modified = []
        res?.files?.filter((file: any) => {
          if (file?.type == "file") {
            modified.push(file);
          } else {
            folderArr.push(file)
          }
        })

        modified = modified?.sort((a: any, b: any) => a.size_value - b.size_value)
        console.log(modified)
        this.singleBucketsData = [...modified, ...folderArr]

        console.log(this.singleBucketsData, "5")
      })
    }

    if (type == "size-asc") {
      this.sizeArrow = false
      this.allBuckets.filter((buckets: any) => {
        if (buckets) {
          modified.push(buckets)
        }
      })
      this.allBuckets = modified.sort((a: any, b: any) => a.size_value - b.size_value);

    }
    if (type == "size-dec") {
      this.sizeArrow = true
      this.allBuckets.filter((buckets: any) => {
        if (buckets) {
          modified.push(buckets)
        }
      })
      this.allBuckets = modified.sort((a: any, b: any) => b.size_value - a.size_value);

      console.log(this.allBuckets, "decending Order");
    }

    if (type == "name-asc") {
      this.nameArrow = false
      this.allBuckets.filter((buckets: any) => {
        if (buckets) {
          modified.push(buckets)
        }
      })

      this.allBuckets = modified.slice().sort((a: any, b: any) => a.name.localeCompare(b.name));

      console.log(this.allBuckets, "ascending Order");
    }
    if (type == "name-dec") {
      this.nameArrow = true
      this.allBuckets.filter((buckets: any) => {
        if (buckets) {
          modified.push(buckets)
        }
      })

      this.allBuckets = modified.slice().sort((a: any, b: any) => b.name.localeCompare(a.name));

      console.log(this.allBuckets, "decending Order");
    }

  }


  //Download File 


  downloadFile(bucketName: any, file: any) {
    let data: any = {

    }
    let name
    for (let i in bucketName) {
      if (i == "path") {
        name = bucketName[i].split("/")[0]
        data.bucket_name = name
        data.path = file.fileurl
      }
    }
    console.log(data);
    this.http.post(apiurls.downloadFile, data).subscribe((res: any) => {
      console.log(res, "res");
      window.open(res.download_url)
    })

  }


  //Download Folder

  downloadFolder(folderName: any, BucketName: any) {
    let folderData: any = {

    }
    folderData.bucket_name = BucketName.path.split('/')[0]
    folderData.path = folderName
    console.log(folderData);
    this.http.post(apiurls.downloadFile, folderData).subscribe((res: any) => {
      window.open(res.download_url)
      console.log("Download Folder Success");
    })
  }
}

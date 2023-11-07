import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { apiurls } from 'src/app/shared/apiurls';
import { TokenService } from 'src/app/token.service';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.scss'],
})
export class BucketsComponent implements OnInit {
  buckets: any = [];
  singleBucketsData: any = [];
  bucketsView = true;
  allBuckets: any = [];
  dataToSend: any[] = [];
  Loader: Boolean = false;
  BackIndexVal: any = 0;
  FrontIndexVal: any = 0;
  queryParams: any = {};
  bucketNameGlobal: any;
  FileTypes: any = [];
  TabName: any = '';
  clickedFolder: any = [];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  extensionsArray: any = ['.docx', '.pdf', '.xlsx', '.csv', '.pptx', '.jpg'];
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private tokenservice: TokenService
  ) {}
  viewtype: any;
  dataOfFolder: any = [];

  createdArrow: Boolean = true;
  sizeArrow: Boolean = true;
  nameArrow: Boolean = true;

  ngOnInit(): void {
    this.tokenservice.validateTokenAndRefresh();
    localStorage.setItem('tabname', 'Archives');
    this.viewtype = localStorage.getItem('view') || 'grid';

    this.bucketsView = false;
    this.route.queryParamMap.subscribe((params: any) => {
      if (!params.has('mainbucket')) {
        this.getBuckets();
        this.bucketsView = true;
        this.singleBucketsData = [];
        this.TabName = params.get('name');
        this.dataToSend = [];
      } else {
        this.getBucketsData(params.get('mainbucket')).then((res: any) => {
          if (params.has('path')) {
            this.getBucketsDataByPath(
              params.get('path'),
              params.get('mainbucket')
            );
          }
        });
        if (params?.params?.data) {
          this.dataToSend = JSON.parse(params?.params?.data);
        }
      }
    });
  }

  //Get Buckets

  getBuckets() {
    this.allBuckets = [];
    this.http.get(apiurls.buckets).subscribe((res: any) => {
      this.buckets = [res];
      for (let bucket in this.buckets) {
        this.allBuckets.push(...this.buckets[bucket].buckets);
      }

      const queryParams = {
        backIndex: 0,
        frontIndex: 0,
        tabName: 'Buckets',
      };
      this.router.navigate(['/buckets'], { queryParams: { name: 'Archives' } });
    });
  }

  getBucketsData(bucketName: any) {
    return new Promise((resolve, reject) => {
      this.bucketNameGlobal = bucketName;
      this.singleBucketsData = [];
      this.http
        .get(apiurls.bucketsData + bucketName.toLowerCase())
        .subscribe((res: any) => {
          console.log(res);
          this.singleBucketsData.push(...res);
          resolve(true);
        });
    });
  }

  getBucketsDataByPath(path: any, folderName: any) {
    this.loopArray(this.singleBucketsData, path);
  }

  // loopArray(arr: any, path: any) {
  //   for (let i = 0; i < arr.length; i++) {
  //     if (arr[i].type == 'folder') {
  //       if (arr[i].path == path) {
  //         this.bucketsView = false;
  //         let data = {
  //           files: arr[i].files,
  //           folderName: arr[i].folderName,
  //           type: 'folder',
  //           path: path,
  //         };
  //         console.log(
  //           data.files.filter((val: any) => {
  //             console.log(val.folderName);
  //           })
  //         );
  //         this.singleBucketsData = [data];
  //         // this.singleBucketsData
  //         return;
  //       } else {
  //         this.loopArray(arr[i].files, path);
  //       }
  //     }
  //   }
  // }
  loopArray(arr: any, path: any) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].type == 'folder') {
        if (arr[i].path == path) {
          this.bucketsView = false;
          let data = {
            files: arr[i].files,
            folderName: arr[i].folderName,
            type: 'folder',
            path: path,
          };
          // console.log(data, '12345');

          // data.files = data.files
          //   .filter((val: any) => val.type === 'folder') // Filter only folders
          //   .sort((a: any, b: any) => {
          //     return (
          //       this.months.indexOf(a.folderName) -
          //       this.months.indexOf(b.folderName)
          //     );
          //   })
          //   .map((val: any) => val);
          // console.log(data, '==========');
          this.singleBucketsData = [data];
          return;
        } else {
          this.loopArray(arr[i].files, path);
        }
      }
    }
  }

  bucketClick(bucketName: any) {
    this.BackIndexVal = this.BackIndexVal + 1;
    this.bucketsView = false;
    this.singleBucketsData = [];
    let data = {
      folder: bucketName,
      path: bucketName,
    };

    if (!this.dataToSend.includes(data)) {
      this.dataToSend.push(data);
    }
    const queryParams = {
      mainbucket: bucketName,
      path: bucketName,
      backIndex: this.BackIndexVal,
      frontIndex: this.FrontIndexVal,
      data: JSON.stringify(this.dataToSend),
    };
    // this.TabNa
    this.router.navigate(['/buckets'], { queryParams: queryParams });
  }

  innerFolderNavigation(
    InnerFiles: any,
    bucketName: any,
    folderName: any,
    path: any,
    files: any
  ) {
    for (let file in files.files) {
      if (files.files[file].type == 'file') {
        this.FileTypes.push(files.files[file].filetype);
      }
    }
    this.BackIndexVal = this.BackIndexVal + 1;

    let innerData = {
      folder: folderName,
      path: path,
    };

    let isFolderExist = this.dataToSend.some(
      (res: any) => res.folder == innerData.folder
    );
    if (!isFolderExist) {
      this.dataToSend.push(innerData);
    }

    let data = {
      files: InnerFiles,
      folderName: folderName,
      type: 'folder',
      path: path,
    };
    this.singleBucketsData = [data];

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
    for (let i in this.dataToSend) {
      if (value?.folder == this.dataToSend[i]?.folder) {
        this.dataToSend = this.dataToSend.slice(
          0,
          this.dataToSend?.indexOf(this.dataToSend[i]) + 1
        );
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
    this.viewtype = type || localStorage.getItem('view');
    this.route.queryParamMap.subscribe((params: any) => {
      this.router.navigate(['/buckets'], { queryParams: params.params });
    });
  }

  lastmodified(type: string) {
    let modified: any = [];
    if (type == 'asc') {
      this.createdArrow = false;
      this.allBuckets.filter((buckets: any) => {
        if (buckets) {
          buckets.created = new Date(buckets.created);
          modified.push(buckets);
        }
      });
      this.allBuckets = modified.sort(
        (a: any, b: any) => a.created.getTime() - b.created.getTime()
      );
    }

    if (type == 'dec') {
      this.createdArrow = true;
      this.allBuckets.filter((buckets: any) => {
        buckets.created = new Date(buckets.created);
        modified.push(buckets);
      });
      this.allBuckets = modified.sort(
        (a: any, b: any) => b.created.getTime() - a.created.getTime()
      );
    }
    if (type == 'size') {
      let folderArr: any = [];
      this.singleBucketsData.filter((res: any) => {
        modified = [];
        res?.files?.filter((file: any) => {
          if (file?.type == 'file') {
            modified.push(file);
          } else {
            folderArr.push(file);
          }
        });

        modified = modified?.sort(
          (a: any, b: any) => a.size_value - b.size_value
        );
        this.singleBucketsData = [...modified, ...folderArr];
      });
    }

    if (type == 'size-asc') {
      this.sizeArrow = false;
      this.allBuckets.filter((buckets: any) => {
        if (buckets) {
          modified.push(buckets);
        }
      });
      this.allBuckets = modified.sort(
        (a: any, b: any) => a.size_value - b.size_value
      );
    }
    if (type == 'size-dec') {
      this.sizeArrow = true;
      this.allBuckets.filter((buckets: any) => {
        if (buckets) {
          modified.push(buckets);
        }
      });
      this.allBuckets = modified.sort(
        (a: any, b: any) => b.size_value - a.size_value
      );
    }

    if (type == 'name-asc') {
      this.nameArrow = false;
      this.allBuckets.filter((buckets: any) => {
        if (buckets) {
          modified.push(buckets);
        }
      });

      this.allBuckets = modified
        .slice()
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
    if (type == 'name-dec') {
      this.nameArrow = true;
      this.allBuckets.filter((buckets: any) => {
        if (buckets) {
          modified.push(buckets);
        }
      });

      this.allBuckets = modified
        .slice()
        .sort((a: any, b: any) => b.name.localeCompare(a.name));
    }
  }

  //Download File

  // downloadFile(bucketName: any, file: any) {
  //   let data: any = {};
  //   let name;
  //   for (let i in bucketName) {
  //     if (i == 'path') {
  //       name = bucketName[i].split('/')[0];
  //       data.bucket_name = name;
  //       data.path = file.fileurl;
  //     }
  //   }
  //   // let queryParams = new HttpParams();
  //   this.http
  //     .get(apiurls.downloadFileDup, { params: data })
  //     .subscribe((res: any) => {
  //       const blob = new Blob([res.download_url], { type: 'text/csv' });
  //       const url = window.URL.createObjectURL(blob);
  //       window.URL.revokeObjectURL(url);
  //       window.open(url);
  //     });
  // }

  downloadFile(bucketName: any, file: any) {
    let data: any = {};
    let name;
    for (let i in bucketName) {
      if (i == 'path') {
        name = bucketName[i].split('/')[0];
        data.bucket_name = name;
        data.path = file.fileurl;
      }
    }
    console.log(file.fileurl.split('.')[1]);
    if (file.fileurl.split('.')[1] == 'csv') {
      console.log('csv file ');

      this.http
        .get(apiurls.downloadFileDup, {
          params: data,
          responseType: 'arraybuffer',
        })
        .subscribe((res: ArrayBuffer) => {
          // Create a Blob from the array buffer
          const blob = new Blob([res], { type: 'text/csv' });

          // Create a temporary URL for the blob
          const url = window.URL.createObjectURL(blob);

          // Create a temporary anchor element to trigger the download
          const a = document.createElement('a');
          a.href = url;
          a.download = file.fileurl.split('/').pop(); // Set the desired file name

          // Trigger the download
          document.body.appendChild(a);
          a.click();

          // Clean up
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
    }
    if (file.fileurl.split('.')[1] == 'txt') {
      this.http
        .get(apiurls.downloadFileDup, {
          params: data,
          responseType: 'arraybuffer',
        })
        .subscribe((res: ArrayBuffer) => {
          const blob = new Blob([res], { type: 'text/plain' });
          const dataUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = file.fileurl.split('/').pop(); // Set the desired file name

          // Trigger the download
          document.body.appendChild(a);
          a.click();

          // Clean up
          window.URL.revokeObjectURL(dataUrl);
          document.body.removeChild(a);
        });
    }
  }

  //Download Folder

  downloadFolder(folderName: any, BucketName: any) {
    let folderData: any = {};
    folderData.bucket_name = folderName.path.split('/')[0];
    folderData.folder_path = folderName.path.split('/').slice(1).join('/');
    this.http.post(apiurls.folderDownload, folderData).subscribe((res: any) => {
      window.open(res.download_url);
    });
  }
  // downloadFolder1(folderName: any, BucketName: any) {
  //   let folderData: any = {};
  //   folderData.bucket_name = folderName.path.split('/')[0];
  //   folderData.folder_path = folderName.path.split('/').slice(1).join('/');
  //   this.http
  //     .get(apiurls.downloadFolderDup, { params: folderData })
  //     .subscribe((res: any) => {
  //       const binaryData = res; // Replace ... with your binary data
  //       const blob = new Blob([binaryData]);
  //       const url = window.URL.createObjectURL(blob);
  //       window.open(url);

  //       window.URL.revokeObjectURL(url);
  //     });
  // }
  downloadFolder1(folderName: any, BucketName: any) {
    console.log(folderName);
    const folderData: any = {};
    folderData.bucket_name = folderName.path.split('/')[0];
    folderData.folder_path = folderName.path.split('/').slice(1).join('/');

    const httpOptions: any = {
      responseType: 'arraybuffer', // Set the response type to arraybuffer
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: folderData,
    };

    this.http
      .get(apiurls.downloadFolderDup, httpOptions)
      .subscribe((res: ArrayBuffer) => {
        const blob = new Blob([res], { type: 'application/zip' }); // Specify the correct MIME type
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        a.download = folderName.path.split('/')[0]; // Set the desired file name

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
  }
  newBukcet(val: any) {
    if (val) {
      this.getBuckets();
    }
  }

  openFile(bucketName: any, file: any) {
    let data: any = {};
    let name;
    for (let i in bucketName) {
      if (i == 'path') {
        name = bucketName[i].split('/')[0];
        data.bucket_name = name;
        data.path = file.fileurl;
      }
    }
    this.http.post(apiurls.downloadFile, data).subscribe((res: any) => {
      window.open(res.download_url, '_blank');
    });
  }

  getBucketsBySearch(val: any) {
    this.allBuckets = val;
  }
  getInnerBucketDataBySearch(innerData: any) {
    console.log(innerData);
    this.singleBucketsData = innerData;
  }
}

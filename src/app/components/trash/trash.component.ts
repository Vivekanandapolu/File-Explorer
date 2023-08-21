import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent {
  TabName: any
  constructor(private route: Router, private http: HttpClient, private router: ActivatedRoute) {

  }


  ngOnInit(): void {
    localStorage.setItem('tabname', 'Groups')
    let headername = {
      name: "Trash"
    }
    this.route.navigate(['/trash'], { queryParams: headername })
    this.router.queryParamMap.subscribe((res: any) => {
      this.TabName = res.params.name
    })

  }
}

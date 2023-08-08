import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  TabName: any
  constructor(private router: ActivatedRoute, private route: Router) {

  }
  ngOnInit(): void {
    let headername = {
      name: "User management"
    }
    this.route.navigate(['/user-management'], { queryParams: headername })
    this.router.queryParamMap.subscribe((res: any) => {
      this.TabName = res.params.name
    })
  }
}

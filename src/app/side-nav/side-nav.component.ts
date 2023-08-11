import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  options: any = {
    fragment: 'ignored',
    matrixParams: 'ignored',
    paths: 'exact' || 'subset',
    queryParams: 'ignored'
  }
  userType: any;
  ngOnInit(): void {
    this.userType = localStorage.getItem('userType')
    console.log(this.userType, "hello");
  }
}

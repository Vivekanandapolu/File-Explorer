import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  options: any = {
    fragment: 'exact' || 'ignored',
    matrixParams: 'exact' || 'subset' || 'ignored',
    paths: 'exact' || 'subset',
    queryParams: 'ignored'
  }
  ngOnInit(): void {


  }
}

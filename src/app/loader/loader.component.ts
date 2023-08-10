import { Component, Injectable, Input, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() loader: any = false
  constructor(public loadingService: LoaderService) {

  }
  ngOnInit(): void {

  }

}

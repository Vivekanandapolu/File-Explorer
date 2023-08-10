import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService implements OnInit {


  // Assign the behavioural subject to the variable and
  private loadingSubject = new BehaviorSubject<boolean>(false);

  //  create another variable and assign the value of the behavioural value for the purpose of show and hide
  public loading$ = this.loadingSubject.asObservable()


  constructor() { }


  ngOnInit(): void {
    console.log(this.loading$);
  }


  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }
}

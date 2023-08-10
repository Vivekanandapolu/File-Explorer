import { EventEmitter, Injectable, Output } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from './loader/loader.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(public loadingService: LoaderService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingService.show()
    //Json Token Parsing

    // let data = JSON.parse(JSON.stringify(localStorage.getItem('token')));
    // const reqCopy = request.clone({
    //   setHeaders: { Authorization: `Bearer ${data}` }
    // })
    // return next.handle(reqCopy);


    return next.handle(request).pipe(finalize(() => {
      this.loadingService.hide()
    }))

  }
}

import { EventEmitter, Injectable, Output } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from './loader/loader.service';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(public loadingService: LoaderService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingService.show()

    let data = JSON.parse(JSON.stringify(localStorage.getItem('token')));
    const reqCopy = request.clone({
      setHeaders: { Authorization: `${data}` }
    })
    return next.handle(reqCopy), next.handle(request).pipe(finalize(() => {
      this.loadingService.hide()
    }
    ))
    // Json Token Parsing



  }
}

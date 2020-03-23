import { Injectable, Injector } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

import { Observable, throwError, EMPTY} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GeneralErrorInterceptor implements HttpInterceptor {

    constructor(private toastr: ToastrService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err =>{
                if ((err.status >= 500) && (err.status < 600)){
                    console.log("http error:",err);
                    this.toastr.error('不能连接到服务器，请稍后再试！', '服务错误!');
  
                }else if (err.status == 403 ){
                    console.log("403 error:",err.error.message);
                    this.toastr.error(err.error.message,"不能完成操作");
     
                } 
                return throwError(err);
            })
        );
    }


}
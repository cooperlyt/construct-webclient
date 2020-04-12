import { Injectable, Injector } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError, EMPTY, BehaviorSubject } from 'rxjs';
import { map, catchError, take, filter, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  inflightAuthRequest = null;

  blacklist: object = [
    /(((https?):\/\/|www\.)theinfogrid.com\/auth\/)/,
    'some-other-url-pattern',
    'some-other-pattern'
  ];

  constructor(private injector: Injector, private _router:Router) {}

  blacklistCheckup($url: string): boolean {
    let returnValue = false;

    for (const i of Object.keys(this.blacklist)) {
      if (this.blacklist[i].exec($url) !== null) {
        returnValue = true;
        break;
      }
    }

    return returnValue;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    

    //TODO use blacklist
    if (request.url.includes("oauth/token")){
      return next.handle(request);
    }

    const authService = this.injector.get(AuthenticationService);

    if (!this.inflightAuthRequest) {
      this.inflightAuthRequest = authService.getAccessToken();
    }
    console.log(" Http Client AuthInterceptor 1 ");
    return this.inflightAuthRequest.pipe(
      switchMap((newToken: string) => {
        // unset request inflight
    

        this.inflightAuthRequest = null;

        if(!newToken){
          console.log(" intercept no token ! go to login")
          //localStorage.clear();
          //this._router.navigate(['/login']);
          return EMPTY;
        }

        let authReq = request.clone(
          { headers: request.headers.set('Authorization', newToken ? 'Bearer ' + newToken : '') }
        );

        if (!authReq.headers.has('Content-Type')) {
          authReq = authReq.clone({ headers: authReq.headers.set('Content-Type', 'application/json') });
        }
  
        if (!authReq.headers.has('Accept')) {
          console.log("add accept json to http headers!")
          authReq = authReq.clone({ headers: authReq.headers.set('Accept', 'application/json') });
        }
        return next.handle(authReq)
      }),
      catchError(error => {
        console.log(" http auth error: ", error.status);
        // checks if a url is to an admin api or not
        if (error.status == 401){

          //TODO get refresh token descript
          // check if the response is from the token refresh end point
          const isFromRefreshTokenEndpoint = !!error.headers.get(
            'unableToRefreshToken'
          );

          console.log(" http fail in 401");

          if (isFromRefreshTokenEndpoint) {
            console.log(" refresh fail ! go to login")
            localStorage.clear();
            this._router.navigate(['/login']);
            return throwError(error);
          }

          if (!this.inflightAuthRequest) {
            console.log(" begin refresh token")
            this.inflightAuthRequest = authService.refreshToken();

            if (!this.inflightAuthRequest) {
              // remove existing tokens
              localStorage.clear();
              this._router.navigate(['/login']);
              return throwError(error);
            }
          }

          return this.inflightAuthRequest.pipe(

            switchMap((newToken: string) => {
              // unset inflight request
              this.inflightAuthRequest = null;

              console.log(" refresh complete req orig!")
              // clone the original request
              const authReqRepeat = request.clone(
                { headers: request.headers.set('Authorization', 'Bearer ' + newToken ) }
              );

              // resend the request
              return next.handle(authReqRepeat);
            })
          );


        }else{
          return throwError(error);
        }
      })
    );
  }

}
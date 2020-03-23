import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, EMPTY } from "rxjs";
import { tap, share, map, catchError  } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _http: HttpClient,private _router:Router) {}


  obtainAccessToken(loginData): Observable<any>{  
    let params = new URLSearchParams();
    params.append('username',loginData.username);
    params.append('password',loginData.password);    
    params.append('grant_type','password');
    params.append('scope','webclient');
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Basic '+btoa(`${environment.clientId}:${environment.clientPassword}`)})
    }
    return this._http.post(`${environment.apiUrl}/auth/auth/oauth/token`, 
      params.toString(), httpOptions).pipe(
        tap( (res:any) => {
          localStorage.setItem('refresh_token',res.refresh_token);
          localStorage.setItem('access_token', res.access_token);
        })
      );
  }

  getAccessToken(): Observable<string>{
    const token = localStorage.getItem('access_token');

    if (!token){
      return of(null)
    }
    const helper = new JwtHelperService();
    const isTokenExpired = helper.isTokenExpired(token);

    const decodedToken = helper.decodeToken(token);


    if (!isTokenExpired) {
      return of(token);
    }

    return this.refreshToken();
  }

  isLoggedIn(): Observable<boolean>{
    return this.getAccessToken().pipe(
        map((token:string) =>{
          return !!token;
        })
    );
  }
 
  refreshToken(): Observable<any>{
    console.log("refresh token");
    let params = new URLSearchParams();
    params.append('refresh_token',localStorage.getItem('refresh_token'));
    params.append('grant_type','refresh_token');

    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Basic '+btoa(`${environment.clientId}:${environment.clientPassword}`)})
    }
    return this._http.post(`${environment.apiUrl}/auth/auth/oauth/token`, 
      params.toString(), httpOptions).pipe(
        share(),
        catchError(err => {
          localStorage.clear();
          this._router.navigate(['/login']);
          return EMPTY;
        }),
        map( (res:any) => {
          const token = res.access_token;
          localStorage.setItem('refresh_token',res.refresh_token);
          localStorage.setItem('access_token', token);
          return token;
        })
      );

  }

  logout() {
    //TODO notifly server destory token
    localStorage.clear();
  }

  getUserInfo(): Observable<any>{
    return this.getAccessToken().pipe(
      map(res => {
        const helper = new JwtHelperService();
        return helper.decodeToken(res)
      })
    );
    //return this._http.get(`${environment.apiUrl}/auth/auth/user`);
  }

}
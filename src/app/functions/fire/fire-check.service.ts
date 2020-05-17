import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FireCheck } from './schemas';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class FireCheckService{

  constructor(private _http: HttpClient) { }
  
  create(fireCheck: FireCheck): Observable<string>{
    return this._http.post<string>(`${environment.apiUrl}/construct-fire/manager/apply`,fireCheck, {headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'});
  }

  fireCheck(id: number): Observable<FireCheck>{
    return this._http.get<FireCheck>(`${environment.apiUrl}/construct-fire/manager/check/${id}`)
  }

}
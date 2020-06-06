import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FireCheck } from './schemas';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class FireCheckService{

  constructor(private _http: HttpClient) { }
  
  create(fireCheck: FireCheck): Observable<{id:string ,inRandom:boolean}>{
    return this._http.post<any>(`${environment.apiUrl}/construct-fire/manager/apply`,fireCheck);
  }

  fireCheck(id: number): Observable<FireCheck>{
    return this._http.get<FireCheck>(`${environment.apiUrl}/construct-fire/manager/check/${id}`)
  }

}
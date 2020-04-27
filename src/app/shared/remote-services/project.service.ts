import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageResult } from 'src/app/shared/page-result';
import { CustomEncoder } from 'src/app/shared/custom-encoder';
import { ProjectReg, Project } from '../data/project';


@Injectable({providedIn: 'root'})
export class ProjectService{

  constructor(private _http: HttpClient) { }


  patchProject(reg:ProjectReg, code?:number): Observable<number>{
    return this._http.post<number>(`${environment.apiUrl}/construct-project/mgr/patch/${code ? 'modify/' + code: 'create'}`,reg, {headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'});
  }


  search(page:number, valid: string, key: string, property: string | null, projectClass: string | null):Observable<PageResult<Project>>{
    let params = new HttpParams({encoder: new CustomEncoder()}).set("page",page ? page.toString() : '0');
    params = params.append("valid",valid);
    params = params.append("key", key);
    if (property){
      params = params.append('property',property);
    }
    if (projectClass){
      params = params.append('class',projectClass);
    }
    //console.log("search business params:", JSON.stringify(params));
    return this._http.get<PageResult<Project>>(`${environment.apiUrl}/construct-project/view/list`,{params: params});
}

}
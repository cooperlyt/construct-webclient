import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageResult } from 'src/app/shared/page-result';
import { CustomEncoder } from 'src/app/shared/custom-encoder';
import { Project, ProjectAndCorp, ProjectReg, JoinCorpAndReg, BuildRegInfo, ProjectRegInfo, JoinCorp, BuildReg } from '../schemas/project';
import { RegInfo } from '../schemas/corp';



@Injectable({providedIn: 'root'})
export class ProjectService{

  constructor(private _http: HttpClient) { }

  project(code:number):Observable<Project>{
    return this._http.get<Project>(`${environment.apiUrl}/construct-project-cache/data/project/${code}`);
  }

  projectAndCorp(code:number):Observable<ProjectAndCorp>{
    return this._http.get<ProjectAndCorp>(`${environment.apiUrl}/construct-project-cache/data/project-corp/${code}`);
  }

  patchProject(reg:ProjectReg, code?:number): Observable<number>{
    return this._http.post<number>(`${environment.apiUrl}/construct-project/mgr/patch/${code ? 'modify/' + code: 'create'}`,reg, {headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'});
  }

  changeProjectStatus(code: number,enable: boolean): Observable<{code: number, enable:boolean}>{
    return this._http.delete<{code: number, enable:boolean}>(`${environment.apiUrl}/construct-project/mgr/${enable ? 'enable' : 'disable'}/${code}`)
  }

  joinCorpAndRegs(code:number): Observable<JoinCorpAndReg[]>{
    return this._http.get<JoinCorpAndReg[]>(`${environment.apiUrl}/construct-project-cache/data/project/${code}/corp/reg`);
  }

  projectBuilds(code: number): Observable<BuildRegInfo[]>{
    return this._http.get<BuildRegInfo[]>(`${environment.apiUrl}/construct-project-cache/data/project/${code}/builds`);
  }

  projectRegInfo(code: number):Observable<ProjectRegInfo>{
    return this._http.get<ProjectRegInfo>(`${environment.apiUrl}/construct-project-cache/data/project/${code}/info`);
  }

  projectBuildReg(code: number):Observable<BuildReg>{
    return this._http.get<BuildReg>(`${environment.apiUrl}/construct-project/view/project/${code}/build`);
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
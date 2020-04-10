import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CorpBusiness, Corp } from 'src/app/shared/data/corp';
import { environment } from 'src/environments/environment';
import { PageResult } from 'src/app/shared/page-result';
import { CustomEncoder } from 'src/app/shared/custom-encoder';

export declare class CorpStautsResult {
    code:string;
    enable:boolean;
}

@Injectable({providedIn: 'root'})
export class CorpService{

    constructor(private _http: HttpClient) { }

    business(id: string): Observable<CorpBusiness>{
        return null;
    }

    corp(id: string):Observable<Corp>{
        return null;
    }

    patchCreateCorp(business: CorpBusiness): Observable<string>{
        return this._http.post<string>(`${environment.apiUrl}/construct-attach-corp/mgr/path/create`,business, {headers: {"Accept" : "text/plain"}});
    }
    

    changeCorpStatus(code: string,enable: boolean): Observable<CorpStautsResult>{
        return this._http.delete<CorpStautsResult>(`${environment.apiUrl}/construct-attach-corp/mgr/${enable ? 'enable' : 'disable'}/${code}`)
    }

    search(page:number, valid: string, key: string, type: | null):Observable<PageResult<Corp>>{
        let params = new HttpParams({encoder: new CustomEncoder()}).set("page",page ? page.toString() : '0');
        params = params.append("valid",valid);
        params = params.append("key", key);
        if (type){
            params = params.append('type',type);
        }
        console.log("search business params:", JSON.stringify(params));
        return this._http.get<PageResult<Corp>>(`${environment.apiUrl}/construct-attach-corp/view/list`,{params: params});
    }
}
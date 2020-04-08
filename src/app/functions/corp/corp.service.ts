import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CorpBusiness, Corp } from 'src/app/shared/data/corp';
import { environment } from 'src/environments/environment';

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
}
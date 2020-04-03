import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CorpBusiness, Corp } from 'src/app/shared/data/corp';


@Injectable()
export class CorpService{

    constructor(private _http: HttpClient) { }

    business(id: string): Observable<CorpBusiness>{
        return null;
    }

    corp(id: string):Observable<Corp>{
        return null;
    }
}
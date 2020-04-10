import { Resolve } from '@angular/router';
import { Corp } from 'src/app/shared/data/corp';
import { CorpService } from './corp.service';
import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class CorpResolver implements Resolve<Corp>{

    constructor(private _service: CorpService){}
    
    resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): Corp | import("rxjs").Observable<Corp> | Promise<Corp> {
       return this._service.corp(route.params['id']);
    }

}
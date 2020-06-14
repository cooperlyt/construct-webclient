import { Resolve } from '@angular/router';
import { Corp } from 'src/app/shared/schemas/corp';

import { Injectable } from '@angular/core';
import { CorpService } from 'src/app/shared/remote-services/corp.service';


@Injectable({providedIn: 'root'})
export class CorpResolver implements Resolve<Corp>{

    constructor(private _service: CorpService){}
    
    resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): Corp | import("rxjs").Observable<Corp> | Promise<Corp> {
       
        const id = route.params['cid'] || route.parent.params['cid']
        return this._service.corp(id);
    }

}
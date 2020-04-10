import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { Corp } from 'src/app/shared/data/corp';
import { CorpService } from './corp.service';
import { PageResult } from 'src/app/shared/page-result';


@Injectable({providedIn: 'root'})
export class CorpListResolver implements Resolve<PageResult<Corp>>{

    constructor(private _service: CorpService){}

    resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): PageResult<Corp> | import("rxjs").Observable<PageResult<Corp>> | Promise<PageResult<Corp>> {
        const page = route.queryParams["page"] || 0;
        const key = route.queryParams['key'] || '';
        const valid = (route.queryParams['valid'] || 'false') === 'true' ? 'false' : 'true';
        const type = route.queryParams['type'];

        return this._service.search(page,valid,key,type);
    }

    
}
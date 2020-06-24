import { Resolve } from '@angular/router';

import { Injectable } from '@angular/core';
import { FireCheckService } from './fire-check.service';
import { FireCheck } from './schemas';


@Injectable({providedIn: 'root'})
export class FireCheckResolver implements Resolve<FireCheck> {

  constructor(private service: FireCheckService ){}

  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): FireCheck | import("rxjs").Observable<FireCheck> | Promise<FireCheck> {
    return this.service.fireCheck(route.params['id']);
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FunctionGuard implements  CanActivate, CanLoad, CanActivateChild{



    checkRole(): Observable<boolean>{
        //TODO implements
        return of(true);
    }

    canLoad(route: import("@angular/router").Route, segments: import("@angular/router").UrlSegment[]): boolean | import("rxjs").Observable<boolean> | Promise<boolean> {
       return this.checkRole();
    }
    canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        return this.checkRole();
    }

    canActivateChild(childRoute: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        return this.checkRole();
    }

}
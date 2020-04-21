import { Resolve } from '@angular/router';
import { Project } from 'src/app/shared/data/project';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ProjectResolver implements Resolve<Project> {

    resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): Project | import("rxjs").Observable<Project> | Promise<Project> {
        throw new Error("Method not implemented.");
    }
    
}
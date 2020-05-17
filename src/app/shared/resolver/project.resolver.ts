import { Resolve } from '@angular/router';
import { Project } from 'src/app/shared/data/project';
import { Injectable } from '@angular/core';
import { ProjectService } from 'src/app/shared/remote-services/project.service';

@Injectable({providedIn: 'root'})
export class ProjectResolver implements Resolve<Project> {

    constructor(private service: ProjectService){

    }

    resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): Project | import("rxjs").Observable<Project> | Promise<Project> {
        const id = route.params['pid'] || route.parent.params['pid']
        return this.service.project(id);
    }
    
}
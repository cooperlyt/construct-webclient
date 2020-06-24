import { Resolve } from '@angular/router';
import { ProjectAndCorp } from 'src/app/shared/schemas/project';
import { Injectable } from '@angular/core';
import { ProjectService } from 'src/app/shared/remote-services/project.service';




@Injectable({providedIn: 'root'})
export class ProjectEditResolver implements Resolve<ProjectAndCorp> {

    constructor(private service: ProjectService){

    }

    resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): ProjectAndCorp | import("rxjs").Observable<ProjectAndCorp> | Promise<ProjectAndCorp> {
        const id = route.params['pid'];
        return this.service.projectAndCorp(id);
    }
    
}
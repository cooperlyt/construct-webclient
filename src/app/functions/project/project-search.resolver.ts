import { Injectable } from '@angular/core';
import { ProjectService } from 'src/app/shared/remote-services/project.service';
import { PageResult } from 'src/app/shared/page-result';
import { Project } from 'src/app/shared/data/project';
import { Resolve } from '@angular/router';

@Injectable({providedIn: 'root'})
export class ProjectSearchResolver implements Resolve<PageResult<Project>>{

  constructor(private _service: ProjectService){}


  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): PageResult<Project> | import("rxjs").Observable<PageResult<Project>> | Promise<PageResult<Project>> {
    const page = route.queryParams["page"] || 0;
    const key = route.queryParams['key'] || '';
    const valid = (route.queryParams['valid'] || 'false') === 'true' ? 'false' : 'true';

    const property = route.queryParams['property'];
    const projectClass = route.queryParams['class'];

    return this._service.search(page,valid,key,property,projectClass);
  }
}
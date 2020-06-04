import { Resolve } from '@angular/router';
import { Task } from '../schemas';
import { Injectable } from '@angular/core';
import { CamundaRestService } from '../camunda-rest.service';

@Injectable({providedIn: 'root'})
export class BusinessKeyTasksResolver implements Resolve<Task[]> {

  constructor(private service: CamundaRestService ){}

  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): Task[] | import("rxjs").Observable<Task[]> | Promise<Task[]> {
    return this.service.getTaskByBusinessKey(route.params['id']);
  }
}
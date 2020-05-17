import { Resolve } from '@angular/router';
import { Task } from 'src/app/business/schemas';
import { FireCheck } from '../schemas';
import { CamundaRestService } from 'src/app/business/camunda-rest.service';
import { switchMap, map } from 'rxjs/operators';
import { FireCheckService } from '../fire-check.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


export class FireTask{
  constructor(public task: Task,
  public fireCheck: FireCheck){}
}

@Injectable({providedIn: 'root'})
export class FireTaskResolver implements Resolve<FireTask> {

  constructor(private camundaService:CamundaRestService,
    private fireService:FireCheckService){}

  private getFireCheckByProcessId(processInstanceId: string): Observable<FireCheck>{
    return this.camundaService.getProcessInstance(processInstanceId).pipe(
      switchMap(process => (this.fireService.fireCheck(Number(process.businessKey))))
    );
  }

  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): FireTask | import("rxjs").Observable<FireTask> | Promise<FireTask> {
    
    let taskId = route.queryParams['tid'];
    
    return this.camundaService.getTask(taskId).pipe(
        switchMap((task) => (this.getFireCheckByProcessId(task.processInstanceId).pipe(
          map(check => (new FireTask(task,check)))
        )))
      )
  }
  
}
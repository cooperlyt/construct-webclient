import { Injectable, OnDestroy } from '@angular/core';
import { FireCheck } from '../schemas';
import { Task, ProcessInstance, ProcessDefinition } from 'src/app/business/schemas';
import { CamundaRestService, TaskDetails } from 'src/app/business/camunda-rest.service';
import { FireCheckService } from '../fire-check.service';
import { Observable, forkJoin, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, map, tap, mergeMap, takeUntil } from 'rxjs/operators';
import { AuthenticationService, UserInfo } from 'src/app/auth/authentication.service';
import { TaskRouterService } from 'src/app/business/tasks/task-router.service';


@Injectable()
export class FireTaskDataService implements OnDestroy{

  private behaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private camundaService:CamundaRestService,
    private taskRouteService: TaskRouterService,
    private fireService:FireCheckService){}


  private _destroyed = new Subject();

  taskId: string;
  task: TaskDetails;
  fireCheck: FireCheck;

  loadding: boolean = false;

  load(taskId: string):Observable<boolean>{
    //let taskId = route.queryParams['tid'];
    this.taskId = taskId;
    this.loadding = true;

    this.camundaService.getTaskDetails(taskId).pipe(
      takeUntil(this._destroyed),
      tap(task => this.task = task),
      switchMap(task => this.fireService.fireCheck(Number(task.processInstance.businessKey)))
    ).subscribe(fire => {
      this.fireCheck = fire;
      this.loadding = false;
      this.behaviorSubject.next(true);
    });
    return this.behaviorSubject.asObservable();
  }

  claim(){
    this.camundaService.claimTask(this.taskId,this.task.auth.user_name).pipe(
      switchMap(() => this.camundaService.getTask(this.taskId))
    ).subscribe(task => this.task.task = task);
  }

  unclaim(){
    this.camundaService.unclaimTask(this.taskId).pipe(
      switchMap(() => this.camundaService.getTask(this.taskId))
    ).subscribe(task => this.task.task = task);
  }

  data():Observable<boolean>{
    return this.behaviorSubject.asObservable();
  }

  ngOnDestroy(): void {
    console.log("service destory");
    this._destroyed.next();
    this._destroyed.complete();
  }

  completeTask():void{
    this.taskRouteService.complete(this.task.task);
  }


}
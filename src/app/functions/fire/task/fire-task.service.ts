import { Injectable, OnDestroy } from '@angular/core';
import { FireCheck } from '../schemas';
import { Task, ProcessInstance, ProcessDefinition } from 'src/app/business/schemas';
import { CamundaRestService } from 'src/app/business/camunda-rest.service';
import { FireCheckService } from '../fire-check.service';
import { Observable, forkJoin, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, map, tap, mergeMap, takeUntil } from 'rxjs/operators';


@Injectable()
export class FireTaskDataService implements OnDestroy{

  private behaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private camundaService:CamundaRestService,
    private fireService:FireCheckService){}

  private getFireCheckByProcessId(processInstanceId: string): Observable<FireCheck>{
    return ;
  }

  private _destroyed = new Subject();

  task:Task;
  processInstance: ProcessInstance;
  processDefinition: ProcessDefinition;
  fireCheck: FireCheck;

  loadding: boolean = false;

  load(taskId: string):Observable<boolean>{
    //let taskId = route.queryParams['tid'];
    this.loadding = true;
    this.camundaService.getTask(taskId).pipe(
      takeUntil(this._destroyed),
      tap(task => this.task = task),
      switchMap(task => (this.camundaService.getProcessInstance(task.processInstanceId).pipe(
        takeUntil(this._destroyed),
        tap(process => this.processInstance = process),
        switchMap(process => forkJoin(this.fireService.fireCheck(Number(process.businessKey)).pipe(takeUntil(this._destroyed)),
          this.camundaService.getProcessDefinitionById(process.definitionId).pipe(takeUntil(this._destroyed))).pipe(takeUntil(this._destroyed)))
      )))
    ).subscribe(
      res => {
        this.fireCheck = res[0]; 
        this.processDefinition = res[1];
        this.loadding = false;
        this.behaviorSubject.next(true);
      }
    )
    return this.behaviorSubject.asObservable();
  }

  data():Observable<boolean>{
    return this.behaviorSubject.asObservable();
  }

  ngOnDestroy(): void {
    console.log("service destory");
    this._destroyed.next();
    this._destroyed.complete();
  }

}
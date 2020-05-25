import { Injectable, OnDestroy } from '@angular/core';
import { FireCheck } from '../schemas';
import { Task, ProcessInstance, ProcessDefinition } from 'src/app/business/schemas';
import { CamundaRestService } from 'src/app/business/camunda-rest.service';
import { FireCheckService } from '../fire-check.service';
import { Observable, forkJoin, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, map, tap, mergeMap, takeUntil } from 'rxjs/operators';
import { AuthenticationService, UserInfo } from 'src/app/auth/authentication.service';


@Injectable()
export class FireTaskDataService implements OnDestroy{

  private behaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private camundaService:CamundaRestService,
    private authService: AuthenticationService,
    private fireService:FireCheckService){}


  private _destroyed = new Subject();

  taskId: string;
  task:Task;
  processInstance: ProcessInstance;
  processDefinition: ProcessDefinition;
  fireCheck: FireCheck;
  userInfo: UserInfo;

  loadding: boolean = false;

  load(taskId: string):Observable<boolean>{
    //let taskId = route.queryParams['tid'];
    this.taskId = taskId;
    this.loadding = true;
    this.camundaService.getTask(taskId).pipe(
      takeUntil(this._destroyed),
      tap(task => this.task = task),
      switchMap(task => (this.camundaService.getProcessInstance(task.processInstanceId).pipe(
        takeUntil(this._destroyed),
        tap(process => this.processInstance = process),
        switchMap(process => forkJoin(this.fireService.fireCheck(Number(process.businessKey)).pipe(takeUntil(this._destroyed)),
          this.authService.getUserInfo(),
          this.camundaService.getProcessDefinitionById(process.definitionId).pipe(takeUntil(this._destroyed))).pipe(takeUntil(this._destroyed)))
      )))
    ).subscribe(
      res => {
        this.fireCheck = res[0]; 
        this.userInfo = res[1];
        this.processDefinition = res[2];
        this.loadding = false;
        this.behaviorSubject.next(true);
      }
    )
    return this.behaviorSubject.asObservable();
  }

  get isClaim():boolean{
    if (this.loadding){
      return false;
    }else{
      return this.task.assignee === this.userInfo.user_name;
    }
  }

  get isCanClaim():boolean{
    if (this.load){
      return false;
    }else{
      return  !this.task.assignee ;
    }
  }

  claim(){
    this.camundaService.claimTask(this.taskId,this.userInfo.user_name);
  }

  unclaim(){
    this.camundaService.unclaimTask(this.taskId);
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
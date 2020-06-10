import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FireTaskDataService } from './fire-task.service';
import { FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { MatExpansionPanel } from '@angular/material/expansion';
import { faUserTie, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FireCheck } from '../schemas';
import { Task } from 'src/app/business/schemas';
import { TaskRouterService } from 'src/app/business/tasks/task-router.service';
import { environment } from 'src/environments/environment';

@Component({templateUrl:"./completed.html"})
export class FireTaskCompletedComponent implements OnInit{

  check: FireCheck;
  tasks: Task[];

  reportUrl = `${environment.fileUrl}/pdf/`;

  constructor(private _taskRouter: TaskRouterService,
    private _route: ActivatedRoute,_func: FunctionPageBar){
    _func.loadTitle('业务处理完成');
  }


  ngOnInit(): void {
    this._route.data.subscribe(data => {
      this.check = data.check;
      this.tasks = data.tasks;
    })
  }

  viewTask(i:number){
    this._taskRouter.view(this.tasks[i]);
  }

}

@Component({templateUrl:"./task-view.html", providers:[FireTaskDataService]})
export class FireTaskViewComponent implements OnInit{

  reportUrl = `${environment.fileUrl}/pdf/`;

  constructor(public dataService: FireTaskDataService,
    private _route: ActivatedRoute,_func: FunctionPageBar){
      this._route.params.subscribe(params => dataService.load(params['tid']).subscribe(complete => {if (complete) _func.loadTitle(dataService.task.processDefine.name + ' / ' + dataService.task.task.name)}));
  }



  ngOnInit(): void {

  }

}


@Component({selector:"fire-task-view-info",
  template:`<fire-check-info [fireCheck]="dataService.fireCheck"></fire-check-info>`,
  styleUrls:['./info.scss']})
export class FireCheckProjectInfoComponent{
  faUserTie = faUserTie;
  faPhone = faPhone;
  
  constructor(public dataService: FireTaskDataService){}
}

@Component({selector:"fire-task-document", 
  template:`<business-document-files *ngIf="!dataService.loadding" [taskId]="dataService.taskId" [editable]="dataService.task.isClaim" [businessId]="dataService.task.processInstance.businessKey"></business-document-files>`})
export class FireCheckDocumentComponent implements OnInit{

  constructor(public dataService: FireTaskDataService){}

  ngOnInit(): void {
  }

}

// export class FireCheckTableComponent implements OnInit{
  
//   ngOnInit(): void {
//     throw new Error("Method not implemented.");
//   }

// }

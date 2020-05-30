import { Injectable } from '@angular/core';
import { CamundaRestService } from '../camunda-rest.service';
import { Router } from '@angular/router';
import { Task } from '../schemas';
import { MatDialog } from '@angular/material/dialog';
import { TaskCompleteDialog } from './task-complete.component';


const TASK_VIEW_PATH: {[key:string]:string} = {
  fire_check_view:'fire'
}

const TASK_EDIT_VALUE_CHECK: string = "check";
const TASK_EDIT_DEFINE_KEY: string = "edit";
const TASK_VIEW_DEFINE_KEY: string = "view";


@Injectable({providedIn: 'root'})
export class TaskRouterService {

  constructor(private _service: CamundaRestService,private _router: Router,private dialog: MatDialog ){}

  view(task:Task){
    this._service.getTaskExtensions(task.processDefinitionId,task.taskDefinitionKey,TASK_VIEW_DEFINE_KEY).subscribe(val => {
      console.log('task route to ' + val + '->' + TASK_VIEW_PATH[val]);
      this._router.navigate(['task',TASK_VIEW_PATH[val],task.id]);
    });
  }

  complete(task: Task){
    this._service.getTaskExtensions(task.processDefinitionId,task.taskDefinitionKey,TASK_EDIT_DEFINE_KEY).subscribe(val => {
      if (val){
        this.dialog.open(TaskCompleteDialog,{
          width: '400px',
          data: task
        }).afterClosed().subscribe(id => {console.log(id)})
      }else if(val === TASK_EDIT_VALUE_CHECK ){
        
      }else{
        this._router.navigate(['task',TASK_VIEW_PATH[val],task.id]);
      }
      
    });
  }

}
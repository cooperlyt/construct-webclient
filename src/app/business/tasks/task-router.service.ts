import { Injectable } from '@angular/core';
import { CamundaRestService } from '../camunda-rest.service';
import { Router } from '@angular/router';
import { Task } from '../schemas';


const TASK_VIEW_PATH: {[key:string]:string} = {
  fire_check_view:'/task/fire'
}


const TASK_EDIT_PATH: {[key:string]:string} = {
  check_task: ''
}

const TASK_VIEW_DEFINE_KEY: string = "view";
const TASK_EDIT_DEFINE_KEY: string = "edit";

@Injectable({providedIn: 'root'})
export class TaskRouterService {


  constructor(private _service: CamundaRestService,private _router: Router, ){}

  view(task:Task){
    this._service.getTaskExtensions(task.processDefinitionId,task.taskDefinitionKey,TASK_VIEW_DEFINE_KEY).subscribe(val => {
      console.log('task route to ' + val + '->' + TASK_VIEW_PATH[val]);
      this._router.navigate([TASK_VIEW_PATH[val]],{queryParams:{tid: task.id}});
    });
  }

  edit(task:Task){
    this._service.getTaskExtensions(task.processDefinitionId,task.taskDefinitionKey,TASK_EDIT_DEFINE_KEY).subscribe(val => {
      this._router.navigate([TASK_EDIT_PATH[val]],{queryParams:{tid: task.id}});
    });
  }


}
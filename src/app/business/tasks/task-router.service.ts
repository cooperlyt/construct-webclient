import { Injectable } from '@angular/core';
import { CamundaRestService } from '../camunda-rest.service';
import { Router } from '@angular/router';
import { Task } from '../schemas';
import { MatDialog } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({selector:'dialog-task-complete', templateUrl:'./task-complete-dialog.html'})
export class TaskCompleteDialog{
  
  constructor(  public dialogRef: MatDialogRef<TaskCompleteDialog>,
    @Inject(MAT_DIALOG_DATA) public task: Task){}


    onCancelClick(): void {
      this.dialogRef.close();
    }
}


@Component({selector:'dialog-task-check', templateUrl:'./task-check-dialog.html'})
export class TaskCheckDialog{
  
  constructor(  public dialogRef: MatDialogRef<TaskCheckDialog>,
    @Inject(MAT_DIALOG_DATA) public task: Task){}


    onCancelClick(): void {
      this.dialogRef.close();
    }
}

const TASK_VIEW_PATH: {[key:string]:string} = {
  fire_check_view:'fire'
}

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

  complete(task: Task, completePage?: string){
    this._service.getAllTaskExtensions(task.processDefinitionId,task.taskDefinitionKey).subscribe(properties => {
      if (properties.edit){
        this._router.navigate(['task',TASK_VIEW_PATH[properties.edit],task.id]);

      }else if (properties.check){
        this.dialog.open(TaskCheckDialog,{
          width: '400px',
          data: task
        }).afterClosed().subscribe(result => {
          if (result){
            this._service.postCompleteTask(result.id, !properties.reapply ? {variables:{[properties.check]: result.checked, ['comment']: result.comment}} : {variables: {[properties.reapply]:false , [properties.check]: result.checked, ['comment']: result.comment}}).subscribe(() =>{
                if (completePage){
                  this._router.navigate(['task',task.id]);
                }
            })
          }
        });
      }else{
        this.dialog.open(TaskCompleteDialog,{
          width: '400px',
          data: task
        }).afterClosed().subscribe(id => {
          if (id){
            this._service.postCompleteTask(id, !properties.reapply ? {variables:{}} : {variables: {[properties.reapply]:false}}).subscribe(() =>{
                if (completePage){
                  this._router.navigate(['task',task.id]);
                }
            })
          }
        });
      }


      
    });
  }

}
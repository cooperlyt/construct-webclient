import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../schemas';




@Component({selector:'dialog-task-complete', templateUrl:'./task-complete-dialog.html'})
export class TaskCompleteDialog{
  
  constructor(  public dialogRef: MatDialogRef<TaskCompleteDialog>,
    @Inject(MAT_DIALOG_DATA) public task: Task){}


    onCancelClick(): void {
      this.dialogRef.close();
    }
}
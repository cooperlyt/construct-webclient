import { Component, Inject, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

export interface ConfirmData{
  title: string;
  description: string;
  result: any;
  confirm?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmData) {
  }

  confirmInput: string;

  get confirmDisalbed():boolean{
    if (this.data.confirm){
      return this.confirmInput !== this.data.confirm;
    }else{
      return false;
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick():void {
    this.dialogRef.close(this.data.result);
  }

}


@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],  entryComponents:[
    ConfirmDialogComponent
  ]
})
export class ConfirmDialogModule { }
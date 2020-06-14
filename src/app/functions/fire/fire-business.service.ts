import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FireCheckService } from './fire-check.service';
import { ProjectFireCheckStatus } from './schemas';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Injectable({providedIn: 'root'})
export class FireBusinessService{

  constructor(private _router: Router,
    private _service: FireCheckService,
    private _toastr: ToastrService,
    public dialog: MatDialog){}

  createFireBusiness(projectCode: number){
    this._service.projectFireCheckStatus(projectCode).subscribe(status => {
      switch(status){
        case  ProjectFireCheckStatus.None:
        case  ProjectFireCheckStatus.PartQualified:{
          this._router.navigate(['/function/fire/create',projectCode]);
          break;
        }
        case  ProjectFireCheckStatus.Qualified:{
          this.dialog.open(ConfirmDialogComponent,
            {width:'400px',
            role:'alertdialog',
            data:{title: `建立业务`, description: '项目消防验收已经合格,是否仍要建立业务?' , 
            result: projectCode }}).afterClosed().subscribe(result => {
              if (result){
                this._router.navigate(['/function/fire/create',result]);
              }
            })
          break;
        }
        case  ProjectFireCheckStatus.Unqualified:{
          this.dialog.open(ConfirmDialogComponent,
            {width:'400px',
            role:'alertdialog',
            data:{title: `建立业务`, description: '项目消防备案抽查不合格,是否建立复查业务?' , 
            result: projectCode }}).afterClosed().subscribe(result => {
              if (result){
                this._service.creeateReview(result).subscribe(
                  val => {
                    this._router.navigate(['/function/fire/created',val.id]);
                  },
                  err => {
                    this._toastr.error("请联系管理员或请稍后再试！","存储数据失败");
                    console.log(err);
                  }
                )
              }
            })
          break;
        }
        case  ProjectFireCheckStatus.RUNNING:{
          this.dialog.open(ConfirmDialogComponent,
            {width:'400px',
            role:'alertdialog',
            data:{title: `建立业务`, description: '项目正在运行消防验收/备案业务! 需要完成后才可再次建立!' , 
            result: projectCode }});
          break;
        }
      }
    })
  }
}
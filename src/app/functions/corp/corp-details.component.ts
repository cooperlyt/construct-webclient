import { Component, OnInit } from '@angular/core';
import { PageFunctionBase, FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { CorpService } from '../../shared/remote-services/corp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Corp } from 'src/app/shared/data/corp';
import {DataUtilsService } from 'src/app/shared/data/define';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'corp-info',
    templateUrl: './info.html',
    styleUrls: []
  })
export class CorpInfoComponent implements OnInit{

    

    constructor(
        public dialog: MatDialog,
        public dataUtil: DataUtilsService,
        private _toastr: ToastrService,
        private _service: CorpService, 
        private _route: ActivatedRoute,
        private _router: Router){
    }

    corp:Corp;
  
    statusWaiting = false;
  
    edit():void{
      this._router.navigate(['../../../edit',this.corp.code],{relativeTo:this._route});
    }
  
    changeStatus(){
      const enable = !this.corp.enable;
      const dialogRef = this.dialog.open(ConfirmDialogComponent,{width:'400px',role:'alertdialog',data:{title: `${enable ? '启用' : '禁用' }参建单位`, description: enable ? '将要恢此参建单位为可用状态.': '禁用后此参单位将不可再使用,单位即不可以登录系统,也不可再参与任何相关业务.但不影响此单位参与的项目和业务,仍可在业务中查看此单位.您也可以随时恢复使用此单位.' , result: enable }});
      dialogRef.afterClosed().subscribe(result => {
        this.statusWaiting = true;
        this._service.changeCorpStatus(this.corp.code,result).pipe(
          catchError(err => {
            this.statusWaiting = false;
            this._toastr.error("请联系管理员或请稍后再试！","状态设置失败");
            return empty;
          })
        ).subscribe(sr=>{
            if (sr.code === this.corp.code){
              this.corp.enable = sr.enable;
            }
            this.statusWaiting = false;
        });
      });
    }
  
  
    ngOnInit(): void {
      this._route.data.subscribe(data => {
        this.corp = data.corp;

      })
    }
}

@Component({
    selector: 'corp-business',
    templateUrl: './business.html',
    styleUrls: []
  })
export class CorpBusinessComponent implements OnInit{
    ngOnInit(): void {

    }
}


@Component({
    selector: 'corp-projects',
    templateUrl: './projects.html',
    styleUrls: []
  })
export class CorpProjectsComponent implements OnInit{
    ngOnInit(): void {

    }
}


@Component({
    selector: 'corp-details',
    templateUrl: './details.html'
})
export class CorpDetailsComponent extends PageFunctionBase{
  
    constructor(
      _route: ActivatedRoute,
      _func: FunctionPageBar){
      super(_route,_func);
    }
  

}
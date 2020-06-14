import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { PageFunctionBase, FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { CorpService } from '../../shared/remote-services/corp.service';
import { ActivatedRoute, Router, Resolve } from '@angular/router';
import { Corp, CorpEmployee } from 'src/app/shared/schemas/corp';
import {DataUtilsService } from 'src/app/shared/schemas/define';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { catchError, switchMap } from 'rxjs/operators';
import { empty } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'corp-info',
    templateUrl: './info.html',
    styleUrls: ['./info.scss']
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
  selector: 'corp-employee',
  templateUrl: './employee.html'
})
export class CorpEmployeeComponent implements OnInit{

  constructor(private _route: ActivatedRoute, public dialog: MatDialog,
    private _toastr: ToastrService,
    private corpServices: CorpService){}

  employees: CorpEmployee[];
  corpId: number;

  ngOnInit(): void {
    this._route.data.subscribe(data => this.employees = data.employees);
    this._route.parent.params.subscribe(params => this.corpId = params['cid']);
  }

  resetPassword(username: string){
    this.dialog.open(ConfirmDialogComponent,{width:'400px',role:'alertdialog',data:{title:'重置密码', description: '密码将重置为电话号码!' , result: username }})
    .afterClosed().subscribe(result => {
      if (result){
        this.corpServices.resetEmployeePassword(result).subscribe(() => {
          this._toastr.info("密码已重置为电话号码!","密码已重置");
        })
      }
     
    });

  }

  newEmployee(){
    this.dialog.open(CorpEmployeeEditorDialogComponent,{
      width: '600px',
      disableClose: true,
      data: {}
    }).afterClosed().subscribe(result => {
      if (result){
        console.log(result);
        this.corpServices.addEmployee(this.corpId,result).pipe(
          switchMap(() => this.corpServices.listCorpEmployee(this.corpId))
        )
        .subscribe(result => this.employees = result)
 
      }
    })
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

@Component({
  selector: 'corp-employee-edit-dialog',
  templateUrl: './employee-editor-dialog.html'
})
export class CorpEmployeeEditorDialogComponent {

  employeeForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private _fb: FormBuilder,public dataUtils: DataUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: CorpEmployee) {
      this.employeeForm = this._fb.group({
        name:[data.name, [Validators.required,Validators.maxLength(32)]],
        phone:[data.phone, [Validators.required, Validators.maxLength(16)]],
        idType:[data.idType, Validators.required],
        idNumber:[data.idNumber, Validators.maxLength(32)],
      });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


  
}
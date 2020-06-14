import { OnInit, Component } from '@angular/core';
import { Project, JoinCorp, BuildRegInfo } from 'src/app/shared/schemas/project';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/remote-services/project.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { faUserTie, faPhone } from '@fortawesome/free-solid-svg-icons';
import { PageFunctionBase, FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { FireBusinessService } from '../fire/fire-business.service';


@Component({selector: "project-details", templateUrl: "./details.html"})
export class ProjectDetailsComponent extends PageFunctionBase implements OnInit{

    constructor(_route: ActivatedRoute, _func: FunctionPageBar){
        super(_route,_func);
    }
    ngOnInit(): void {
    }

}

@Component({selector: "project-info", templateUrl:"./info.html", styleUrls:['./info.scss']})
export class ProjectInfoComponent implements OnInit{

    faUserTie = faUserTie;
    faPhone = faPhone;

    project: Project;

    statusWaiting: boolean = false;

    builds: BuildRegInfo[];
    delBuilds: BuildRegInfo[];

    constructor(private _route: ActivatedRoute, 
        private _service: ProjectService,
        private _toastr: ToastrService,
        public dialog: MatDialog,
        private _fireBusinessSvr: FireBusinessService,
        private _router: Router){}

    changeStatus(){
        const enable = !this.project.enable;
        const dialogRef = this.dialog.open(ConfirmDialogComponent,{width:'400px',role:'alertdialog',data:{title: `${enable ? '启用' : '禁用' }参建单位`, description: enable ? '将要恢此参建单位为可用状态.': '禁用后此参单位将不可再使用,单位即不可以登录系统,也不可再参与任何相关业务.但不影响此单位参与的项目和业务,仍可在业务中查看此单位.您也可以随时恢复使用此单位.' , result: enable }});
        dialogRef.afterClosed().subscribe(result => {
          this.statusWaiting = true;
          this._service.changeProjectStatus(this.project.code,result).pipe(
            catchError(err => {
              this.statusWaiting = false;
              this._toastr.error("请联系管理员或请稍后再试！","状态设置失败");
              return empty;
            })
          ).subscribe(sr=>{
              if (sr.code === this.project.code){
                this.project.enable = sr.enable;
              }
              this.statusWaiting = false;
          });
        });
    }

    edit(){
        this._router.navigate(['../../../edit',this.project.code],{relativeTo:this._route});
    }

    ngOnInit(): void {
        this._route.data.subscribe(data => {
            console.log(data);
            this.project = data.project;
            this.builds = this.project.builds.filter(build => build.operation != 'DELETE');
            this.delBuilds = this.project.builds.filter(build => build.operation == 'DELETE');
        })
    }

    createFireBusiness(){
        this._fireBusinessSvr.createFireBusiness(this.project.code);
    }
}


@Component({selector: "project-business", templateUrl:"./business.html"})
export class ProjectBusinessComponent implements OnInit{
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

}
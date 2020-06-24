import { NgModule, OnInit, Component, Injectable, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Params } from '@angular/router';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'
import { SearchCondition, SearchFunctionBase, FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CustomEncoder } from 'src/app/shared/custom-encoder';
import {MatTableModule} from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AsyncValidator, AbstractControl, NG_VALIDATORS, AsyncValidatorFn, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule, MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule, MatCheckboxChange} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import { ConfirmDialogModule, ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';



export declare class User{
  username:string;
  name:string;
  enabled:boolean;
  email:string;
  phone:string;
  password:string;
}

export declare class Role{
  authority:string;
  name:string;
  description:string;
}

export declare class UserRole{
  has:boolean;
  role: Role;
}

function uniqueUsernameValidator(_http: HttpClient): AsyncValidatorFn {

  return (control: AbstractControl):  Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
     return _http.get<any>(`${environment.apiUrl}/authenticationservice/auth/user/exists/${control.value}`).pipe(
      map(exists => (exists ? {exists: true} : null)),
      catchError(() => of(null))
    );
  }

} 

function uniqueUserPhoneValidator(_http: HttpClient): AsyncValidatorFn {

  return (control: AbstractControl):  Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return _http.get<boolean>(`${environment.apiUrl}/authenticationservice/auth/user/exists/phone/${control.value}`).pipe(
      map(exists => (exists ? {exists: true} : null)),
      catchError(() => of(null))
    );
  }
}

@Injectable({providedIn: 'root'})
export class UserService{
  constructor(
    private _http: HttpClient){}


    search(enable:boolean, key?:string):Observable<User[]>{
      let params = new HttpParams({encoder: new CustomEncoder()}).set("enable",enable ?  'true' : 'false');
      if (key){
          params = params.append('key',key);
      }
      return this._http.get<User[]>(`${environment.apiUrl}/authenticationservice/admin/hr/user/search`,{params: params})
    }


    add(user: User):Observable<string>{
      return this._http.post<string>(`${environment.apiUrl}/authenticationservice/admin/hr/user/add`,user,{headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'})
    }

    delete(username:string):Observable<string>{
      return this._http.delete<string>(`${environment.apiUrl}/authenticationservice/admin/hr/user/del/${username}`,{headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'}) 
    }

    pwdReset(username:string):Observable<string>{
      return this._http.put<string>(`${environment.apiUrl}/authenticationservice/admin/hr/user/pwdreset/${username}`,null,{headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'})
    }

    enable(username:string,enable:boolean):Observable<string>{
      return this._http.put<string>(`${environment.apiUrl}/authenticationservice/admin/hr/user/${enable ? 'enable' : 'disable'}/${username}`,null,{headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'})
    }

    userRoles(username:string):Observable<UserRole[]>{
      return this._http.get<UserRole[]>(`${environment.apiUrl}/authenticationservice/admin/hr/user/roles/${username}`)
    }

    addRole(username:string, role:string):Observable<string>{
      return this._http.put<string>(`${environment.apiUrl}/authenticationservice/admin/hr/user/${username}/role/add/${role}`,null,{headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'})
    }

    removeRole(username:string, role:string):Observable<string>{
      return this._http.put<string>(`${environment.apiUrl}/authenticationservice/admin/hr/user/${username}/role/remove/${role}`,null,{headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'});
    }
}

@Component({
  selector:'role-editor-dialog',
  templateUrl: './role.dialog.html'
})
export class RoleDialog {

  roles:UserRole[];

  constructor(
    private _service: UserService,
    public dialogRef: MatDialogRef<EmployeeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ){
    this._service.userRoles(data).subscribe(
      roles => this.roles = roles
    )
  }


  private add(role:Role){
    this._service.addRole(this.data,role.authority).subscribe(
      result => {}
    )
  }

  private remove(role:Role){
    this._service.removeRole(this.data,role.authority).subscribe(
      result => {}
    )
  }

  roleChange(event: MatCheckboxChange, i: number){
    if (event.checked){
      this.add(this.roles[i].role);
    }else{
      this.remove(this.roles[i].role);
    }
  }

}

@Component({
  selector: 'employee-editor-dialog',
  templateUrl: './employee.dialog.html'
})
export class EmployeeDialog {

  employeeForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<EmployeeDialog>,
    private _http: HttpClient,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: User) {

      this.employeeForm = this._fb.group({
        username:[data? data.username : null,{
          validators: [Validators.required,Validators.maxLength(32)],
          asyncValidators: [uniqueUsernameValidator(this._http)],
          updateOn: 'blur' 
        }], 
        name:[data? data.name : null, [Validators.required,Validators.maxLength(32)]],
        email:[data?data.email : null,[Validators.maxLength(32)]],
        phone:[data?data.phone : null, 
          {
            validators:[Validators.required, Validators.maxLength(16)],
            asyncValidators:[uniqueUserPhoneValidator(this._http)],
            updateOn: 'blur' 
          }
        ]
          
      });
  }


  onCancelClick(): void {
    this.dialogRef.close();
  }
}

@Injectable({providedIn: 'root'})
export class EmployeeSearchResolver implements Resolve<User[]>{

  constructor(
    private service: UserService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User[] | import("rxjs").Observable<User[]> | Promise<User[]> {
    return this.service.search(JSON.parse(route.queryParams['enable']),route.queryParams['key']);
  }

}

@Component({
  selector: 'app-main',
  templateUrl: './employee.component.html',
  styleUrls: []
})
export class EmployeeComponent extends SearchFunctionBase implements OnInit {

  list: User[];

  showAll:boolean;

  doSearch(key: SearchCondition): void {
    if (key.now){
      let params: Params = {};
      params['key'] = key.key;
      
      this._router.navigate([],{relativeTo: this._route, queryParams: params, queryParamsHandling: 'merge' })
    }
  }



  constructor(
    public dialog: MatDialog,
    private _service: UserService,
    private ngxLoader: NgxUiLoaderService,
    private _toastr: ToastrService,
    private _route: ActivatedRoute, 
    private _router: Router,
    _func: FunctionPageBar) {
    super(_route,_func);
  }

  ngOnInit(): void {
    this._route.data.subscribe(data => this.list = data.list);
    this._route.queryParams.subscribe(params => this.showAll = JSON.parse(params['enable']));
  }

  showChange(event: MatSlideToggleChange){
    console.log(event.checked)
    this._router.navigate([],{relativeTo: this._route, queryParams: {enable: event.checked}, queryParamsHandling: 'merge' })

  }

  refresh(){
    this.ngxLoader.startBackgroundLoader("loader-01")
    this._route.params.subscribe(params => {
      if (params['key']){
        this.ngxLoader.stopBackgroundLoader("loader-01");
        this._router.navigate([],{relativeTo: this._route, queryParams: {key: null}, queryParamsHandling: 'merge' })
      }else{
        this._service.search(this.showAll).subscribe(result => {
          this.list = result;
          this.ngxLoader.stopBackgroundLoader("loader-01");
        })
      }
    })
  }

  add(){
    this.dialog.open(EmployeeDialog, {
      width: '600px',
      disableClose: true,
      data: null
    }).afterClosed().pipe(
      switchMap(result => result ? this._service.add(result) : of(null))
    ).subscribe(result => {
      if (result)
        this.refresh();
    });
  }

  enable(i:number){
    this.dialog.open(ConfirmDialogComponent,{width: '480px',data:{  
      title: `${this.list[i].enabled ? '禁用' : '启用'}确认`,
      description: `将用把 ${this.list[i].name}  设置为 ${this.list[i].enabled ? '禁用' : '启用'} 状态.`,
      result: this.list[i]
    }}).afterClosed().pipe(
      switchMap(result => result ? this._service.enable(result.username, !result.enable) : of(null))
    ).subscribe(result => {
      if (result) this.refresh();
    })
  }

  del(i:number){
    this.dialog.open(ConfirmDialogComponent,{width: '480px',data:{  
      title: `删除确认`,
      description: `将用删除用户 ${this.list[i].name} ,删除后不可恢复.`,
      result: this.list[i]
    }}).afterClosed().pipe(
      switchMap(result => result ? this._service.delete(result.username) : of(null))
    ).subscribe(result => {
      if (result) this.refresh();
    })
  }

  resetPassword(i:number){
    
    this.dialog.open(ConfirmDialogComponent,{width: '480px',data:{  
      title: `重置密码`,
      description: `将为用户 ${this.list[i].name} 重置密码,重置后密码为用户的电话号码.`,
      result: this.list[i]
    }}).afterClosed().pipe(
      switchMap(result => result ? this._service.pwdReset(result.username)  : of(null))
    ).subscribe(result => {
      if (result) this._toastr.info('密码已重置!');

    })
  }

  roleChange(i:number){
    this.dialog.open(RoleDialog,{width: '600px',data: this.list[i].username})
  }
}



const routes: Routes = [ 
  {path : '', component : EmployeeComponent, runGuardsAndResolvers: 'paramsOrQueryParamsChange', resolve:{list: EmployeeSearchResolver} },
  
];

@NgModule({
  declarations: [EmployeeComponent,EmployeeDialog,RoleDialog],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatListModule,
    NgxUiLoaderModule,
    ConfirmDialogModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [EmployeeDialog,RoleDialog]
})
export class EmployeeModule { }

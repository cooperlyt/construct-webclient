import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router'
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;

  user: any;

  searchKey: string;


  search(){
    let params: Params = {page:0};
    if (this.searchKey){
      params['key'] = this.searchKey;
    }

    
    this._router.navigate(['/business-search'], { queryParams: params });
  }

  constructor(
    public dialog: MatDialog,
    private _service: AuthenticationService, 
    private _router: Router,
    private _tostSvr: ToastrService,
    private _route: ActivatedRoute) { }

  ngOnInit() {
      this._service.getUserInfo().subscribe(data => this.user = data);

      this._route.queryParams.subscribe(params => {
        if (params.hasOwnProperty('key')){
          this.searchKey = params['key'];
        }else{
          this.searchKey = null;
        }
    
      });

  }

  changePwd(){
    this.dialog.open(ChangePwdDialog, {
      width: '400px',
      data: this.user
    }).afterClosed().pipe(
      switchMap(result => {
        if (result){
          return this._service.changePassword(result.old,result.password)
        }else{
          return of(result);
        }
      })
    ).subscribe(
      result => {this._tostSvr.info('密码已更改!')},
      err => {this._tostSvr.error('密码更改失败!')}
    )
  }

  logout() {
    this.user = null;
    this._service.logout();
    this._router.navigate(['/login'])
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}


@Component({
  selector: 'dialog-change-password-dialog',
  templateUrl: './change-pwd-dialog.html',
})
export class ChangePwdDialog {

  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<ChangePwdDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      old: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });

  }

  onConfirmClick():void {
    this.dialogRef.close(this.myForm.value);
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
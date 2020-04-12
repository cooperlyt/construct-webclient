
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Router, Params } from '@angular/router';



import { Component, OnInit } from '@angular/core';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';
import { SearchFunctionBase, SearchCondition, FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';


import { Corp } from 'src/app/shared/data/corp';
import { GroupIdType, PersonIdType, DataUtilsService, JoinType } from 'src/app/shared/data/define';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CorpService } from './corp.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { PageResult } from 'src/app/shared/page-result';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-main',
  templateUrl: './corp.component.html',
  styleUrls: ['./corp.component.scss']
})
export class CorpComponent extends SearchFunctionBase implements OnInit {

  faRegistered = faRegistered;
  dataPage: PageResult<Corp>;

  params: {showDisabled : boolean, type: string};

  constructor(
    public dataUtil: DataUtilsService,
    private _router: Router,
    private _route: ActivatedRoute,
    _func: FunctionPageBar) {
    super(_route,_func);
  }

  doSearch(condition: SearchCondition): void {
    if (condition.now){
      let params: Params = {page:0};
      if (condition.key){
        params['key'] = condition.key;
      }
      this._router.navigate([],{relativeTo: this._route, queryParams: params })
    }
  }

  onShowDisabledChange(){
    this._router.navigate([],{relativeTo: this._route,queryParams: {valid: !this.params.showDisabled}, queryParamsHandling: 'merge'})
  }

  onTypeChange(type: string){

    console.log("change :" + type);

    if (!type || type === '' || type === this.params.type){
      this._router.navigate([],{relativeTo: this._route,queryParams: {type: null}, queryParamsHandling: 'merge'})
    }else{
      this._router.navigate([],{relativeTo: this._route,queryParams: {type: type}, queryParamsHandling: 'merge'})
    }


  }

  onPageChange(pageEvent: PageEvent){
    console.log("chang page:" , pageEvent.pageIndex);

    if ((pageEvent.pageIndex) !== this.dataPage.number){

      this._router.navigate([], {relativeTo: this._route, queryParams: {page: pageEvent.pageIndex} ,queryParamsHandling: 'merge'});
    }
  }

  ngOnInit(): void {
    this._route.queryParamMap.subscribe(params => this.params = {showDisabled: JSON.parse(params.get('valid')) ,type : params.get('type')})
    this._route.data.subscribe(data => this.dataPage = data.dataPage)
  }

}


@Component({
  selector: 'corp-edit',
  templateUrl: './corp-edit.component.html',
  styleUrls: ['./corp-edit.component.scss']
})
export class CorpEditComponent extends PageFunctionBase implements OnInit{


  corp: Corp;

  businessForm: FormGroup;

  groupIdTypes = Object.keys(GroupIdType).map(key => ({id: key, name:GroupIdType[key]}));

  personIdType = Object.keys(PersonIdType).map(key => ({id: key, name: PersonIdType[key]}));

  joinTypes:{id: string, name: string}[];



  getJoinTypeLabel(type: JoinType){
    return JoinType[type]
  }

  get regsForm(): FormArray{
    return this.businessForm.get('regs') as FormArray;
  }

  constructor(public dialog: MatDialog,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _service: CorpService,
    private _ngxService: NgxUiLoaderService,
    private _toastr: ToastrService,
    _func: FunctionPageBar) {
    super(_route,_func);
  }

  private calcJoinTypes():void{
    this.joinTypes = Object.keys(JoinType).filter(key => {
   
      if ((!this.corp ||  !this.corp.regs.find(reg => reg.id.type == key) )&&
        !this.businessForm.value.regs.find(reg => reg.id.type == key))
      return true;
    }).map(key => ({id: key, name: JoinType[key]}));
  }

  addJoinType(type: JoinType):void{
    console.log(type);
    this.regsForm.push(this._fb.group({
      id: this._fb.group({type: [type,Validators.required]}),
      operateType: ["CREATE",Validators.required],
      info: this._fb.group({     
        regTo: [,Validators.required],
        level: [,Validators.required],
        levelNumber: ['',Validators.maxLength(32)]
      })
    }));
    this.calcJoinTypes();
  }

  onDeleteClick(type: JoinType):void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{width:'400px',role:'alertdialog',data:{title:'移除确认', description: '确认要移除此角色？' , result: type }});
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        if (this.corp){

        }else{
          for(let i = 0; i< this.regsForm.length; i++) {
            if (this.regsForm.value[i].id.type == result){
              this.regsForm.removeAt(i);
              this.calcJoinTypes();
            }
          }
        }
      }

    });
  }


  get joinTypeVaild(): boolean{
    if (this.corp){

    }
    return this.regsForm.length > 0 ;
  }

  get valid(): boolean{
    return this.businessForm.valid && this.joinTypeVaild;
  }

  onSubmit() {
    this._ngxService.start();
    console.warn(this.businessForm.value);
    this._service.patchCreateCorp(this.businessForm.value).pipe(catchError(err=>{
      this._ngxService.stop();
      this._toastr.error("请联系管理员或请稍后再试！","存储数据失败");
      return empty();
    })).subscribe(id => {
      this._ngxService.stop();
    });
  }

  ngOnInit(): void {
    this._route.data.subscribe(data => {
      
      this.corp = data.corp;
 
      this.businessForm = this._fb.group({
        applyTime: [Date.now()],
        regs: this._fb.array([])
      })


      if (!this.corp){
        this.businessForm.addControl('corpInfo' , this._fb.group({
          name: ['', [Validators.required,Validators.maxLength(128)]],
          groupIdType: ['', Validators.required],
          groupId: ['', [Validators.required,Validators.maxLength(128)]],
          ownerName: ['', [Validators.required, Validators.maxLength(32)]],
          ownerIdType: ['', Validators.required],
          ownerId: ['', [Validators.required, Validators.maxLength(32)]],
          address: ['',Validators.maxLength(256)],
          tel: ['',Validators.maxLength(16)],
        }));
      }

      this.calcJoinTypes();
      
    })
  }
  
}




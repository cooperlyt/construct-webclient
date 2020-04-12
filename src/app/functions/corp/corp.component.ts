
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Router, Params } from '@angular/router';



import { Component, OnInit } from '@angular/core';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';
import { SearchFunctionBase, SearchCondition, FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';


import { Corp, CorpInfo, CorpReg, CorpBusiness } from 'src/app/shared/data/corp';
import { DataUtilsService, JoinType } from 'src/app/shared/data/define';
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

  joinTypes:{id: string, name: string}[];

  oldJoinTypes: {type:string,level: number, number: string, limit: Date, del: boolean}[];

  removedTypes :Set<string> = new Set<string>();

  get regsForm(): FormArray{
    return this.businessForm.get('regs') as FormArray;
  }

  typeIsOld(type: string):boolean{
    return !!this.corp && !!this.corp.regs.find(reg => reg.id.type == type);
  }

  constructor(
    public dataUtils: DataUtilsService,
    public dialog: MatDialog,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _service: CorpService,
    private _ngxService: NgxUiLoaderService,
    private _toastr: ToastrService,
    _func: FunctionPageBar) {
    super(_route,_func);
  }

  private calcJoinTypes():void{

    if (this.corp){
      this.oldJoinTypes = this.corp.regs
        .filter(cr => (!this.businessForm.value.regs.find(reg => (reg.id.type == cr.id.type))))
        .map(reg => ({type: reg.id.type, level: reg.info.level, number: reg.info.levelNumber, limit: reg.info.regTo, del: !! this.removedTypes.has(reg.id.type)}));
    }
    this.joinTypes = Object.keys(JoinType).filter(key => {
      if (!this.corp){
        return !this.businessForm.value.regs.find(reg => reg.id.type == key)
      }else{
        return !this.businessForm.value.regs.find(reg => (reg.id.type == key)) 
          && !this.corp.regs.find(reg => (reg.id.type == key));
      }
    }).map(key => ({id: key, name: JoinType[key]}));
  }

  private addInfoForm(info? : CorpInfo){
    this.businessForm.addControl('corpInfo' , this._fb.group({
      name: [info ? info.name : null, [Validators.required,Validators.maxLength(128)]],
      groupIdType: [info ? info.groupIdType : null, Validators.required],
      groupId: [info ? info.groupId : null, [Validators.required,Validators.maxLength(128)]],
      ownerName: [info ? info.ownerName : null, [Validators.required, Validators.maxLength(32)]],
      ownerIdType: [info ? info.ownerIdType : null, Validators.required],
      ownerId: [info ? info.ownerId : null, [Validators.required, Validators.maxLength(32)]],
      address: [info ? info.address : null,Validators.maxLength(256)],
      tel: [info ? info.tel: null,Validators.maxLength(16)],
    }));
  }



  infoEdit():void{
    if (this.corp){
      this.addInfoForm(this.corp.info);
    }
  }

  cancelInfoEdit():void{
    if (this.corp){
      this.businessForm.removeControl("corpInfo");
    }
  }

  addJoinType(type: string):void{
    console.log(type);
    let oldReg: CorpReg = null;
    if (this.corp){
      oldReg = this.corp.regs.find(reg => reg.id.type == type)
    }

    this.regsForm.push(this._fb.group({
      id: this._fb.group({type: [type,Validators.required]}),
      operateType: [oldReg ? "MODIFY" : "CREATE",Validators.required],
      info: this._fb.group({     
        regTo: [oldReg ? oldReg.info.regTo : null,Validators.required],
        level: [oldReg ? oldReg.info.level : null,Validators.required],
        levelNumber: [oldReg ? oldReg.info.levelNumber : null ,Validators.maxLength(32)]
      })
    }));
    this.calcJoinTypes();
  }

  private removeType(type: string):void{
    for(let i = 0; i< this.regsForm.length; i++) {
      if (this.regsForm.value[i].id.type == type){
        this.regsForm.removeAt(i);
        break;
      }
    }
  }

  restoreType(type: string):void{
    this.removeType(type);
    this.removedTypes.delete(type);
    this.calcJoinTypes();
  }

  deleteType(type: string):void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{width:'400px',role:'alertdialog',data:{title:'移除确认', description: '确认要移除此角色？' , result: type }});
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.removeType(result);
        if (!!this.corp && !!this.corp.regs.find(reg => (reg.id.type == result))){
          this.removedTypes.add(result);
        }
        this.calcJoinTypes();
      }
    });
  }

  get joinTypeVaild(): boolean{
    if (this.corp){
      return !!this.corp.regs.find(reg => (!this.removedTypes.has(reg.id.type))) || this.regsForm.length > 0
    }else{
      return this.regsForm.length > 0 ;
    }
    
  }

  get valid(): boolean{
    return this.businessForm.valid && this.joinTypeVaild && (!this.corp || !!this.businessForm.value.corpInfo || (this.removedTypes.size > 0) || (this.regsForm.value.length > 0));
  }

  onSubmit() {
    this._ngxService.start();
    
    let business: CorpBusiness = this.businessForm.value;
 
    if (this.corp){
      this.removedTypes.forEach(key => business.regs.push({id: {type: key}, operateType: 'DELETE', info: this.corp.regs.find(reg => reg.id.type == key).info}));
      console.log(business);
    }else{
      this._service.patchCreateCorp(business).pipe(catchError(err=>{
        this._ngxService.stop();
        this._toastr.error("请联系管理员或请稍后再试！","存储数据失败");
        return empty();
      })).subscribe(id => {
        this._ngxService.stop();
      });
    }
    

  }

  ngOnInit(): void {
    this._route.data.subscribe(data => {
      
      this.corp = data.corp;
 
      this.businessForm = this._fb.group({
        applyTime: [Date.now()],
        regs: this._fb.array([])
      })


      if (!this.corp){
        this.addInfoForm();
      }

      this.calcJoinTypes();
      
    })
  }
  
}




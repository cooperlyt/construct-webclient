import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule, Router } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { Component, OnInit } from '@angular/core';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';
import { SearchFunctionBase, SearchCondition, FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';
import { CorpResolver } from './corp.resolver';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatSlideToggleModule, MatSlideToggleChange} from '@angular/material/slide-toggle';

import { Corp } from 'src/app/shared/data/corp';
import { GroupIdType, PersonIdType, ConstructJoinType } from 'src/app/shared/data/define';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModule } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CorpService } from './corp.service';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-main',
  templateUrl: './corp.component.html',
  styleUrls: ['./corp.component.scss']
})
export class CorpComponent extends SearchFunctionBase implements OnInit {
  doSearch(key: SearchCondition): void {
    throw new Error("Method not implemented.");
  }

  faRegistered = faRegistered;

  constructor(_route: ActivatedRoute,_func: FunctionPageBar) {
    super(_route,_func);
  }

  ngOnInit(): void {
  }
}


@Component({
  selector: 'corp-details',
  templateUrl: './corp-details.component.html'
})
export class CorpDetailsComponent extends PageFunctionBase implements OnInit{

  constructor(
    private _service: CorpService, 
    private _route: ActivatedRoute,
    private _router: Router,
    _func: FunctionPageBar){
    super(_route,_func);
  }

  corp:Corp;

  enable:boolean;

  statusWaiting: boolean = false;

  edit():void{
    this._router.navigate(['edit',{id: this.corp.corpCode}]);
  }

  enableToggleChange(){
    if (this.enable !== this.corp.enable){
      this.statusWaiting = true;
      this._service.changeCorpStatus(this.corp.corpCode,this.enable).subscribe(result => {
        if (this.corp.corpCode === result.code){
          if (result.enable === this.enable){
            this.corp.enable = result.enable;
            this.statusWaiting = false;
          }
        }
      })
    }
  }


  ngOnInit(): void {
    this._route.data.subscribe(data => {
      this.corp = data.corp;
      this.enable = data.corp.enable;
    })
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



  getJoinTypeLabel(type: ConstructJoinType){
    return ConstructJoinType[type]
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
    this.joinTypes = Object.keys(ConstructJoinType).filter(key => {
   
      if ((!this.corp ||  !this.corp.regs.find(reg => reg.id.type == key) )&&
        !this.businessForm.value.regs.find(reg => reg.id.type == key))
      return true;
    }).map(key => ({id: key, name: ConstructJoinType[key]}));
  }

  addJoinType(type: ConstructJoinType):void{
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

  onDeleteClick(type: ConstructJoinType):void{
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


const routes: Routes =[
  {path: '' , component: CorpComponent },
  {path: 'edit', component: CorpEditComponent},
  {path: 'edit/:id', component: CorpEditComponent, resolve: {corp: CorpResolver}},
  {path: 'details/:id', component: CorpDetailsComponent, resolve: {corp: CorpResolver}}
]

@NgModule({
  declarations: [CorpComponent,CorpEditComponent,CorpDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatMomentDateModule,
    NgxUiLoaderModule,
    ConfirmDialogModule,
    MatSlideToggleModule,
    RouterModule.forChild(routes)
  ]

})
export class CorpModule { }

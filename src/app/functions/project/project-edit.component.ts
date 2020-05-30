import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, NgModelGroup, FormGroupDirective, Validators, FormArray, FormControl } from '@angular/forms';
import { DataUtilsService } from 'src/app/shared/schemas/define';
import { ProjectRegInfo, BuildReg, JoinCorpReg, JoinCorp, Build, BuildInfo } from 'src/app/shared/schemas/project';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Corp, CorpReg } from 'src/app/shared/schemas/corp';
import { CorpService } from 'src/app/shared/remote-services/corp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/remote-services/project.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({selector:"project-info-input", 
  templateUrl: "./info-input.html", 
  viewProviders: [{provide: ControlContainer, useExisting: FormGroupDirective}] //NgModelGroup / NgForm / FormGroupDirective
})
export class ProjectInfoInputComponent implements OnInit{

  @Input()
  code:number;

  loading:boolean = false;

  form: FormGroup;

  constructor(private parent: FormGroupDirective,
    public dataUtils: DataUtilsService,
    private service: ProjectService,
    private _fb: FormBuilder){}

  ngOnInit(): void {

    if (this.code){
      this.loading = true;
      this.service.projectRegInfo(this.code).subscribe(
        projectInfo => this.createForm(projectInfo)
      )
    }else{
      this.createForm();
    }
    
  }

  
  private createForm(projectInfo?: ProjectRegInfo){
    this.parent.form.addControl('info', this.form);
    this.form = this._fb.group({
      property: [projectInfo ? projectInfo.property: null, Validators.required ],
      name:[projectInfo ? projectInfo.name : null , [Validators.required,Validators.maxLength(256)]],
      address:[projectInfo ? projectInfo.address : null , Validators.maxLength(512)],
      type: [projectInfo ? projectInfo.type : null , Validators.required],
      typeLevel: [projectInfo ? projectInfo.typeLevel : null],
      landArea: [projectInfo ? projectInfo.landArea : null],
      beginDate: [projectInfo ? projectInfo.beginDate : null],
      completeDate: [projectInfo ? projectInfo.completeDate : null],
      tender:[projectInfo ? projectInfo.tender : null, Validators.maxLength(32)],
      costs:[projectInfo ? projectInfo.costs : null],
      importantType:[projectInfo ? projectInfo.importantType: null, Validators.required],
      importantFile:[projectInfo ? projectInfo.importantFile : null ],

    })
    this.loading = false;
  }

  

}

@Component({selector: "project-corp-input",
  templateUrl: "./corp-input.html",
  viewProviders: [{provide: ControlContainer, useExisting: FormGroupDirective}]
})
export class ProjectCorpInputComponent implements OnInit{

  @Input()
  code: number;

  loading: boolean = false;

  //form: FormGroup;

  selectCorp: Corp;
  
  editCorps:{corp: Corp, reg: CorpReg}[] = []

  selectReg: CorpReg ;

  public corpCtl: FormControl = new FormControl();

  corpsForm :FormArray;

  get existsDeveloper(): boolean{
    return !!this.editCorps.find(element => element.reg.property === 'Developer')
  }

  get newCorpValid():boolean{

    if (this.selectCorp && this.selectReg){
        return !this.editCorps.find(element  => ((element.corp.code === this.selectCorp.code) && (element.reg.property === this.selectReg.property)));
    }else{
        return false;
    }
}

  constructor(private parent: FormGroupDirective,
    public dataUtils: DataUtilsService,
    public dialog: MatDialog,
    private _projectService: ProjectService,
    private _corpService: CorpService,
    private _fb: FormBuilder){}

  ngOnInit(): void {

    this.corpsForm = this._fb.array([]);


    this.parent.form.addControl('corp', this._fb.group({
      corps: this.corpsForm
    }));

    
    if (this.code){
      this.loading = true;
      this._projectService.joinCorpAndRegs(this.code).subscribe(
        data => data.forEach(item => {
          this.editCorps.push({corp: item.corp ,reg: {property: item.joinCorp.property, info: item.corp.regs.find(i => i.property === item.joinCorp.property).info} });
          this.pushCorp(item.joinCorp);
          this.loading = false;
        })
      )
    }

    this.corpCtl.valueChanges.subscribe(value => {
      console.log("search corp by" + value);
      if (value){
          if (!this.selectCorp || this.selectCorp.code !== value){
              this.selectCorp = null;
              this.selectReg = null;
              console.log("search corp by" + value);
              this._corpService.corp(value).subscribe(corp => {
                  this.selectCorp = corp;
                  if (corp.regs.length == 1){
                      this.selectReg = corp.regs[0];
                  }
              });
          }
      }else{
          this.selectCorp = null;
          this.selectReg = null;
      }
      
  })
  }

  private pushCorp(joinCorp: JoinCorp){
    this.corpsForm.push(
        this._fb.group({
            property: [joinCorp.property,Validators.required],
            outsideTeamFile: [joinCorp.outsideTeamFile, Validators.maxLength(32)],
            outLevel: [joinCorp.outLevel],
            outLevelFile:[joinCorp.outLevelFile, Validators.maxLength(32)],
            code:[joinCorp.code, Validators.required],
            contacts:[joinCorp.contacts, Validators.maxLength(64)],
            tel:[joinCorp.tel, Validators.maxLength(16)]
        })
    );
  }

  delCorp(i:number){


    const dialogRef = this.dialog.open(ConfirmDialogComponent,{width:'400px',role:'alertdialog',data:{title:'移除确认', description: '确认要移除此参建单位？' , result: i }});
    dialogRef.afterClosed().subscribe(result => {
      if (result >= 0){
        this.corpsForm.removeAt(result);
        this.editCorps.splice(result,1);
      }
    });
  }

  outLevelCheckChange(i: number){

    if (!this.corpsForm.controls[i].value.outLevel) {
        this.corpsForm.controls[i].get('outLevelFile').setValue(null);
        this.corpsForm.controls[i].get('outLevelFile').disable();
    }else{
        this.corpsForm.controls[i].get('outLevelFile').enable();
    }
  }

  addNewCorp(){
    this.editCorps.push({corp:this.selectCorp, reg: this.selectReg});

    this.corpsForm.push(this._fb.group({
        property: [this.selectReg.property,Validators.required],
        outsideTeamFile: [, Validators.maxLength(32)],
        outLevel: [false],
        outLevelFile:[{value: null, disabled: true}, Validators.maxLength(32)],
        code:[this.selectCorp.code, Validators.required],
        contacts:[, Validators.maxLength(64)],
        tel:[this.selectCorp.info.tel, Validators.maxLength(16)]
    }));


    this.selectReg = null;
    this.selectCorp = null;
    this.corpCtl.setValue(null);
  }


}


@Component({selector: "patch-create-project",
  templateUrl:"./create-project.html"
})
export class CreateProjectComponent extends PageFunctionBase implements OnInit{


  regForm: FormGroup;

  builds: BuildInfo[] = [];

  loading:boolean = false;

  buildForm: FormArray;

  constructor(
      public dialog: MatDialog,
      public dataUtils: DataUtilsService,
      private _route: ActivatedRoute,
      private _router: Router,
      private _fb: FormBuilder,

      private service:ProjectService,
      private _uiLoader: NgxUiLoaderService,
      private _toastr: ToastrService,
      _func: FunctionPageBar){
          super(_route,_func);

  }

  onSubmit(){
    console.log(this.regForm.value);
    this._uiLoader.start();
    this.service.patchProject(this.regForm.value).pipe(
      catchError(err=>{
        this._uiLoader.stop();
        this._toastr.error("请联系管理员或请稍后再试！","存储数据失败");
        return empty();
      })).subscribe(code => {
        this._router.navigate(['../','details',code,'info'],{relativeTo: this._route});
        // this._router.navigate([this.project ? '../../' : '../','details',code,'info'],{relativeTo: this._route});
    });
  }

  ngOnInit(): void {
    this.regForm = this._fb.group({
    });
  }

  get existsDeveloper(): boolean{
    return !!this.regForm.value.corp.corps.find(element => element.reg.property === 'Developer');
  }

}


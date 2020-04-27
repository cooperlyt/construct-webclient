import { Component, OnInit } from '@angular/core';
import { SearchFunctionBase, FunctionPageBar, PageFunctionBase, TocPageFunctionBase } from 'src/app/shared/function-items/function-items';
import { PageResult } from 'src/app/shared/page-result';
import { Project, JoinCorp } from 'src/app/shared/data/project';
import { DataUtilsService, JoinType } from 'src/app/shared/data/define';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CorpService } from 'src/app/shared/remote-services/corp.service';
import { Corp, CorpReg } from 'src/app/shared/data/corp';
import { ProjectService } from 'src/app/shared/remote-services/project.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';


@Component({selector: "project-search",templateUrl:"./project.html",styleUrls:["./project.scss"]})
export class ProjectComponent extends SearchFunctionBase implements OnInit{

    dataPage: PageResult<Project>;

    faProjectDiagram = faProjectDiagram;

    params: {showDisabled : boolean, property: string , projectClass: string};

    constructor(
        public dataUtil: DataUtilsService,
        private _router: Router,
        private _route: ActivatedRoute,
        _func: FunctionPageBar) {
        super(_route,_func);
      }

    doSearch(condition: import("../../shared/function-items/function-items").SearchCondition): void {
        if (condition.now){
            let params: Params = {page:0};
            params['key'] = condition.key;
            this._router.navigate([],{relativeTo: this._route, queryParams: params, queryParamsHandling: 'merge' })
        }
    }

    onPropertyChange(property: string){
   
        if (!property || property === '' ){
    
          this._router.navigate([],{relativeTo: this._route,queryParams: {page:0,property: null}, queryParamsHandling: 'merge'})
        }else if (property !== this.params.property){
          this._router.navigate([],{relativeTo: this._route,queryParams: {page:0,property: property}, queryParamsHandling: 'merge'})
        }
    }

    onClassChange(projectClass: string){
        if (!projectClass || projectClass === '' || projectClass === this.params.projectClass){
            this._router.navigate([],{relativeTo: this._route,queryParams: {page:0,class: null}, queryParamsHandling: 'merge'})
          }else{
            this._router.navigate([],{relativeTo: this._route,queryParams: {page:0,class: projectClass}, queryParamsHandling: 'merge'})
          }
    }
    
    onPageChange(pageEvent: PageEvent){
    
        if ((pageEvent.pageIndex) !== this.dataPage.number){
    
          this._router.navigate([], {relativeTo: this._route, queryParams: {page: pageEvent.pageIndex} ,queryParamsHandling: 'merge'});
        }
    }

    onShowDisabledChange(){
        this._router.navigate([],{relativeTo: this._route,queryParams: {page:0, valid: !this.params.showDisabled}, queryParamsHandling: 'merge'})
    }

    ngOnInit(): void {
        this._route.data.subscribe(data => this.dataPage = data.projects);
        this._route.queryParamMap.subscribe(params => this.params = {showDisabled: JSON.parse(params.get('valid')) ,property : params.get('property'), projectClass: params.get('class')})
    }

}

@Component({selector:"project-edit", templateUrl:"./edit.html", styleUrls:["./edit.scss"]})
export class ProjectEditComponent extends PageFunctionBase implements OnInit{


    public corpCtl: FormControl = new FormControl();


    project: Project;

    regForm: FormGroup;

    selectCorp: Corp;

    selectReg: CorpReg ;

    editCorps:{corp: Corp, reg: CorpReg}[] = []

    currentSection = 'base-info';

    onSectionChange(sectionId: string) {
      this.currentSection = sectionId;
    }
  
    scrollTo(section) {
      document.querySelector('#' + section)
      .scrollIntoView();
    }

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

    get corpsForm():FormArray{
        return this.regForm.get("corp").get("corps") as FormArray;
    }

    constructor(
        public dataUtils: DataUtilsService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _fb: FormBuilder,
        private _corpService: CorpService,
        private service:ProjectService,
        private _ngxService: NgxUiLoaderService,
        private _toastr: ToastrService,
        _func: FunctionPageBar){
            super(_route,_func);

    }

    onSubmit(){
        this._ngxService.start();
        this.service.patchProject(this.regForm.value).pipe(catchError(err=>{
            //this._ngxService.stop();
            this._toastr.error("请联系管理员或请稍后再试！","存储数据失败");
            return empty();
          })).subscribe(code => {
            this._ngxService.stop();
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

    ngOnInit(): void {

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


        this._route.data.subscribe(data => {
      
            this.project = data.project;
       
            this.regForm = this._fb.group({
              applyTime: [Date.now()]
            })
      
      
            if (!this.project){
              this.addInfoForm();

              this.regForm.addControl('corp', this._fb.group({
                    corps: this._fb.array([])
                }));
            }
      
            
          })
        
    }

    private addInfoForm(){
        this.regForm.addControl('info', this._fb.group({
            info: this._fb.group({
                name:[this.project ? this.project.info.info.name : '' , [Validators.required,Validators.maxLength(256)]],
                address:[this.project ? this.project.info.info.address : '' , Validators.maxLength(512)],
                type: [this.project ? this.project.info.info.type : null , Validators.required],
                typeLevel: [this.project ? this.project.info.info.typeLevel : null],
                floorType: [this.project ? this.project.info.info.floorType : null],
                property: [this.project ? this.project.info.info.property: null, Validators.required ],
                area: [this.project ? this.project.info.info.area: null],
                landArea: [this.project ? this.project.info.info.landArea : null],
                groundCount: [this.project ? this.project.info.info.groundCount : null],
                underCount: [this.project ? this.project.info.info.underCount : null],
                beginDate: [this.project ? this.project.info.info.beginDate : null],
                completeDate: [this.project ? this.project.info.info.completeDate : null],
                tender:[this.project ? this.project.info.info.tender : null, Validators.maxLength(32)],
                structure: [this.project ? this.project.info.info.structure: null],
                costs:[this.project ? this.project.info.info.costs : null],
                importantType:[this.project ? this.project.info.info.importantType: null, Validators.required],
                importantFile:[this.project ? this.project.info.info.importantFile : null ],
                memo:[this.project ? this.project.info.info : null],
                height:[this.project ? this.project.info.info.height : null]
            })
        })) 
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

    //private addCorpForm(){
        // let corpsForm: FormArray = this._fb.array([]);
        // if (this.project){
        //     this.project.corp.corps.forEach(corp => {
        //         corpsForm.push()
        //     })
        // }

    //}
}
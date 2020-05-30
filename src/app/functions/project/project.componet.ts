import { Component, OnInit } from '@angular/core';
import { SearchFunctionBase, FunctionPageBar, PageFunctionBase, TocPageFunctionBase } from 'src/app/shared/function-items/function-items';
import { PageResult } from 'src/app/shared/page-result';
import { Project } from 'src/app/shared/schemas/project';
import { DataUtilsService } from 'src/app/shared/schemas/define';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ProjectService } from 'src/app/shared/remote-services/project.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';


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
        this._route.data.pipe(catchError(err => {console.log(err); return empty})).subscribe(data => this.dataPage = data.projects);
        this._route.queryParamMap.subscribe(params => this.params = {showDisabled: JSON.parse(params.get('valid')) ,property : params.get('property'), projectClass: params.get('class')})
    }

}

@Component({selector:"project-edit", templateUrl:"./edit.html", styleUrls:["./edit.scss"]})
export class ProjectEditComponent extends PageFunctionBase implements OnInit{

    project: Project;

    regForm: FormGroup;

    currentSection = 'base-info';

    onSectionChange(sectionId: string) {
      this.currentSection = sectionId;
    }
  
    scrollTo(section) {
      document.querySelector('#' + section)
      .scrollIntoView();
    }

    constructor(
        public dialog: MatDialog,
        public dataUtils: DataUtilsService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _fb: FormBuilder,

        private service:ProjectService,
        private _ngxService: NgxUiLoaderService,
        private _toastr: ToastrService,
        _func: FunctionPageBar){
            super(_route,_func);

    }

    onSubmit(){
        console.log(this.regForm.value);
        this._ngxService.start();
        this.service.patchProject(this.regForm.value, this.project ? this.project.code : null).pipe(catchError(err=>{
            this._ngxService.stop();
            this._toastr.error("请联系管理员或请稍后再试！","存储数据失败");
            return empty();
          })).subscribe(code => {
            this._router.navigate([this.project ? '../../' : '../','details',code,'info'],{relativeTo: this._route});
        });
    }

    ngOnInit(): void {




        // this._route.data.subscribe(data => {
        //     this.regForm = this._fb.group({
        //       applyTime: [Date.now()]
        //     })
     
        //     this.regForm.addControl('corp', this._fb.group({
        //         corps: this._fb.array([])
        //     }));

        //     if (data.project){
        //         this.project = data.project.project;

        //         this.project.corps.forEach(joinCorp => {
        //             const corp: Corp = data.project.corps.find(corp => (corp.code === joinCorp.code))
        //             if (corp && corp.enable){
        //                 const reg = corp.regs.find(r => (r.property == joinCorp.property));
        //                 if (reg){
        //                     console.log('push :' + corp.code )
        //                     this.editCorps.push({corp: corp, reg: reg});
        //                     this.pushCorp(joinCorp);
        //                 }
        //             }
        //         });  
        //     }

        //     this.addInfoForm();

        //   })
        
    }

    // ngAfterContentChecked(){

    //     if (this.regForm.get('info')){
    //         this.regForm.get('info').get('info').get('property').valueChanges.subscribe(value => {
    //             if (value != 'MODIFY'){
    //                 this.regForm.disabled
    //                 this.regForm.get('info').get('info').get('modifyType').setValue(null);
    //                 this.regForm.get('info').get('info').get('modifyType')['disable']();
    //             }else{
    //                 this.regForm.get('info').get('info').get('modifyType')['enable']();
    //             }
    //         })
    //     }

    // }
    // area: [this.project ? this.project.info.info.area: null],
    // groundCount: [this.project ? this.project.info.upCount : null],
    // underCount: [this.project ? this.project.info.info.underCount : null],
    // structure: [this.project ? this.project.info.structure: null],
    // height:[this.project ? this.project.info.info.height : null]

    private addInfoForm(){
        this.regForm.addControl('info', this._fb.group({

                name:[this.project ? this.project.info.name : '' , [Validators.required,Validators.maxLength(256)]],
                address:[this.project ? this.project.info.address : '' , Validators.maxLength(512)],
                type: [this.project ? this.project.info.type : null , Validators.required],
                typeLevel: [this.project ? this.project.info.typeLevel : null],
                property: [this.project ? this.project.info.property: null, Validators.required ],
                landArea: [this.project ? this.project.info.landArea : null],
                beginDate: [this.project ? this.project.info.beginDate : null],
                completeDate: [this.project ? this.project.info.completeDate : null],
                tender:[this.project ? this.project.info.tender : null, Validators.maxLength(32)],
                costs:[this.project ? this.project.info.costs : null],
                importantType:[this.project ? this.project.info.importantType: null, Validators.required],
                importantFile:[this.project ? this.project.info.importantFile : null ],

        }));

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
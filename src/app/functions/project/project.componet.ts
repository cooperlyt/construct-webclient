import { Component, OnInit } from '@angular/core';
import { SearchFunctionBase, FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';
import { PageResult } from 'src/app/shared/page-result';
import { Project } from 'src/app/shared/data/project';
import { DataUtilsService } from 'src/app/shared/data/define';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';


@Component({selector: "project-search",templateUrl:"./project.html",styleUrls:["./project.scss"]})
export class ProjectComponent extends SearchFunctionBase implements OnInit{

    dataPage: PageResult<Project>;

    params: {showDisabled : boolean, type: string};

    constructor(
        public dataUtil: DataUtilsService,
        private _router: Router,
        private _route: ActivatedRoute,
        _func: FunctionPageBar) {
        super(_route,_func);
      }

    doSearch(key: import("../../shared/function-items/function-items").SearchCondition): void {
        
    }

    onShowDisabledChange(){

    }

    ngOnInit(): void {
        this._route.queryParamMap.subscribe(params => this.params = {showDisabled: JSON.parse(params.get('valid')) ,type : params.get('type')})
    }

}

@Component({selector:"project-edit", templateUrl:"./edit.html", styleUrls:["./edit.scss"]})
export class ProjectEditComponent extends PageFunctionBase implements OnInit{


    public corpCtl: FormControl = new FormControl();

    project: Project;

    regForm: FormGroup;

    constructor(
        public dataUtils: DataUtilsService,
        private _route: ActivatedRoute,
        private _fb: FormBuilder,
        _func: FunctionPageBar){
            super(_route,_func);

    }

    onSubmit(){

    }

    ngOnInit(): void {

        this._route.data.subscribe(data => {
      
            this.project = data.project;
       
            this.regForm = this._fb.group({
              applyTime: [Date.now()]
            })
      
      
            if (!this.project){
              this.addInfoForm();
              this.addCorpForm();
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

    private addCorpForm(){
        let corpsForm: FormArray = this._fb.array([]);
        if (this.project){
            this.project.corp.corps.forEach(corp => {
                corpsForm.push(this._fb.group({
                    property: [corp.property,Validators.required],
                    outsideTeamFile: [corp.outsideTeamFile, Validators.maxLength(32)],
                    outLevel: [corp.outLevel],
                    outLevelFile:[corp.outLevelFile, Validators.maxLength(32)],
                    code:[corp.code, Validators.required],
                    contacts:[corp.contacts, Validators.maxLength(64)],
                    tel:[corp.tel, Validators.maxLength(16)]

                }))
            })
        }

        this.regForm.addControl('corp', this._fb.group({
            corps: corpsForm
        }));
    }
}
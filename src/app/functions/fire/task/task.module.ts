import { NgModule, Component, OnInit, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRoute, Router } from '@angular/router';
import { FireTaskViewComponent, FireCheckProjectInfoComponent, FireCheckDocumentComponent, FireTaskCompletedComponent } from './task-view.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ConfirmDialogModule } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OcticonModule } from 'src/app/tools/octicon/octicon.directive';
import { SharedDataModule } from 'src/app/shared/schemas/data.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { FireCheckSchemasModule, FireCheck, CheckFile, CheckBuildOpinion } from '../schemas';
import { BusinessDocumentModule } from 'src/app/business/document/document-files.component';
import { BusinessKeyTasksResolver } from 'src/app/business/tasks/business-key-tasks.resolver';
import { FireCheckResolver } from '../fire-check.resolver';
import { FireCheckInfoModule } from '../info.module';
import { Task, BusinessDocumentBase, BusinessDocument, Variables } from 'src/app/business/schemas';
import { CamundaRestService } from 'src/app/business/camunda-rest.service';
import { switchMap, map } from 'rxjs/operators';
import { FireCheckService } from '../fire-check.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { StateCheckboxModule } from 'src/app/tools/status-checkbox/status-checkbox';



export declare class FireCheckTask{
  task: Task;
  check: FireCheck;
}

@Injectable({providedIn: 'root'})
export class FireCheckTaskResolver implements Resolve<FireCheckTask>{

  constructor(private camundaService: CamundaRestService, 
      private checkService: FireCheckService){}

  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): FireCheckTask | import("rxjs").Observable<FireCheckTask> | Promise<FireCheckTask> {
    return this.camundaService.getTask(route.params['tid']).pipe(
      switchMap(task => 
        this.camundaService.getProcessInstance(task.processInstanceId).pipe(
          switchMap(processInstance => this.checkService.fireCheck(Number(processInstance.businessKey)).pipe(
            map(check => {return {task: task, check: check}})
            )
          )
        )
      )
    )
  }

}

@Injectable({providedIn: 'root'})
export class BusinessDocumentResolver implements Resolve<string[]>{

  constructor(private camundaService: CamundaRestService){}

  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): string[] | import("rxjs").Observable<string[]> | Promise<string[]> {
    return this.camundaService.getTask(route.params['tid']).pipe(
      switchMap(task => this.camundaService.getProcessInstance(task.processInstanceId)),
      switchMap(processInstance  => this.camundaService.getBusinessDocuments(Number(processInstance.businessKey))),
      map(documents => documents.map(doc => doc.name))
    );
  }



}

@Component({
  selector: 'fire-apply-task-complete',
  templateUrl: './apply-task.html'
})
export class FireApplyTaskComponent implements OnInit{

  fireCheckTask: FireCheckTask;

  form: FormGroup;

  get itemForm(): FormArray{
    return this.form.get('files') as FormArray;
  }

  constructor(private _route: ActivatedRoute, 
    private _router: Router,
    private _fb: FormBuilder,
    private _checkSvr: FireCheckService,
    private _camundaSvr: CamundaRestService){}

  ngOnInit(): void {
    this._route.data.subscribe(data => {
      this.fireCheckTask = data.data;
      this.form = this._fb.group({
        files: this._fb.array(data.items.map(item => this._fb.group({
          pass: [true],
          name: [item]
        })))
      });
    });
  }

  addItem(name: string){
    this.itemForm.push(this._fb.group({
      pass:[true],
      name:[name]
    }))
  }

  get valid():boolean{
    return !this.itemForm.value.find(item => (item.pass !== null) && !item.pass)
  }

  complete(){

    console.log(this.itemForm.value.filter(item => item.pass !== null));

    let variables = new Variables();
    variables.putVariable('approved',{value:this.valid})

    this._checkSvr.fileCheck(this.fireCheckTask.check.id,this.itemForm.value.filter(item => item.pass !== null)).pipe(
      switchMap(() => this._camundaSvr.postCompleteTask(this.fireCheckTask.task.id,variables))
    ).subscribe(() => {
      this._router.navigate(['/task/fire/completed',this.fireCheckTask.check.id])
    })
  }


}

@Component({
  selector: 'fire-opinion-task-complete',
  templateUrl: './opinion-task.html'
})
export class FireOpinionTaskComponent implements OnInit{

  fireCheckTask: FireCheckTask;

  get opinionForm(): FormArray{
    return this.form.get('opinion') as FormArray;
  }
  form: FormGroup;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _camundaSvr: CamundaRestService,
    private _checkSvr: FireCheckService,
    private _fb: FormBuilder){}

  ngOnInit(): void {
    this._route.data.subscribe(data => {
      this.fireCheckTask = data.data;
      this.form = this._fb.group({
        opinion: this._fb.array(
          this.fireCheckTask.check.info.builds.map(build => this._fb.group({
            code: [build.code],
            name: [build.info.name],
            opinion: [,Validators.required],
            pass: [,Validators.required]
          }))
        )
      });
    });
  }

  get valid():boolean{
    return !this.opinionForm.value.find(item => !item.pass)
  }

  complete(){
    let variables = new Variables();
    variables.putVariable('approved',{value:this.valid})

    this._checkSvr.buildOpinion(this.fireCheckTask.check.id,this.opinionForm.value).pipe(
      switchMap(() => this._camundaSvr.postCompleteTask(this.fireCheckTask.task.id,variables))
    ).subscribe(() => {
      this._router.navigate(['/task/fire/completed',this.fireCheckTask.check.id])
    })
  }
}

const routes: Routes =[
  {path : 'completed/:id' , component: FireTaskCompletedComponent, resolve:{tasks: BusinessKeyTasksResolver, check: FireCheckResolver}},
  {path: 'view/:tid' , component: FireTaskViewComponent, children:[
    {path:'', component: FireCheckProjectInfoComponent},
    {path:'document', component: FireCheckDocumentComponent}
  ]},
  {
    path: 'apply/:tid',  component: FireApplyTaskComponent, resolve: {data: FireCheckTaskResolver, items: BusinessDocumentResolver}
  },
  {
    path: 'opinion/:tid', component: FireOpinionTaskComponent, resolve: {data: FireCheckTaskResolver}
  }
]


@NgModule({
  declarations:[
    FireTaskViewComponent, 
    FireCheckProjectInfoComponent,
    FireCheckDocumentComponent,
    FireTaskCompletedComponent,
    FireApplyTaskComponent,
    FireOpinionTaskComponent,
    
  ],
  imports:[
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
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
    MatPaginatorModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    NgxUiLoaderModule,
    ConfirmDialogModule,
    MatSlideToggleModule,
    OcticonModule,
    MatExpansionModule,
    SharedDataModule,
    FireCheckSchemasModule,
    BusinessDocumentModule,
    FireCheckInfoModule,
    MatDividerModule,
    MatListModule,
    StateCheckboxModule
  ]
})
export class FireTaskModule {}

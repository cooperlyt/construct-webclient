
import { NgModule, Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { TasksComponent } from './tasks/tasks.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
import { ConfirmDialogModule } from '../shared/confirm-dialog/confirm-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OcticonModule } from '../tools/octicon/octicon.directive';
import { Routes, RouterModule } from '@angular/router';
import { RelativeTimeModule } from '../tools/pipe/relative-time.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import { TaskCheckDialog, TaskCompleteDialog } from './tasks/task-router.service';
import { SafeHtmlModule } from '../tools/pipe/safe-html.pipe';
import { CamundaRestService } from './camunda-rest.service';
import { BusinessOperation } from './schemas';

enum OperationType{
  TASK = '处理业务',
  CREATE = "建立业务",
  PASS = "通过",
  REJECT = "驳回",
  ABORT = "中止",
  SUSPEND = "挂起",
  RESUME ="恢复"
}

@Pipe({name: "businessOperationLabel"})
export class ProjectPropertyLabelPipe implements PipeTransform{
    transform(value: string) {
        return OperationType[value];
    }
}

@Component({
  selector: 'business-operations-list',
  template: `
    <mat-list >
      <mat-list-item *ngFor="let op of operstions">
        <mat-icon *ngIf="op.type == 'TASK'" octicon="commit"></mat-icon>
        <mat-icon *ngIf="op.type == 'CREATE'" octicon="play"></mat-icon>
        <mat-icon *ngIf="op.type == 'PASS'" octicon="check"></mat-icon>
        <mat-icon *ngIf="op.type == 'REJECT'" octicon="replay"></mat-icon>
        <mat-icon *ngIf="op.type == 'ABORT'" octicon="square"></mat-icon>
        <mat-icon *ngIf="op.type == 'SUSPEND'" octicon="tab"></mat-icon>
        <mat-icon *ngIf="op.type == 'RESUME'" octicon="paper-airplane"></mat-icon>


        <div mat-line *ngIf="op.type == 'TASK'"> {{op.taskName}} </div>
        <div mat-line *ngIf="op.type != 'TASK'"> {{op.type | businessOperationLabel }} </div>
        <div mat-line> </div>
      </mat-list-item>
    
    </mat-list>
  `
})
export class BusinessOperationsComponent implements OnInit{

  @Input()
  id:number;

  operstions: BusinessOperation[];

  constructor(private _service: CamundaRestService){}

  ngOnInit(): void {
    this._service.businessOperations(this.id).subscribe(res => this.operstions = res);
  }

}


const routes: Routes =[
  {path: 'tasks' , component: TasksComponent,runGuardsAndResolvers: 'paramsOrQueryParamsChange'},
]

@NgModule({
  declarations:[TasksComponent,TaskCompleteDialog,TaskCheckDialog,BusinessOperationsComponent,ProjectPropertyLabelPipe],
  imports:[
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
    MatPaginatorModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    MatTableModule,
    MatListModule,
    MatProgressSpinnerModule,
    NgxUiLoaderModule,
    ConfirmDialogModule,
    MatSlideToggleModule,
    OcticonModule,
    MatDialogModule,
    RouterModule.forChild(routes),
    RelativeTimeModule,
    SafeHtmlModule
  ],
  entryComponents:[TaskCompleteDialog,TaskCheckDialog],
  exports: [ProjectPropertyLabelPipe]
})
export class BusinessModule{

}
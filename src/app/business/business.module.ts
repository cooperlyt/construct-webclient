
import { NgModule } from '@angular/core';
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
import { TaskCheckDialog, TaskCompleteDialog } from './tasks/task-router.service';
import { SafeHtmlModule } from '../tools/pipe/safe-html.pipe';


const routes: Routes =[
  {path: 'tasks' , component: TasksComponent,runGuardsAndResolvers: 'paramsOrQueryParamsChange'},
]

@NgModule({
  declarations:[TasksComponent,TaskCompleteDialog,TaskCheckDialog],
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
  entryComponents:[TaskCompleteDialog,TaskCheckDialog]
})
export class BusinessModule{

}
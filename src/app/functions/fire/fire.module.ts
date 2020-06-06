import { NgModule } from '@angular/core';
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
import { ConfirmDialogModule } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OcticonModule } from 'src/app/tools/octicon/octicon.directive';
import { RouterModule, Routes } from '@angular/router';
import { SharedDataModule } from 'src/app/shared/schemas/data.module';
import { FireCheckCreateComponent, FireCheckCreatedComponent } from './create.component';
import { ProjectResolver } from 'src/app/shared/resolver/project.resolver';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BusinessKeyTasksResolver } from 'src/app/business/tasks/business-key-tasks.resolver';
import { FireCheckResolver } from './fire-check.resolver';
import { FireCheckSchemasModule } from './schemas';




const routes: Routes =[
  {path: 'create/:pid' , component: FireCheckCreateComponent, resolve:{project: ProjectResolver}},
  {path: 'created/:id', component: FireCheckCreatedComponent, resolve:{tasks: BusinessKeyTasksResolver, check: FireCheckResolver}}
]

@NgModule({
  declarations:[FireCheckCreateComponent,FireCheckCreatedComponent],
  imports:[
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
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
    RouterModule.forChild(routes),
    SharedDataModule,
    FireCheckSchemasModule
  ]
})
export class FireModule{

}
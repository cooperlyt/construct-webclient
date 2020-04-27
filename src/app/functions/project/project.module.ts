import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent, ProjectEditComponent } from './project.componet';
import { ProjectResolver } from './project.resolver';
import { ProjectDetailsComponent, ProjectInfoComponent, ProjectBusinessComponent } from './project-details.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { CorpSelectModule } from 'src/app/shared/corp-select/corp-select.component';
import { SharedDataModule } from 'src/app/shared/data/data.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ProjectSearchResolver } from './project-search.resolver';

const routes:Routes = [
    {path: "", component: ProjectComponent,runGuardsAndResolvers: 'paramsOrQueryParamsChange', resolve: {projects: ProjectSearchResolver}},
    {path: "edit", component: ProjectEditComponent},
    {path: "edit/:id", component: ProjectEditComponent, resolve: {project: ProjectResolver}},
    {path: "details/:id",component: ProjectDetailsComponent,children:[
        {path: "info", component: ProjectInfoComponent, resolve: {project: ProjectResolver}},
        {path: "business", component: ProjectBusinessComponent}
    ]}
]

@NgModule({declarations:[
    ProjectComponent,
    ProjectEditComponent,
    ProjectDetailsComponent,
    ProjectInfoComponent,
    ProjectBusinessComponent
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
    SharedDataModule,
    CorpSelectModule]
})
export class ProjectModule{}
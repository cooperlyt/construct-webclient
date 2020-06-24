import { NgModule, Component, OnInit, Input } from '@angular/core';
import { FireCheck, FireCheckSchemasModule } from './schemas';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ConfirmDialogModule } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OcticonModule } from 'src/app/tools/octicon/octicon.directive';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedDataModule } from 'src/app/shared/schemas/data.module';
import { BusinessDocumentModule } from 'src/app/business/document/document-files.component';
import { faUserTie, faPhone } from '@fortawesome/free-solid-svg-icons';

@Component({selector:'fire-check-info',templateUrl:'./fire-check-info.html'})
export class FireCheckInfoComponent{

  faUserTie = faUserTie;
  faPhone = faPhone;
  
  @Input()
  fireCheck: FireCheck;


}

@NgModule({
  declarations:[FireCheckInfoComponent],
  imports:[
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
    BusinessDocumentModule
  ],
  exports:[
    FireCheckInfoComponent
  ]
})
export class FireCheckInfoModule{

}
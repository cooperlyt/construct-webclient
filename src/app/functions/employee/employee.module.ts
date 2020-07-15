import { NgModule, OnInit, Component, Injectable, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Params } from '@angular/router';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'
import { SearchCondition, SearchFunctionBase, FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CustomEncoder } from 'src/app/shared/custom-encoder';
import {MatTableModule} from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AsyncValidator, AbstractControl, NG_VALIDATORS, AsyncValidatorFn, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { map, catchError, switchMap, take, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule, MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule, MatCheckboxChange} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import { ConfirmDialogModule, ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';




@Component({
  selector: 'app-main',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit {



  url = `${environment.keycloakConfig.url}/admin/${environment.keycloakConfig.realm}/console`

  constructor(
    _func: FunctionPageBar) {
      _func.loadTitle("用户管理")
  }

  ngOnInit(): void {

  }


}



const routes: Routes = [ 
  {path : '', component : EmployeeComponent},
  
];

@NgModule({
  declarations: [EmployeeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatListModule,
    NgxUiLoaderModule,
    ConfirmDialogModule,
    RouterModule.forChild(routes)
  ]
})
export class EmployeeModule { }

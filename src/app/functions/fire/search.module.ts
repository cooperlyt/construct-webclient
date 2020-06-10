import { OnInit, Component, NgModule, Injectable } from '@angular/core';
import { NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { FireCheckSchemasModule, FireCheck, DataDefine } from './schemas';
import { Routes, RouterModule, Resolve, ActivatedRoute, Params, Router } from '@angular/router';
import { PageResult } from 'src/app/shared/page-result';
import { FireCheckService } from './fire-check.service';
import { SearchFunctionBase, FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { FireCheckResolver } from './fire-check.resolver';
import { FireCheckInfoModule } from './info.module';
import { BusinessDocumentModule } from 'src/app/business/document/document-files.component';

@Injectable({providedIn: 'root'})
export class FireCheckSearchResolver implements Resolve<PageResult<FireCheck>>{

    constructor(private _service: FireCheckService){}

    resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): PageResult<FireCheck> | import("rxjs").Observable<PageResult<FireCheck>> | Promise<PageResult<FireCheck>> {
        const page = route.queryParams["page"] || 0;
        const key = route.queryParams['key'] || '';
        const status = route.queryParams['status'];
        return this._service.search(page,key,status);
    }
    
}

@Component({templateUrl:'./search.html'})
export class FireCheckSearchComponent extends SearchFunctionBase implements OnInit{


  doSearch(key: import("../../shared/function-items/function-items").SearchCondition): void {
    if (key.now){
      let params: Params = {page:0};
      params['key'] = key.key;
      
      this._router.navigate([],{relativeTo: this._route, queryParams: params, queryParamsHandling: 'merge' })
    }
  }

  constructor(public dataDefine: DataDefine,  private _router: Router,  private _route: ActivatedRoute, _func: FunctionPageBar){
    super(_route,_func);
  }

  checks: PageResult<FireCheck>

  status: string;

  ngOnInit(): void {
    this._route.data.subscribe(data => this.checks = data.checks)
  }

  onStatusChange(status?: string){

    if (!status || status === '' || status === this.status){
      this._router.navigate([],{relativeTo: this._route,queryParams: {page:0,status: null}, queryParamsHandling: 'merge'})
    }else{
      this._router.navigate([],{relativeTo: this._route,queryParams: {page:0,status: status}, queryParamsHandling: 'merge'})
    }


  }

  onPageChange(pageEvent: PageEvent){
    console.log("chang page:" , pageEvent.pageIndex);

    if ((pageEvent.pageIndex) !== this.checks.number){

      this._router.navigate([], {relativeTo: this._route, queryParams: {page: pageEvent.pageIndex} ,queryParamsHandling: 'merge'});
    }
  }
}


@Injectable()
export class FireCheckDataService {
  fireCheck: FireCheck;
}

@Component({templateUrl: './details.html',providers:[FireCheckDataService]})
export class FireCheckDetailsComponent implements OnInit{

  constructor(public dataService: FireCheckDataService,
    private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.data.subscribe(data => this.dataService.fireCheck = data.check);
  }

}

@Component({
  template:`<fire-check-info [fireCheck]="dataService.fireCheck"></fire-check-info>`
})
export class FireCheckInfoComponent {

  constructor(public dataService: FireCheckDataService){}

}

@Component({
  template:`<business-document-files  [editable]="false" [businessId]="businessId"></business-document-files>`
})
export class FireCheckDocumentComponent implements OnInit{

  constructor(private _route: ActivatedRoute){}

  businessId: number;

  ngOnInit(): void {
   this._route.parent.params.subscribe(params => this.businessId = params['id']);
  }

}




const routes: Routes =[
  {path: '' , component: FireCheckSearchComponent, runGuardsAndResolvers: 'paramsOrQueryParamsChange', resolve:{checks: FireCheckSearchResolver}},
  {path: ':id', component: FireCheckDetailsComponent , resolve:{check: FireCheckResolver} , 
    children:[
      {path: '', component: FireCheckInfoComponent},
      {path: 'document', component: FireCheckDocumentComponent}
    ]
  }
]

@NgModule({
  declarations:[
    FireCheckSearchComponent,
    FireCheckDetailsComponent,
    FireCheckInfoComponent,
    FireCheckDocumentComponent
  ],
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
    FireCheckSchemasModule,
    FireCheckInfoModule,
    BusinessDocumentModule
  ]
})
export class FireCheckModule {

}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { OcticonModule } from 'src/app/tools/octicon/octicon.directive';

import { Component, OnInit } from '@angular/core';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';
import { SearchFunctionBase, SearchCondition, FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';
import { CorpBusiness, Corp } from 'src/app/shared/data/corp';
import { CorpResolver } from './corp.resolver';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';


@Component({
  selector: 'app-main',
  templateUrl: './corp.component.html',
  styleUrls: ['./corp.component.scss']
})
export class CorpComponent extends SearchFunctionBase implements OnInit {
  doSearch(key: SearchCondition): void {
    throw new Error("Method not implemented.");
  }

  faRegistered = faRegistered;

  constructor(_route: ActivatedRoute,_func: FunctionPageBar) {
    super(_route,_func);
  }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'corp-edit',
  templateUrl: './corp-edit.component.html',
  styleUrls: []
})
export class CorpEditComponent extends PageFunctionBase implements OnInit{


  business: CorpBusiness;
  corp: Corp;

  constructor(private _route: ActivatedRoute,_func: FunctionPageBar) {
    super(_route,_func);
  }

  ngOnInit(): void {
    this._route.data.subscribe(data => {
      
      this.corp = data.corp;
      this.business = new CorpBusiness();

      
    })
  }
  
}


const routes: Routes =[
  {path: '' , component: CorpComponent },
  {path: 'edit', component: CorpEditComponent},
  {path: 'edit/:id', component: CorpEditComponent, resolve: {business: CorpResolver}}
]

@NgModule({
  declarations: [CorpComponent,CorpEditComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatInputModule,
    RouterModule.forChild(routes)
  ]
})
export class CorpModule { }

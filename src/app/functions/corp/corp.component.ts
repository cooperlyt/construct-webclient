import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { Component, OnInit } from '@angular/core';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';
import { SearchFunctionBase, SearchCondition, FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';
import { CorpResolver } from './corp.resolver';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select'
import { Corp } from 'src/app/shared/data/corp';
import { GroupIdType, PersonIdType } from 'src/app/shared/data/define';


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
  styleUrls: ['./corp-edit.component.scss']
})
export class CorpEditComponent extends PageFunctionBase implements OnInit{


  corp: Corp;

  businessForm: FormGroup;

  groupIdTypes = Object.keys(GroupIdType).map(key => ({id: key, name:GroupIdType[key]}));

  personIdType = Object.keys(PersonIdType).map(key => ({id: key, name: PersonIdType[key]}));

  constructor(private _fb: FormBuilder,private _route: ActivatedRoute,_func: FunctionPageBar) {
    super(_route,_func);
  }

  ngOnInit(): void {
    this._route.data.subscribe(data => {
      
      this.corp = data.corp;
 
      this.businessForm = this._fb.group({
        applyTime: [Date.now()],
      })


      if (!this.corp){
        this.businessForm.addControl('corpInfo' , this._fb.group({
          name: ['', [Validators.required,Validators.maxLength(128)]],
          groupIdType: ['', Validators.required],
          groupId: ['', Validators.required, Validators.maxLength(32)],
          ownerName: ['', Validators.required, Validators.maxLength(32)],
          ownerIdType: ['', Validators.required],
          ownerId: ['', Validators.required, Validators.maxLength(32)],
          address: ['',Validators.maxLength(256)],
          tel: ['',Validators.maxLength(16)],
        }));
      }

      
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
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    RouterModule.forChild(routes)
  ]

})
export class CorpModule { }

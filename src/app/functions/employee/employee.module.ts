import { NgModule, OnInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'
import { SearchCondition, SearchFunctionBase, FunctionPageBar, PageFunctionBase } from 'src/app/shared/function-items/function-items';


@Component({
  selector: 'app-main',
  templateUrl: './employee.component.html',
  styleUrls: []
})
export class EmployeeComponent extends SearchFunctionBase implements OnInit {


  doSearch(key: SearchCondition): void {
    console.log("search:" + key.key + "|" + key.now);
  }



  constructor(_route: ActivatedRoute,_func: FunctionPageBar) {
    super(_route,_func);
  }

  ngOnInit(): void {
  }

}


@Component({
  selector: 'employee-edit',
  templateUrl: './employee-edit.html',
  styleUrls:[]
})
export class EmployeeEditComponent extends PageFunctionBase implements OnInit {
  
  constructor(_route: ActivatedRoute,_func: FunctionPageBar) {
    super(_route,_func);
  }

  ngOnInit(): void {
  }
  
}

const routes: Routes = [ {path : '', component : EmployeeComponent},
  {path: 'edit/{:id}', component: EmployeeEditComponent},
  {path: 'edit', component: EmployeeEditComponent}];

@NgModule({
  declarations: [EmployeeComponent,EmployeeEditComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(routes)
  ]
})
export class EmployeeModule { }

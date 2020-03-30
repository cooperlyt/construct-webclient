import {Component, EventEmitter, NgModule, Output} from '@angular/core';

import { FunctionPageBar, FunctionHeaderInfo } from 'src/app/shared/function-items/function-items';

@Component({
  selector: 'app-function-page-header',
  templateUrl: './function-page-header.component.html',
  styleUrls: ['./function-page-header.component.scss']
})
export class FunctionPageHeaderComponent{

  func: FunctionHeaderInfo;

  constructor(private _func: FunctionPageBar) {

    _func.getLoad().subscribe(info => {
      this.func = info;

    })

  }

  search(key: string){
    this._func.doSearch(key);
  }


  @Output() toggleSidenav = new EventEmitter<void>();

}




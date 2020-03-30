import { Component, OnInit } from '@angular/core';
import { FunctionBaseComponent, FunctionItems, FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends FunctionBaseComponent implements OnInit {
  get search(): boolean {
    return true;
  }


  doSearch(key: string) {
    console.log( "do search :" + key);
    // do nothin
  }

  constructor(_route: ActivatedRoute, _docItems: FunctionItems,_func: FunctionPageBar) {
    super(_route,_docItems,_func);
  }

  ngOnInit(): void {
  }

}

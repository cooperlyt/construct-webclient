import { Component, OnInit } from '@angular/core';
import { SearchFunctionBase, FunctionItems, FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends SearchFunctionBase implements OnInit {

  doSearch(key: string) {
    console.log( "do search :" + key);
    // do nothin
  }

  constructor(_route: ActivatedRoute,_func: FunctionPageBar) {
    super(_route,_func);
  }

  ngOnInit(): void {
  }

}

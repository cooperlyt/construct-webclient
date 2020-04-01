import { Component, OnInit } from '@angular/core';
import { SearchFunctionBase, FunctionItems, FunctionPageBar, SearchCondition } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends SearchFunctionBase implements OnInit {


  doSearch(key: SearchCondition): void {
    console.log("search:" + key.key + "|" + key.now);
  }



  constructor(_route: ActivatedRoute,_func: FunctionPageBar) {
    super(_route,_func);
  }

  ngOnInit(): void {
  }

}

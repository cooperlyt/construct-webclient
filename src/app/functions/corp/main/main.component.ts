import { Component, OnInit } from '@angular/core';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';
import { SearchFunctionBase, SearchCondition, FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends SearchFunctionBase implements OnInit {
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

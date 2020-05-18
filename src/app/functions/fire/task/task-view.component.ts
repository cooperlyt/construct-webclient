import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FireTaskDataService } from './fire-task.service';
import { FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { MatExpansionPanel } from '@angular/material/expansion';
import { faUserTie, faPhone } from '@fortawesome/free-solid-svg-icons';

@Component({templateUrl:"./task-view.html", providers:[FireTaskDataService]})
export class FireTaskViewComponent implements OnInit{

  constructor(public dataService: FireTaskDataService,
    private _route: ActivatedRoute,_func: FunctionPageBar){
      this._route.queryParams.subscribe(queryParams => dataService.load(queryParams['tid']).subscribe(complete => {if (complete) _func.loadTitle(dataService.processDefinition.name + ' / ' + dataService.task.name)}));
  }

  ngOnInit(): void {

  }

}


@Component({selector:"fire-task-view-info",templateUrl:"./base-info.html", styleUrls:['./info.scss']})
export class FireCheckProjectInfoComponent implements OnInit{


  faUserTie = faUserTie;
  faPhone = faPhone;
  
  constructor(public dataService: FireTaskDataService){}

  ngOnInit(): void {

  }

}

export class FireCheckTableComponent implements OnInit{
  
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

}

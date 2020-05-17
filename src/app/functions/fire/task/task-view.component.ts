import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FireTask } from './fire-task.resolver';

@Component({templateUrl:"./task-view.html"})
export class FireTaskViewComponent implements OnInit{

  fireTask: FireTask;

  constructor(private _route: ActivatedRoute){}

  ngOnInit(): void {
    this._route.data.subscribe(data => this.fireTask = data.fireTask)
  }

}


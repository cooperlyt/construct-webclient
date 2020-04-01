import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';

import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { FunctionPageBar } from '../shared/function-items/function-items';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  faUser = faUser;
  user: any;
  faBuilding = faBuilding;

 

  constructor(private _authService: AuthenticationService, private route: ActivatedRoute, _func: FunctionPageBar) { 
    _func.loadTitle(environment.title);
  }

  ngOnInit() {
      this._authService.getUserInfo().subscribe(data => {this.user = data;   console.log(" user data is: ", data); });
      // this.route.data.subscribe(data => this.projects = data.projects.filter(p => p.id));
  }



}

import { Component, OnInit } from '@angular/core';

import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { FunctionPageBar } from '../shared/function-items/function-items';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  faUser = faUser;
  user: KeycloakProfile;
  faBuilding = faBuilding;


  test(){
      this._toastr.error("test");
  }
 

  constructor(
    private keycloakService: KeycloakService,
    private _toastr: ToastrService, 
    private route: ActivatedRoute, 
    _func: FunctionPageBar) { 
    _func.loadTitle(environment.title);
  }

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()){
      this.user = await this.keycloakService.loadUserProfile();
      console.log(this.user)
    }
  }

  async doLogout() {
    await this.keycloakService.logout();
  }


}

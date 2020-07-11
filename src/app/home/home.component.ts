import { Component, OnInit } from '@angular/core';

import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { FunctionPageBar } from '../shared/function-items/function-items';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('rotaty', [
      state('inactive', style({
        transform: 'rotate(0deg)',
        transformOrigin: '50% 50%',
      })),
      state('active', style({
        transform: 'rotate({{anim_rotate}}deg)',

       transformOrigin: '50% 50%',
      }),{params: {anim_rotate: 360}}), 



      transition('* => active', animate('3000ms linear')) //ease-in-out
    ]),
    trigger('scory', [
      state('inactive', style({
        transform: 'scale(1)'
      })),
      state('active', style({
        transform: 'scale(1.2)'
      })),
      transition('* => active', animate('800ms ease-in-out')),
      transition('active => inactive', animate('800ms ease-in-out'))
    ]),
    // trigger('slidy', [
    //   transition('* => *', slideAnimation),
    // ]),
    // trigger('fady', [
    //   transition('* => *', fadeAnimation),
    // ])
  ]
})
export class HomeComponent implements OnInit {

  faUser = faUser;
  user: KeycloakProfile;
  faBuilding = faBuilding;

  rotaty = false;
  rotate = 360;

  test(){
    this.rotaty = !this.rotaty;
  }
 
  animationDone($event) {
    this.rotaty = !this.rotaty;
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

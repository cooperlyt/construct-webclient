import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;

  user: any;

  searchKey: string;


  search(){
    let params: Params = {page:0};
    if (this.searchKey){
      params['key'] = this.searchKey;
    }

    
    this._router.navigate(['/business-search'], { queryParams: params });
  }

  constructor(private _service: AuthenticationService, private _router: Router,private _route: ActivatedRoute) { }

  ngOnInit() {
      this._service.getUserInfo().subscribe(data => this.user = data);

      this._route.queryParams.subscribe(params => {
        if (params.hasOwnProperty('key')){
          this.searchKey = params['key'];
        }else{
          this.searchKey = null;
        }
    
      });



  }

  logout() {
    this.user = null;
    this._service.logout();
    this._router.navigate(['/login'])
  }
}

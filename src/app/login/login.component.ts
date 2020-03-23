import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import {Router} from '@angular/router';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { faCoins } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  faCoins = faCoins;

  loginData = {username: "", password: ""};

  fail = false;

  loadding: boolean = false;

  constructor(private elementRef: ElementRef, private _service: AuthenticationService,private _router:Router) { }

  ngOnInit() {
    this.fail = false;
  }


  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#f9f9f9';
  }
  ngOnDestroy(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor ="#fff";
  }

  closeAlert(){
    this.fail = false;
  }

  login(){
    this.loadding = true;
    this._service.obtainAccessToken(this.loginData).pipe(
        catchError(err => {
          this.fail = true;
          this.loadding = false;
          return EMPTY;
        })
    ).subscribe(_=>this._router.navigate(['']));
  }

}

import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResolveStart, ResolveEnd } from '@angular/router';
import { CommonModule } from "@angular/common";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ToastrModule } from 'ngx-toastr';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { QRCodeModule } from 'angularx-qrcode';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatIconModule} from '@angular/material/icon'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GeneralErrorInterceptor } from './general-error.interceptor';
import { AuthInterceptor } from "./auth/interceptors/auth.interceptor";

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { FunctionLayoutComponent } from './layouts/function-layout/function-layout.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { ToolsModule } from './tools/tools.module';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    FunctionLayoutComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,

    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    QRCodeModule,
    NgxUiLoaderModule,
    ToastrModule.forRoot(),
    NgProgressModule.withConfig(
      {
        spinner: false
      }
    ),
    NgProgressRouterModule.withConfig(
      {
        startEvents: [ResolveStart],
        completeEvents: [ResolveEnd],
      }
    ),
    FontAwesomeModule,
    ToolsModule,
    AppRoutingModule,
  ],
  providers: [Title,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: GeneralErrorInterceptor, multi: true},
    JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }

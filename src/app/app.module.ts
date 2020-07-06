import { Title } from '@angular/platform-browser';
import { NgModule, DoBootstrap, ApplicationRef} from '@angular/core';
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
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule, MatPaginatorIntl} from '@angular/material/paginator';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GeneralErrorInterceptor } from './shared/general-error.interceptor';

import { HomeComponent } from './home/home.component';
import { MasterLayoutComponent } from './layouts/master-layout/master-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { PaperLayoutComponent } from './layouts/paper-layout/paper-layout.component';
import { NavbarComponent, ChangePwdDialog } from './layouts/navbar/navbar.component';
import { SidenavLayoutComponent, ComponentNav } from './layouts/sidenav-layout/sidenav-layout.component';
import { FunctionPageHeaderComponent } from './layouts/function-page-header/function-page-header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { OcticonModule } from './tools/octicon/octicon.directive';
import { NavigationFocusModule } from './tools/navigation-focus/navigation-focus';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { paginatorCN } from './tools/paginator-cn/paginator-cn';
import { DragulaModule } from 'ng2-dragula';
import { MatMenuModule } from '@angular/material/menu';
import { environment } from 'src/environments/environment';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MasterLayoutComponent,
    PublicLayoutComponent,
    PaperLayoutComponent,
    NavbarComponent,
    SidenavLayoutComponent,
    ComponentNav,
    FunctionPageHeaderComponent,
    FooterComponent,
    ChangePwdDialog
  ],
  imports: [
    KeycloakAngularModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    CdkAccordionModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    FlexLayoutModule,
    MatPaginatorModule,
    QRCodeModule,
    NgxUiLoaderModule,
    DragulaModule.forRoot(),
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
    OcticonModule,
    NavigationFocusModule,
    AppRoutingModule,
  ],
  entryComponents:[
    ChangePwdDialog,
    AppComponent
  ],
  providers: [Title,
    {
      provide: KeycloakService,
      useValue: keycloakService,
    },
    { provide: HTTP_INTERCEPTORS, useClass: GeneralErrorInterceptor, multi: true},
    { provide: MAT_DATE_LOCALE, useValue: "zh-cn" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MatPaginatorIntl , useValue: paginatorCN() },
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ],
  bootstrap: []
})
export class AppModule implements DoBootstrap { 

  async ngDoBootstrap(app:ApplicationRef) {
    const { keycloakConfig } = environment;

    try {
      await keycloakService.init({ 
        config: keycloakConfig ,
        // initOptions: {
        //   onLoad: 'login-required',
        //   checkLoginIframe: false,
        // },
        enableBearerInterceptor: true
      });
      app.bootstrap(AppComponent);
    } catch (error) {
      console.error('Keycloak init failed', error);
    }
  }

}

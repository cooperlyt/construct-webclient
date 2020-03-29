import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterLayoutComponent } from './layouts/master-layout/master-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { PaperLayoutComponent } from './layouts/paper-layout/paper-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { LoginComponent } from './login/login.component';
import { SidenavLayoutComponent } from './layouts/sidenav-layout/sidenav-layout.component';


const routes: Routes = [
  {
    path: '',                       // {1}
    component: MasterLayoutComponent,
    canActivate: [AuthGuard],       // {2}
    children:[
      {
        path: '',
        component: SidenavLayoutComponent,   
        children:[
          {
            path: '',
            component: HomeComponent
          },
          {
            path: 'project-corp',
            loadChildren: './functions/corp/corp.module#CorpModule'
          }
        ]
      },
      {
        path: '',
        component: PaperLayoutComponent,
        children:[
        ]
      }      
    ]
  },
  {
    path: '',
    component: PublicLayoutComponent, // {4}
    children: [
      {
        path: 'login',
        component: LoginComponent   // {5}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

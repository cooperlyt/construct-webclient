import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { MasterLayoutComponent } from './layouts/master-layout/master-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { PaperLayoutComponent } from './layouts/paper-layout/paper-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { LoginComponent } from './login/login.component';
import { SidenavLayoutComponent } from './layouts/sidenav-layout/sidenav-layout.component';
import { FunctionGuard } from './auth/function.guard';

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
            path: 'business',
            loadChildren: () => import('./business/business.module').then(m => m.BusinessModule)
          },
          {
            path: 'function',
            canActivateChild: [FunctionGuard],
            children:[
              {
                path: 'employee',
                canLoad: [FunctionGuard],
                loadChildren: () => import('./functions/employee/employee.module').then(m => m.EmployeeModule)
              },
              {
                path: 'corp',
                loadChildren: () => import('./functions/corp/corp.module').then(m => m.CorpModule)
              },
              {
                path: 'project',
                loadChildren: () => import('./functions/project/project.module').then(m => m.ProjectModule)
              }
            ]
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
  imports: [RouterModule.forRoot(routes,{
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'corrected'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

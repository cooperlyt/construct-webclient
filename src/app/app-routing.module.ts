import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { MasterLayoutComponent } from './layouts/master-layout/master-layout.component';
import { HomeComponent } from './home/home.component';
import { PaperLayoutComponent } from './layouts/paper-layout/paper-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { SidenavLayoutComponent } from './layouts/sidenav-layout/sidenav-layout.component';
import { AppAuthGuard } from './app-auth.guard';


const routes: Routes = [
  {
    path: '',                       // {1}
    component: MasterLayoutComponent,
    canActivate: [AppAuthGuard],       // {2}
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
            path: 'task',
            children:[
              {
                path: 'fire',
                loadChildren: () => import('./functions/fire/task/task.module').then(m => m.FireTaskModule)
              }
            ]
          },
          {
            path: 'function',
            // canActivateChild: [FunctionGuard],
            children:[
              {
                path: 'employee',
                // canLoad: [FunctionGuard],
                loadChildren: () => import('./functions/employee/employee.module').then(m => m.EmployeeModule)
              },
              {
                path: 'corp',
                loadChildren: () => import('./functions/corp/corp.module').then(m => m.CorpModule)
              },
              {
                path: 'project',
                loadChildren: () => import('./functions/project/project.module').then(m => m.ProjectModule)
              },
              {
                path: 'fire',
                loadChildren: () => import('./functions/fire/create/create.module').then(m => m.FireModule)
              },
              {
                path: 'fire-business',
                loadChildren: () => import('./functions/fire/search.module').then(m => m.FireCheckModule)
              },
              {path: 'fire-business-special' , redirectTo: '/function/fire-business?filter=special'},
              {path: 'fire-business-record' , redirectTo: '/function/fire-business?filter=record'},
              {path: 'fire-business-radom' , redirectTo: '/function/fire-business?filter=inRomand'}

            ]
          }
        ]
      },
      // {
      //   path: '',
      //   component: PaperLayoutComponent,
      //   children:[

      //   ]
      // }      
    ]
  },
  // {
  //   path: '',
  //   component: PublicLayoutComponent, // {4}
  //   children: [
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'corrected'
    })],
  exports: [RouterModule],
  providers: [AppAuthGuard]
})
export class AppRoutingModule { }

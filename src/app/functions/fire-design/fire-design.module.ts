import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fire-design-component',
  templateUrl: './fire-design.html'
})
export class FireDesingComponent {

}

const routes: Routes =[
  {path: '', component: FireDesingComponent}
]

@NgModule({
  declarations:[FireDesingComponent],
  imports:[
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class FireDesignModule {}
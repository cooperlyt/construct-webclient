import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes =[
  {path: '' , component: MainComponent}
]

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ]
})
export class CorpModule { }

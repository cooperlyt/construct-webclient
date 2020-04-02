import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'


const routes: Routes =[
  {path: '' , component: MainComponent}
]

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(routes)
  ]
})
export class CorpModule { }

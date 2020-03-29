import {Component, EventEmitter, NgModule, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-function-page-header',
  templateUrl: './function-page-header.component.html',
  styleUrls: ['./function-page-header.component.scss']
})
export class FunctionPageHeaderComponent{

  constructor(public _functionPageTitle: FunctionPageTitle) {}

  @Output() toggleSidenav = new EventEmitter<void>();

  getTitle() {
    return this._functionPageTitle.title;
  }

}


@Injectable({providedIn: 'root'})
export class FunctionPageTitle {
  _title = '';
  _originalTitle = environment.title;

  get title(): string { 
    if (this._title == ''){
      return this._originalTitle;
    } else {
      return this._title; 
    }
    
  }

  set title(title: string) {
    this._title = title;
    if (title !== '') {
      title = `${title} | ${this._originalTitle}`;
    } else {
      title = this._originalTitle;
    }
    this.bodyTitle.setTitle(title);
  }

  constructor(private bodyTitle: Title) {}
}

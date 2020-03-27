import {Component, EventEmitter, NgModule, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-function-page-header',
  templateUrl: './function-page-header.component.html',
  styleUrls: ['./function-page-header.component.scss']
})
export class FunctionPageHeaderComponent{

  constructor(public _componentPageTitle: ComponentPageTitle) {}

  @Output() toggleSidenav = new EventEmitter<void>();

  getTitle() {
    return this._componentPageTitle.title;
  }

}


@Injectable({providedIn: 'root'})
export class ComponentPageTitle {
  _title = '';
  _originalTitle = 'Angular Material UI component library';

  get title(): string { return this._title; }

  set title(title: string) {
    this._title = title;
    if (title !== '') {
      title = `${title} | Angular Material`;
    } else {
      title = this._originalTitle;
    }
    this.bodyTitle.setTitle(title);
  }

  constructor(private bodyTitle: Title) {}
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-layout',
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class PublicLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

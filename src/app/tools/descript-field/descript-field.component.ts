import { NgModule, Component, Input, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({selector:'descript-field',templateUrl:'./descript-field.component.html'})
export class DescriptFieldComponent{

  @Input() field:string;
  @Input() suffix:string;

  get display():boolean{
    return this.field && (this.field.trim() != '')
  }

}

@NgModule({imports:[CommonModule], declarations:[DescriptFieldComponent], exports:[DescriptFieldComponent]})
export class DescriptFieldModule{

}
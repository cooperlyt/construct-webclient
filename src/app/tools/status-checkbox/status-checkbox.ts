import { Component, forwardRef, Input, NgModule } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatCheckboxDefaultOptions, MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tri-state-checkbox',
  template:`<mat-checkbox [ngModel]="value" (click)="next()" [disabled]="disabled" [indeterminate]="value === null" [color]="value === false ? 'warn' : 'accent'">
              <ng-content></ng-content>
            </mat-checkbox>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriStateCheckboxComponent),
      multi: true,
    },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions },
  ],
})
export class TriStateCheckboxComponent implements ControlValueAccessor {

  @Input() tape = [true,null,false];

  value: any;

  disabled: boolean;

  private onChange: (val: boolean) => void;
  private onTouched: () => void;

  writeValue(value: any) {
    this.value = value || this.tape[0];
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  next() {
    this.onChange(this.value = this.tape[(this.tape.indexOf(this.value) + 1) % this.tape.length]);
    this.onTouched();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

}

@NgModule({
  declarations:[
    TriStateCheckboxComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    MatCheckboxModule
  ],
  exports:[
    TriStateCheckboxComponent
  ]
})
export class StateCheckboxModule{

}
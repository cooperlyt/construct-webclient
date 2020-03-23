import { Component, OnInit, AfterViewInit, Input, ViewChild, Injector, forwardRef, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
import { DateTimeModel } from './date-time.model';
import { NgbDateStruct, NgbTimeStruct, NgbDatepicker, NgbPopover, NgbPopoverConfig, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { noop } from 'rxjs';
import { I18n, CustomDatepickerI18n } from './datepicker-i18n';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  providers: [
    DatePipe,
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DateTimePickerComponent),
        multi: true
    },
    I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class DateTimePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  @Input()
  dateString: string;

  @Input()
  inputDatetimeFormat = 'yyyy-M-d H:mm:ss';

  @Input()
  hourStep = 1;
  @Input()
  minuteStep = 15;
  @Input()
  secondStep = 30;
  @Input()
  seconds = true;

  @Input()
  disabled = false;

  @Input()
  placeholder: string = '';


  showTimePickerToggle = false;

  datetime: DateTimeModel = new DateTimeModel();
  private firstTimeAssign = true;

  @ViewChild(NgbDatepicker, {static: false})
  private dp: NgbDatepicker;

  @ViewChild(NgbPopover, {static: false})
  private popover: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

    ngControl: NgControl;

  constructor(private config: NgbPopoverConfig, private inj: Injector ) {
      config.autoClose = 'outside';
      config.placement = 'auto';
  }

  get isEditTime(): boolean{
    return (this.inputDatetimeFormat.indexOf("H") >= 0)
  }

  ngOnInit(): void {
      this.ngControl = this.inj.get(NgControl);
  }

  ngAfterViewInit(): void {
      this.popover.hidden.subscribe($event => {
          this.showTimePickerToggle = false;
      });
  }

  writeValue(newModel: string) {
      if (newModel) {
          this.datetime = Object.assign(this.datetime, DateTimeModel.fromLocalString(newModel));
          this.dateString = newModel;
          this.setDateStringModel();
      } else {
          this.datetime = new DateTimeModel();
      }
  }

  registerOnChange(fn: any): void {
      this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
      this.onTouched = fn;
  }

  toggleDateTimeState($event) {
      this.showTimePickerToggle = !this.showTimePickerToggle;
      $event.stopPropagation();
  }

  setDisabledState?(isDisabled: boolean): void {
      this.disabled = isDisabled;
  }

  onInputChange($event: any) {
      const value = $event.target.value;
      const dt = DateTimeModel.fromLocalString(value);

      if (dt) {
          this.datetime = dt;
          this.setDateStringModel();
      } else if (value.trim() === '') {
          this.datetime = new DateTimeModel();
          this.dateString = '';
          this.onChange(this.dateString);
      } else {
            this.onChange(value);
      }
  }

  onDateChange($event: string | NgbDateStruct) {

    let value: string;
    if (typeof $event === "string"){
        value = $event;
    }else{
        value = `${$event.year}-${$event.month}-${$event.day}`;
    }

      const date = DateTimeModel.fromLocalString(value);
 
      if (!date) {
          this.dateString = this.dateString;
          return;
      }

      if (!this.datetime) {
          this.datetime = date;
      }

      this.datetime.year = date.year;
      this.datetime.month = date.month;
      this.datetime.day = date.day;

      if (this.dp){
        this.dp.navigateTo({ year: this.datetime.year, month: this.datetime.month });
     }
      this.setDateStringModel();
  }

  onTimeChange(event: NgbTimeStruct) {
      this.datetime.hour = event.hour;
      this.datetime.minute = event.minute;
      this.datetime.second = event.second;

      this.setDateStringModel();
  }

  setDateStringModel() {
      this.dateString = this.datetime.toString();
      
      /** first set form very is fail so remove this code! */
    //   if (!this.firstTimeAssign) {
    //       this.onChange(this.dateString);
    //   } else {
    //       // Skip very first assignment to null done by Angular
    //       if (this.dateString !== null) {
    //           this.firstTimeAssign = false;
    //       }
    //   }

      this.onChange(this.dateString);


  }

  inputBlur($event) {
      this.onTouched();
  }

}

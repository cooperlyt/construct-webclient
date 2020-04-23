import { NgModule, Component, OnInit, forwardRef } from '@angular/core';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { withLatestFrom, switchMap, scan, tap, takeUntil, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';
import { MatSelectSearchModule } from 'src/app/tools/mat-select-search/mat-select-search.module';
import { FormControl, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Corp } from '../data/corp';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageResult } from '../page-result';
import { environment } from 'src/environments/environment';
import { CustomEncoder } from '../custom-encoder';

@Component({selector:"corp-select",
  templateUrl:"./corp-select.component.html",
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CorpSelectComponent),
    multi: true
  }]
})
export class CorpSelectComponent implements OnInit,ControlValueAccessor{

  public corpFilterCtrl: FormControl = new FormControl();

  private _onDestroy = new Subject<void>();

  constructor(private _http: HttpClient){}

  private _value: number;

  onChange: Function = (_: any) => {};
  onTouched: Function = (_: any) => {};

  writeValue(value: number): void {
    const valueChanged = value !== this._value;
    if(valueChanged){
      this._value = value;
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error("Method not implemented.");
  // }

  selectChange(change: MatSelectChange){
    const valueChanged = change.value !== this._value;
    if (valueChanged){
      this._value = change.value;
      this.onChange(change.value);
    }
  }

  options$: Observable<any>;

  offset$: Subject<number> = new BehaviorSubject(0);
  search$: Subject<string> = new BehaviorSubject(null);

  complete: boolean = false;
  currPage: number = 0;


  ngOnInit(): void {
    this.options$ = this.offset$.pipe(
      takeUntil(this._onDestroy),
      withLatestFrom(this.search$),
      switchMap(([offset, search]) => this.getOptions(offset, search)),
      withLatestFrom(this.offset$),
      scan((acc, [currOptions, currOffset]) => currOffset === 0 ? currOptions : [...acc, ...currOptions], []),
      tap(aa => console.log(aa))
    )

    this.corpFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value) => this.search(value));
  }

  nextPage() {
    this.offset$.next(this.currPage + 1);
  }

  search(key) {
    this.currPage = 0;
    this.search$.next(key);
    this.offset$.next(0);
  }

  getOptions(offset, term): Observable<any> {

    
    let params = new HttpParams({encoder: new CustomEncoder()})
    if (term ){
      params = params.append("key",term);
    }
    return this._http.get<PageResult<Corp>>(`${environment.apiUrl}/construct-attach-corp/view/names/${offset}`,{params: params}).pipe(
      tap(page => {this.complete = page.last; this.currPage = page.number}),
      map(page => (page.content))
    )

  
  }




  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}


@NgModule({declarations:[
  CorpSelectComponent
],
imports:[
  CommonModule,
  ReactiveFormsModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatSelectInfiniteScrollModule,
  MatSelectSearchModule
],
exports:[
  CorpSelectComponent
]})
export class CorpSelectModule{

}
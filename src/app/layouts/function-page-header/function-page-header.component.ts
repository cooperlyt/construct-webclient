import {Component, EventEmitter, NgModule, Output, ElementRef, ViewChild, HostListener, OnInit} from '@angular/core';

import { FunctionPageBar, FunctionHeaderInfo } from 'src/app/shared/function-items/function-items';
import { fromEvent } from 'rxjs';
import { throttleTime, map, pairwise, distinctUntilChanged, share, switchMap, mergeMap, combineAll } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


const MAX_PADDING = 28;
const MIN_PADDING = 16;
const MIN_HEIGHT = 20;

@Component({
  selector: 'app-function-page-header',
  templateUrl: './function-page-header.component.html',
  styleUrls: ['./function-page-header.component.scss']
})
export class FunctionPageHeaderComponent implements OnInit{


  @Output() private heightChange = new EventEmitter();

  info: FunctionHeaderInfo = {title: '', search: false}

  padding: number = MAX_PADDING;

  searchKey: string = "";

  get haveKey():boolean{
    if (this.search){
      return this.searchKey.trim() !== ''
    }else {
      return false;
    }
  }

  

  search(){
    if (this.info.search){
      this.func.doSearch({key:this.searchKey.trim(),now: true});
    }
  }

  clearKey(){
    if (this.info.search){
      this.searchKey = "";
      this.func.doSearch({key:'',now: true});
    }
  }

  inputChange(){
    if (this.info.search){
      this.func.doSearch({key:this.searchKey.trim(),now: false});
    }
  }

  ngAfterViewInit() {
    const content = document.querySelector('.mat-sidenav-content');
    fromEvent(content, 'scroll').pipe(
      throttleTime(10), // only emit every 10 ms

      map(() => content.scrollTop), // get vertical scroll position
      pairwise(), // look at this and the last emitted element

      map(([y0,y]):number => {
        console.log("scroll Top is: " + y0 + "-" + y)

        if (y0 < (MIN_HEIGHT + MAX_PADDING) ){
          return  MAX_PADDING - (y + y0) / 2 / 2;
        }else{
          return  MAX_PADDING - y / 2;
        }
        

      } ),
      // //map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)), // compare this and the last element to figure out scrolling direction
      distinctUntilChanged(), // only emit when scrolling direction changed
      share(), // share a single subscription to the underlying sequence in case of multiple subscribers
    ).subscribe(
      (padding) => {

        // if (y2 !== this.pp[0] && y1 !== this.pp[1]){
     

          if (this.func.info.search ){

            console.log("set padding:" + padding)
            if (padding > MAX_PADDING){
              this.padding = MAX_PADDING;
            }else if (padding < MIN_PADDING){
              this.padding = MIN_PADDING
            }else{
              this.padding = padding;
            }
         
            this.heightChange.emit(this.padding * 2 + MIN_HEIGHT);
           
          }
        //}
      }
    );

}
  
  constructor(private _route: ActivatedRoute, private func: FunctionPageBar) {
    func.getLoad().subscribe(info => {
 

      this.info = info;
      let height:number;

      if (info.search){
        height = MAX_PADDING * 2 + MIN_HEIGHT;
      }else{
        height = 0;
      }
      this.padding = MAX_PADDING;
      this.heightChange.emit(height);
    });
  }


  ngOnInit(): void {
    this._route.queryParamMap.subscribe(paramMap => this.searchKey = paramMap.get('key') || '');
  }




  @Output() toggleSidenav = new EventEmitter<void>();

}




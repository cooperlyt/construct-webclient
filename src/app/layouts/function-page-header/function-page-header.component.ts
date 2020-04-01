import {Component, EventEmitter, NgModule, Output, ElementRef, ViewChild, HostListener} from '@angular/core';

import { FunctionPageBar, FunctionHeaderInfo } from 'src/app/shared/function-items/function-items';
import { fromEvent } from 'rxjs';
import { throttleTime, map, pairwise, distinctUntilChanged, share } from 'rxjs/operators';


const MAX_PADDING = 28;
const MIN_PADDING = 16;
const MIN_HEIGHT = 20;

@Component({
  selector: 'app-function-page-header',
  templateUrl: './function-page-header.component.html',
  styleUrls: ['./function-page-header.component.scss']
})
export class FunctionPageHeaderComponent{


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
      // throttleTime(10), // only emit every 10 ms
      map(() => content.scrollTop), // get vertical scroll position
      // pairwise(), // look at this and the last emitted element
      // //map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)), // compare this and the last element to figure out scrolling direction
      // distinctUntilChanged(), // only emit when scrolling direction changed
      // share(), // share a single subscription to the underlying sequence in case of multiple subscribers
    ).subscribe(
      (y) => {

        if (this.func.info.search){

          let newPadding: number = MAX_PADDING - y / 2;

          console.log("set padding:" + newPadding)
          if (newPadding > MAX_PADDING){
            this.padding = MAX_PADDING;
          }else if (newPadding < MIN_PADDING){
            this.padding = MIN_PADDING
          }else{
            this.padding = newPadding;
          }
          console.log("set padding:" + this.padding)
          this.heightChange.emit(this.padding * 2 + MIN_HEIGHT);
          console.log(y)
        }
      }
    );

}
  
  constructor(private func: FunctionPageBar) {
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




  @Output() toggleSidenav = new EventEmitter<void>();

}




import { Directive, Injectable, Input, EventEmitter, Output, ElementRef, HostListener, NgModule, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { throttleTime, map } from 'rxjs/operators';

@Directive({
    selector: '[scrollSpy]'
})
export class ScrollSpyDirective {
    @Input() public spiedTags = [];
    @Output() public sectionChange = new EventEmitter<string>();
    private currentSection: string;



    constructor(private _el: ElementRef) {}



    ngAfterViewInit(): void {

    }

    @HostListener('scroll', ['$event'])
    onScroll(event: any) {
      console.log("scoll spy---")
        let currentSection: string;
        const children = this._el.nativeElement.children;
        const scrollTop = event.target.scrollTop;
        const parentOffset = event.target.offsetTop;
        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            if (this.spiedTags.some(spiedTag => spiedTag === element.tagName)) {
                if ((element.offsetTop - parentOffset) <= scrollTop) {
                    currentSection = element.id;
                }
            }
        }
        if (currentSection !== this.currentSection) {
            this.currentSection = currentSection;
            this.sectionChange.emit(this.currentSection);
        }
    }

}

@NgModule({
  declarations:[ScrollSpyDirective],
  exports:[ScrollSpyDirective]
})
export class ScrollSpyModule{

}
import {
  Component,
  Input,
  NgModule,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  HostListener,
  ElementRef
} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';

import {combineLatest, Observable, Subject, fromEvent} from 'rxjs';
import {filter, map, startWith, switchMap, takeUntil, throttleTime, pairwise, distinctUntilChanged, share} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatDrawerToggleResult} from '@angular/material/sidenav/drawer';


import {FunctionItems, FunctionPageBar} from '../../shared/function-items/function-items';


const EXTRA_SMALL_WIDTH_BREAKPOINT = 720;
const SMALL_WIDTH_BREAKPOINT = 959;

@Component({
  selector: 'app-sidenav-layout',
  templateUrl: './sidenav-layout.component.html',
  styleUrls: ['./sidenav-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidenavLayoutComponent implements OnInit {

  
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  params: Observable<Params>;
  isExtraScreenSmall: Observable<boolean>;
  isScreenSmall: Observable<boolean>;

  padding: number = 0;

  constructor(public docItems: FunctionItems,
              private _route: ActivatedRoute,
              private _router: Router,
              zone: NgZone,
              breakpoints: BreakpointObserver) {
    this.isExtraScreenSmall =
        breakpoints.observe(`(max-width: ${EXTRA_SMALL_WIDTH_BREAKPOINT}px)`)
            .pipe(map(breakpoint => breakpoint.matches));
    this.isScreenSmall = breakpoints.observe(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`)
    .pipe(map(breakpoint => breakpoint.matches));
  }


  heightChange(padding: number){
    this.padding = padding;
  }



  ngOnInit() {
    // Combine params from all of the path into a single object.
    this.params = combineLatest(
        this._route.pathFromRoot.map(route => route.params), Object.assign);

    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => this.isScreenSmall)
    ).subscribe((shouldCloseSideNav) => {
        if (shouldCloseSideNav && this.sidenav) {
          this.sidenav.close();
        }
      }
    );
  }

  toggleSidenav(sidenav: MatSidenav): Promise<MatDrawerToggleResult> {
    return sidenav.toggle();
  }

}


@Component({
  selector: 'app-function-nav',
  templateUrl: './function-nav.html',
  animations: [
    trigger('bodyExpansion', [
      state('collapsed', style({height: '0px', display: 'none'})),
      state('expanded', style({height: '*', display: 'block'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
  ],
})
export class ComponentNav implements OnInit, OnDestroy {
  // @Input() params: Observable<Params>;
  expansions: {[key: string]: boolean} = {};
  currentItemId: string;
  private _onDestroy = new Subject<void>();

  constructor(public docItems: FunctionItems, private _router: Router) {}

  ngOnInit() {
    this._router.events.pipe(
      startWith(null),
      // switchMap(() => this.params),
      takeUntil(this._onDestroy)
    ).subscribe(params => this.setExpansions());
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /** Set the expansions based on the route url -- params: Params params.section */
  setExpansions() {
    const categories = this.docItems.getCategories();
    for (const category of (categories || [])) {

      let match = false;
      for (const item of category.items) {
        if (this._router.url.indexOf(item.id) > -1) {
          match = true;
          this.currentItemId = item.id;
          break;
        }
      }

      if (!this.expansions[category.id]) {
        this.expansions[category.id] = match;
      }
    }
  }

  /** Gets the expanded state */
  _getExpandedState(category: string) {
    return this.getExpanded(category) ? 'expanded' : 'collapsed';
  }

  /** Toggles the expanded state */
  toggleExpand(category: string) {
    this.expansions[category] = !this.expansions[category];
  }

  /** Gets whether expanded or not */
  getExpanded(category: string): boolean {
    return this.expansions[category] === undefined ? true : this.expansions[category];
  }
}

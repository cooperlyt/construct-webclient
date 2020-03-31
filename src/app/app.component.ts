import { Component, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { Event, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  public constructor(private titleService: Title ,router: Router) { 
    titleService.setTitle(environment.title)

    let previousRoute = router.routerState.snapshot.url;

    router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((data: Event) => {
        const urlAfterRedirects = (data as NavigationEnd).urlAfterRedirects;
        // We want to reset the scroll position on navigation except when navigating within
        // the documentation for a single component.
        if (!isNavigationWithinComponentView(previousRoute, urlAfterRedirects)) {
          resetScrollPosition();
        }

        previousRoute = urlAfterRedirects;
      });
  }
}




function isNavigationWithinComponentView(previousUrl: string, newUrl: string) {
  const componentViewExpression = /(cdk|components)\/(\w+)/;

  const previousUrlMatch = previousUrl.match(componentViewExpression);
  const newUrlMatch = newUrl.match(componentViewExpression);

  return previousUrl && newUrl && previousUrlMatch && newUrlMatch
      && previousUrlMatch[0] === newUrlMatch[0]
      && previousUrlMatch[1] === newUrlMatch[1];
}

function resetScrollPosition() {
  if (typeof document === 'object' && document) {
    const sidenavContent = document.querySelector('.mat-drawer-content');
    if (sidenavContent) {
      sidenavContent.scrollTop = 0;
    }
  }
}

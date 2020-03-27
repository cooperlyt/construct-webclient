import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OcticonDirective } from './octicon.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faCalendar,  faClock } from '@fortawesome/free-regular-svg-icons';
import { faCamera, faAngleUp, faAngleDown, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';


fontLibrary.add(
  fas,
  far,
  faCalendar,
  faClock,
  faCamera,
  faAngleUp,
  faAngleDown,
  faArrowCircleRight
);


@NgModule({
  declarations: [OcticonDirective],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [
    OcticonDirective
  ]
})
export class ToolsModule {}

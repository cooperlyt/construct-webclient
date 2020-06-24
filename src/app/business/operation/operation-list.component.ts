import { Pipe, PipeTransform, Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CamundaRestService } from '../camunda-rest.service';
import { BusinessOperation } from '../schemas';
import { OcticonModule } from 'src/app/tools/octicon/octicon.directive';
import { faCircle,faPauseCircle,  faStopCircle, faCheckCircle, faPlayCircle, faArrowAltCircleRight  } from '@fortawesome/free-regular-svg-icons';
import { faReplyAll } from '@fortawesome/free-solid-svg-icons';


enum OperationType{
  TASK = '处理业务',
  CREATE = "建立业务",
  PASS = "通过",
  REJECT = "驳回",
  ABORT = "中止",
  SUSPEND = "挂起",
  RESUME ="恢复"
}

@Pipe({name: "businessOperationLabel"})
export class ProjectPropertyLabelPipe implements PipeTransform{
    transform(value: string) {
        return OperationType[value];
    }
}

@Component({
  selector: 'business-operations-list',
  templateUrl: './operation-list.html',
  styleUrls: ['./time-line.scss']
})
export class BusinessOperationsComponent implements OnInit{

  @Input()
  id:number;

  faPlayCircle = faPlayCircle;
  faPauseCircle = faPauseCircle;
  faReplyAll = faReplyAll;
  faStopCircle = faStopCircle;
  faCheckCircle = faCheckCircle;
  faArrowAltCircleRight = faArrowAltCircleRight;
  faCircle = faCircle;

  operstions: BusinessOperation[];

  constructor(private _service: CamundaRestService){}

  ngOnInit(): void {
    this._service.businessOperations(this.id).subscribe(res => this.operstions = res);
  }

}

@NgModule({
  declarations:[ProjectPropertyLabelPipe,BusinessOperationsComponent],
  imports:[
    CommonModule,
    FontAwesomeModule,
    MatIconModule,
    MatListModule,
    OcticonModule
  ],
  exports: [ProjectPropertyLabelPipe,BusinessOperationsComponent]
})
export class BusinessOperationModule{}
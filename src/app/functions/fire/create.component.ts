import { OnInit, Component } from '@angular/core';
import { Project } from 'src/app/shared/data/project';
import { ActivatedRoute } from '@angular/router';
import { FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataDefine } from './schemas';
import { FireCheckService } from './fire-check.service';

@Component({
  selector:"fire-check-create",
  templateUrl:"./create.html",
  styleUrls:["./create.scss"]
})
export class FireCheckCreateComponent implements OnInit{

  project: Project;

  businessForm: FormGroup;

  constructor(
    public dataDefine: DataDefine,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _fireCheckService: FireCheckService,
    _func: FunctionPageBar) {
      _func.loadTitle('建设工程消防验收')
  }


  onSubmit(){
    console.log(this.businessForm.value);
    this._fireCheckService.create(this.businessForm.value).subscribe(val => (console.log(val)));
  }

  ngOnInit(): void {
    this._route.data.subscribe(data => {
      this.project = data.project;

      this.businessForm = this._fb.group({
        corp:[null,Validators.required],
        projectCode: [this.project.code],
        file:[null,Validators.maxLength(32)],
        contracts:[null, Validators.maxLength(64)],
        tel:[null,Validators.maxLength(16)],
        danger:[null]
      })
    })

  }

}
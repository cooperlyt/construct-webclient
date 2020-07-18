import { OnInit, Component, NgModule, PipeTransform, Pipe } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Routes, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CorpSelectModule } from 'src/app/shared/corp-select/corp-select.component';
import { MatInputModule } from '@angular/material/input';
import { FunctionPageBar } from 'src/app/shared/function-items/function-items';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


export enum CerType{
  Break = '违约',
  Import = '违纪'
}

@Component({
  selector: 'add-corp-credit',
  templateUrl: './add-credit.html'
})
export class AddCorpCredit implements OnInit {

  form: FormGroup;

  types = Object.keys(CerType).map(key => ({key:key, label:CerType[key] }));

  constructor(
    private _router: Router,
    private http: HttpClient,
    private _fb: FormBuilder,
     _fun: FunctionPageBar){
    _fun.loadTitle("信用管理")
  }

  onSubmit(){
    console.log(this.form.value)
    if (this.form.valid){
      this.http.post<any>(`${environment.apiUrl}/construct-attach-corp/mgr/corp/${this.form.value.corp}/credit/add`,
        {type: this.form.value.type,description: this.form.value.description}).subscribe(_ => this._router.navigate(['/function/corp/details',this.form.value.corp,'credit']))
    }
  }

  ngOnInit(): void {

    this.form = this._fb.group({
      type:[, Validators.required],
      description:[, Validators.maxLength(512)],
      corp:[,Validators.required]
    })
  }

}




const routes: Routes =[
  {path: '' , component: AddCorpCredit},

]



@NgModule({
  declarations:[
    AddCorpCredit
  ],
  imports:[
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CorpSelectModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatPaginatorModule,
    RouterModule.forChild(routes),
  ],
  exports:[
  ]
})
export class AddCorpCreditModule {}
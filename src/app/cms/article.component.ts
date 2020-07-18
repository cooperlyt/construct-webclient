import { Component, OnInit } from '@angular/core';
import { CmsService } from './cms.service';
import { Category } from './schemas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionPageBar } from '../shared/function-items/function-items';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector:'articleEdit',
  templateUrl: './article-editor.html'
})
export class ArticleComponent implements OnInit{

  constructor(
    private _route: ActivatedRoute,
    private _comSvr: CmsService, 
    private _fb: FormBuilder, 
    private _func: FunctionPageBar){}

  form: FormGroup;

  ngOnInit(): void {
    //this._comSvr.categorys().subscribe(categories => this.categories = categories);
    this._func.loadTitle("信息发布");
    this.form = this._fb.group({
      title:[,[Validators.required, Validators.maxLength(256)]],
      content:[]
    })
  }

  onSubmit(){
    console.log(this.form.value)

    if (this.form.valid){

      this._route.params.subscribe(param => this._comSvr.addArticle(param['category'],this.form.value).subscribe(
        id => this.form.reset()
      )
      )
    }
  }


}
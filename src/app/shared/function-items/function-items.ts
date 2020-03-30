import {Injectable, Component, OnDestroy} from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';

export interface FunctionItem {
  /** Id of the doc item. Used in the URL for linking to the doc. */
  id: string;
  /** Display name of the doc item. */
  name: string;
  /** Short summary of the doc item. */
  summary?: string;

  roles?: string[];
}

export interface FunctionCategory {
  id: string;
  name: string;
  items: FunctionItem[];
  summary?: string;

  roles?: string[];
}

export interface FunctionHeaderInfo {
  item: FunctionItem;
  search: boolean;
}

const CDK = 'cdk';
const COMPONENTS = 'components';



const FUNCTIONS:  FunctionCategory[] = 
  [
    {
      id: 'project',
      name: '建设工程备案',
      summary: '建设工程备案.',
      items: [
        {
          id: 'project',
          name: '工程项目',
          summary: '工程项目.'
        },
        {
          id: 'corp',
          name: '参建单位',
          summary: '参建单位.'
        }
      ]
    },
    {
      id: 'fire',
      name: '消防质检',
      summary: '消防质检.',
      items: [
        {
          id: 'fire-templete',
          name: '质检模版',
          summary: '质检模版.'
        },
        {
          id: 'fire-business',
          name: '检测业务',
          summary: '检测业务.',
        }
      ]
    },
    {
      id: 'quality',
      name: '工程质检',
      summary: '工程质检.',
      items: [
        {
          id: 'quality-params',
          name: '质检参数',
          summary: '质检参数.'
        },
        {
          id: 'quality-business',
          name: '质检业务',
          summary: '质检业务.'
        }
      ]
    },
    {
      id: 'files',
      name: '档案管理',
      summary: '档案管理.',
      items: [
        {
          id: 'files-room',
          name: '档案室'
        },
        {
          id: 'files-business',
          name: '档案业务'
        }
      ]
    },
    {
      id: 'setting',
      name: '系统设置',
      summary: '系统设置.',
      items: [
        {
          id: 'employee',
          name: '员工管理',
          summary: '员工管理.'
        },
        {
          id: 'config',
          name: '系统设置',
          summary: '系统设置.'
        }
      ]
    }
  ];

const ALL_FUNCTIONS_ITEM = FUNCTIONS.reduce(
    (result: FunctionItem[], category: FunctionCategory) => result.concat(category.items), []);

@Injectable({providedIn: 'root'})
export class FunctionItems {
  getCategories(): FunctionCategory[] {
    return FUNCTIONS;
  }

  getItems(): FunctionItem[] {
    return ALL_FUNCTIONS_ITEM;
  }

  getItemById(id: string): FunctionItem | undefined {
    return ALL_FUNCTIONS_ITEM.find(f => f.id === id);
  }

  getCategoryById(id: string): FunctionCategory | undefined {
    return FUNCTIONS.find(c => c.id === id);
  }
}


@Injectable({providedIn: 'root'})
export class FunctionPageBar {
  _title = '';
  _originalTitle = environment.title;

  private search$ = new Subject<string>();

  private load$ = new Subject<FunctionHeaderInfo>();

  loading(info: FunctionHeaderInfo){
    this.title = info.item.name;
    this.load$.next(info);
  }

  getLoad():Observable<FunctionHeaderInfo>{
    return this.load$.asObservable();
  }

  doSearch(key: string){
    this.search$.next(key);
  }

  getSearch(): Observable<string> {
    return this.search$.asObservable();
  }

  get title(): string { 
    return this._title; 
  }

  set title(title: string) {
    this._title = title;
    if (title !== '') {
      title = `${title} | ${this._originalTitle}`;
    } else {
      title = this._originalTitle;
    }
    this.bodyTitle.setTitle(title);
  }

  constructor(private bodyTitle: Title) {}
}

export abstract class FunctionBaseComponent implements OnDestroy{

  abstract get search() : boolean;

  abstract doSearch(key: string);

  private _destroyed = new Subject();

  constructor(_route: ActivatedRoute, _docItems: FunctionItems,_func: FunctionPageBar){

    // parent awaly is function ?
    _route.parent.url.pipe(takeUntil(this._destroyed)).subscribe(url => {
        console.log(url);
        if (url.length > 0){    
           _func.loading({item: _docItems.getItemById(url[0].path) ,search: this.search})
          if (this.search){
            _func.getSearch().pipe(takeUntil(this._destroyed)).subscribe(key => this.doSearch(key))
          }
        }else{
          throw new Error("path not found: " + url);
        }     
      });
  }
  
  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }




} 

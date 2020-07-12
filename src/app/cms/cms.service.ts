import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Article } from './schemas';
import { environment } from 'src/environments/environment';


@Injectable({providedIn: 'root'})
export class CmsService {

  constructor(private http: HttpClient){
  }

  public categorys():Observable<Category[]>{
    return this.http.get<Category[]>(`${environment.apiUrl}/little-cms-endpoint/category/tree`);
  }

  public addArticle(category: number,article: Article ):Observable<number>{
    return this.http.post<number>(`${environment.apiUrl}/little-cms-endpoint/mgr/category/${category}/article/add`,article)
  }
}
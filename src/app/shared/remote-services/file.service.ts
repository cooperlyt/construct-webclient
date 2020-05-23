import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class RemoteFileService{

  constructor(private httpClient: HttpClient){}

  public upload(data){

    return this.httpClient.post<any>(`${environment.fileUrl}upload/`,data,{
      headers: {"Content-Type" : data.type},
      reportProgress: true, observe: 'events'
    }).pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return {status: 'progress', message: progress};
        case HttpEventType.Response:
          return event.body;
        default:
          return `Unhandled event: ${event.type}`;
      }
    }))
  }
}
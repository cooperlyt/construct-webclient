
import { catchError, map, tap, switchMap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpParams } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { Task, ProcessDefinition, ProcessInstance, BusinessDocument, BusinessFile, BusinessDocumentBase } from './schemas';
import { environment } from 'src/environments/environment';
import { CustomEncoder } from '../shared/custom-encoder';
import { SseService } from '../tools/sse.service';

@Injectable({providedIn: 'root'})
export class CamundaRestService {
  private engineRestUrl = `${environment.apiUrl}/camundasvr/rest/`;
  

  constructor(private http: HttpClient,private sseService: SseService) {}

  claimTask(id:string, userId:string):Observable<any>{
    return this.http.post(`${this.engineRestUrl}task/${id}/claim`,{userId:userId});
  }

  unclaimTask(id:string):Observable<any>{
    return this.http.post(`${this.engineRestUrl}task/${id}/unclaim`,null);
  }

  getTask(id:string): Observable<Task>{
    return this.http.get<Task>(`${this.engineRestUrl}task/${id}`);
  }

  getProcessInstance(id:string):Observable<ProcessInstance>{
    return this.http.get<ProcessInstance>(`${this.engineRestUrl}process-instance/${id}`);
  }

  getProcessDefinitionById(id:string):Observable<ProcessDefinition>{
    return this.http.get<ProcessDefinition>(`${this.engineRestUrl}process-definition/${id}`);
  }

  getTasks(): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}task?sortBy=created&sortOrder=desc`; //&maxResults=10
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError("getTasks", []))
    );
  }

  getTaskFormKey(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched taskform`)),
      catchError(this.handleError("getTaskFormKey", []))
    );
  }

  getVariablesForTask(taskId: String, variableNames: String): Observable<any> {
    const endpoint = `${
      this.engineRestUrl
    }task/${taskId}/form-variables?variableNames=${variableNames}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched variables`)),
      catchError(this.handleError("getVariablesForTask", []))
    );
  }

  postCompleteTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/complete`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`posted complete task`)),
      catchError(this.handleError("postCompleteTask", []))
    );
  }

  getProcessDefinitionTaskKey(processDefinitionKey): Observable<any> {
    const url = `${
      this.engineRestUrl
    }process-definition/key/${processDefinitionKey}/startForm`;
    return this.http.get<any>(url).pipe(
      tap(form => this.log(`fetched formkey`)),
      catchError(this.handleError("getProcessDeifnitionFormKey", []))
    );
  }

  getProcessDefinitions(): Observable<ProcessDefinition[]> {
    return this.http
      .get<ProcessDefinition[]>(
        this.engineRestUrl + "process-definition?latestVersion=true"
      )
      .pipe(
        tap(processDefinitions => this.log(`fetched processDefinitions`)),
        catchError(this.handleError("getProcessDefinitions", []))
      );
  }

  postProcessInstance(processDefinitionKey, variables): Observable<any> {
    const endpoint = `${
      this.engineRestUrl
    }process-definition/key/${processDefinitionKey}/start`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError("postProcessInstance", []))
    );
  }

  deployProcess(fileToUpload: File): Observable<any> {
    const endpoint = `${this.engineRestUrl}deployment/create`;
    const formData = new FormData();

    formData.append("fileKey", fileToUpload, fileToUpload.name);

    return this.http.post(endpoint, formData);
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }



  //Adapter api
  private adapterRestUrl = `${environment.apiUrl}/camundasvr/adapter/`;

  getTaskExtensions(processDefinitionId: string , taskDefinitionKey: string , key: string):Observable<string>{
    const endpoint = `${this.adapterRestUrl}utils/define/process/${processDefinitionId}/task/${taskDefinitionKey}/extensions/${key}`;
    return this.http.get<string>(endpoint,{headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'});
  }

  //Business api

  getBusinessDocuments(businessId: number):Observable<BusinessDocument[]>{
    return this.http.get<BusinessDocument[]>(`${environment.apiUrl}/camundasvr/master/business/${businessId}/doc`);
  }

  editDocumentInfo(taskId:string, data: BusinessDocumentBase, docId?: number):Observable<BusinessDocument>{
    return this.http.post<BusinessDocument>(`${this.adapterRestUrl}task/${taskId}/doc/${docId ? docId + '/edit' : 'add' }`,data)
  }

  deleteDocument(taskId:string, docId:number):Observable<number>{
    return this.http.delete<number>(`${this.adapterRestUrl}task/${taskId}/doc/${docId}/del`, {headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'}).pipe(
      map(result => Number(result))
    );
  }

  deleteFile(taskId:string, fileId: string):Observable<string>{
    return this.http.delete<string>(`${this.adapterRestUrl}task/${taskId}/file/${fileId}/del`,{headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'});
  }

  sortFile(taskId: string, fileId: string, before?: string):Observable<any>{
    let params = new HttpParams({encoder: new CustomEncoder()});
    if (before){
        params = params.append('before',before);
    }

    return this.http.put(`${this.adapterRestUrl}task/${taskId}/file/${fileId}/order`,null,{params: params,headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'});
  }

  testFileEnent(id:number):Observable<any>{
    return this.http.get(`${environment.fileUrl}/camundasvr/publish/doc/${id}/file/add/test`,{headers: {"Accept" : "text/plain"},responseType: 'text' as 'json'})
  }


  getFileChangeEvent():Observable<any>{
    return this.sseService.getServerSentEvent(`${environment.apiUrl}/camundasvr/publish/stream/file`);
  }


  public upload(taskId:string, documentId:number, data:any):Observable<{status:string,progress?:number, file?: BusinessFile, message?: string }>{

    return this.http.post<any>(`${environment.fileUrl}/upload/`,data,{
      headers: {"Content-Type" :  !!data.type ? data.type : 'application/octet-stream'},
      reportProgress: true, observe: 'events'
    }).pipe(

      switchMap((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return of({status: 'progress', progress: progress});
        case HttpEventType.Response:
         console.log( );
          return this.http.post<BusinessFile>(
            `${this.adapterRestUrl}task/${taskId}/doc/${documentId}/file/add`,
            {id:event.body.fid,type:event.body.mime,size:event.body.size,extName:data.name.substr(data.name.lastIndexOf('.') + 1)}).pipe(
              map((file) => ({status: 'complete', file : file }))
            )
        default:
          return of({status: 'other',message: `Unhandled event: ${event.type}`}) ;
      }
    })
    
    )
  }

  
}

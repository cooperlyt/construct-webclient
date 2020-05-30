import { Input, OnInit, Component, NgModule, Injectable, ViewChild, Inject } from '@angular/core';
import { CamundaRestService } from '../camunda-rest.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessDocument, BusinessFile, BusinessDocumentBase } from '../schemas';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ConfirmDialogModule, ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OcticonModule } from 'src/app/tools/octicon/octicon.directive';
import { environment } from 'src/environments/environment';


import { FilePreviewModule, FilePreviewOverlayService, ContextNgxGalleryImage } from 'src/app/tools/file-preview/file-preview.component';
import { Subject, of, Subscription, forkJoin } from 'rxjs';
import { faFile, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { switchMap, catchError } from 'rxjs/operators';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

const applicationFileImg = 'data:image/png;base64,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';


class FileItem extends BusinessFile{

  constructor(file: BusinessFile){
    super();
    this.id = file.id;
    this.md5 = file.md5;
    this.size = file.size;
    this.type = file.type;
    this.time = file.time;
    this.extName = file.extName;
  }

  getThumbnailUrl(size: string): string{
    if (this.isImage){
      return `${environment.fileUrl}/img/${size}/${this.id}.${this.fileExt}`;
    }else{
      return applicationFileImg;
    }
  }

  get thumbnailUrl(): string{
    return this.getThumbnailUrl('480x320s');
  }

  get origUrl(): string{
    return this.getThumbnailUrl('orig'); 
  }

  get isImage():boolean{
    return this.type.startsWith("image/");
  }

  get isPdf(): boolean{
    return this.type === "application/pdf";
  }

  get url():string{
    return this.isImage ? this.origUrl : this.isPdf ? `${environment.fileUrl}/pdf/${this.id}.pdf` :  `${environment.fileUrl}/file/${this.id}.${this.fileExt}`;
  }

  get fileExt(): string{
    if (this.extName){
      return this.extName;
    }else{
      return (this.type.substr(this.type.lastIndexOf('/') + 1))
    }
  }

  get galleryImage():ContextNgxGalleryImage{
    return {id: this.id, 
      big: this.origUrl, 
      small: this.getThumbnailUrl('160x160'), 
      medium: this.getThumbnailUrl('480x320'),
      url: `${environment.fileUrl}file/${this.id}.${this.fileExt}`,
      description: this.isImage ? null : '文件无法预览,请下载后使用!'
    }
  }

  loadSize(event){
    this._width = event.target.naturalWidth;
    this._height = event.target.naturalHeight;
  }

  _width?:number;
  _height?:number;

  get width():number{
    if (this.isImage){
      return this._width;
    }else{
      return 100;
    }
  }

  get height():number{
    if (this.isImage){
      return this._height;
    }else{
      return 100;
    }
  }

}

class FileCategory extends BusinessDocumentBase{

  constructor(document: BusinessDocument){
    super();
    this.id = document.id;
    this.assign(document);
    this.need = document.need;
    this.files = [];
    this.uploading = [];
    document.files.forEach(file => {this.files.push(new FileItem(file))});
  }

  assign(document: BusinessDocumentBase):void{
    this.description = document.description;
    this.name = document.name;
    this.pageCount = document.pageCount;
  }

  files: FileItem[];
  uploading: UploadingFile[];

  get galleryImages():ContextNgxGalleryImage[]{
    return this.files.map(file => file.galleryImage)
  }

}

class UploadingFile{

  constructor(private _camundaService: CamundaRestService,  
    private subject: Subject<FileItem>,
    public docId:number,
    public file: any,
    taskId: string){
      this.upload(taskId);
  }

  error: string;
  progress: number = 0;
  status: string = 'progress';
  fid: string = '';


  upload(taskId: string){
    this._camundaService.upload(taskId, this.docId,  this.file).subscribe(
      (res) => {
        if (res.status === 'progress'){
          this.progress = res.progress;
        }else if (res.status == 'complete'){
          let fileItem = new FileItem(res.file);
          this.fid = fileItem.id;
          this.subject.next(fileItem)
        }
      },
      (err) => this.error = err
    );

  }

  get isImage():boolean{
    return this.file.type.startsWith("image/");
  }

}

@Component({selector: 'category-edit-dialog', templateUrl: './category-edit-dialog.html'})
export class CategoryEditDialogComponent {

  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<CategoryEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BusinessDocumentBase,
    private fb: FormBuilder){

      this.form = fb.group({
        id: [data.id],
        name:[data.name,[Validators.required,Validators.maxLength(512)]],
        description: [data.description,[Validators.maxLength(1024)]]
      })
  }

  get resultData(){
    return this.form.value;
  }

  onCancelClick():void{
    this.dialogRef.close();
  }

}


@Component({selector:"business-document-files", templateUrl:"./document-files.html" , styleUrls:["./document-files.scss"]})
export class BusinessDocumentFilesComponent implements OnInit{


  faFileDownload = faFileDownload;

  subs = new Subscription();

  @Input()
  businessId: number;

  @Input()
  taskId: string;

  @Input()
  editable: boolean;

  loadding: boolean = true;
  fileCategorys: FileCategory[] = [];




  //uploading: UploadingFile[] = [];

  private uploadSubject  = new Subject<FileItem>();


  selectedCategory:FileCategory = null;

  constructor(private _camundaService: CamundaRestService,
    private previewDialog: FilePreviewOverlayService,
    public dialog: MatDialog,
    private dragulaService: DragulaService,
    private _toastr: ToastrService,
    private sanitizer: DomSanitizer){
      this.uploadSubject.subscribe(file => {
        //this.uploading = this.uploading.filter(item => item.fid !== file.file.id);
        
        this.fileCategorys.forEach(category => {
          if (category.uploading.find(item => item.fid === file.id)){
           
            category.files.push(file);
            category.uploading = category.uploading.filter(fitem => fitem.fid !== file.id);
          }
        })
      })


    this.subs.add(dragulaService.dropModel("FILE_LIST")
      .subscribe(({sourceModel, targetModel, item}) => {
        const index = targetModel.indexOf(item);
        _camundaService.sortFile(this.taskId,item.id, (index <= 0) ? null : targetModel[index - 1].id)
        .pipe(catchError(err => { 
          _toastr.error('排序发生错误!');  
          this.ngOnInit();
          return of(null); }))
        .subscribe();
      })
    );

  }

  get noEmptyDocs(): FileCategory[]{
    return this.fileCategorys.filter(category => category.files.length > 0 || category.uploading.length > 0);
  }
  
  openPreview(id:string){

    if (this.selectedCategory){
      this.previewDialog.open({id:id,images:this.selectedCategory.galleryImages});
    }else{
      let allFile: ContextNgxGalleryImage[] = [];
      this.fileCategorys.forEach(category => allFile = allFile.concat(category.galleryImages));
      this.previewDialog.open({id:id,images:allFile})
    }        
  }

  ngOnInit(): void {
    this.loadding = true;
    this._camundaService.getBusinessDocuments(this.businessId).subscribe(
      data => { this.fileCategorys = data.map(doc => new FileCategory(doc)); this.loadding = false;}
    )
  }


  onDocumentSelected(id?:number){
    //this.galleryImages = [];
    if (id) {

      this.selectedCategory = this.fileCategorys.find(doc => doc.id === id);
      // this.selectedCategory.files.forEach(file => {
      //   this.galleryImages.push({big: file.origUrl, small: file.getThumbnailUrl('160x160'), medium: file.getThumbnailUrl('480x320'), label: this.selectedCategory.name , id: file.id,})
      // });
    }else{
      this.selectedCategory = null;
    }
  }



  // if (ev && ev.target && ev.target.files) {
  //   const file = ev.target.files[0];
  //   const img = new Image();
  //   img.onload = function() {
  //     alert('Width:' + this.width + '   Height: ' + this.height);
  //   };
  //   img.src = URL.createObjectURL(file);


  onFileChange(event) {

    if (event.target.files.length > 0) {
      for(let i=0 ; i< event.target.files.length; i++){
        this.selectedCategory.uploading.push(
          new UploadingFile(
            this._camundaService,
            this.uploadSubject,
            this.selectedCategory.id,
            event.target.files[i],
            this.taskId));
      }   
    }
  }

  private openCategoryEditDialog(data: BusinessDocumentBase){
    const dialogRef = this.dialog.open(CategoryEditDialogComponent,{width:'600px',disableClose: true,data: data});

  
    dialogRef.afterClosed().pipe(
    
      switchMap(result =>  !result ? of(result) : this._camundaService.editDocumentInfo(this.taskId,result,data.id) )
    ).subscribe(result =>{
      if (result){
        let originDoc =  this.fileCategorys.find(item => item.id === result.id);
        if (originDoc){
          originDoc.assign(result);
        }else{
          const category = new FileCategory(result);
          this.fileCategorys.push(category);
          this.selectedCategory = category;
        }
      }
    });
  }

  newCategory(){
    this.openCategoryEditDialog({name:''});
  }

  editCategory(){
    this.openCategoryEditDialog(this.selectedCategory)
  }

  delCategory(){
    this.dialog.open(ConfirmDialogComponent,{width: '400px', data: {title:'删除确认', description:'删除分类将同时删除此分类下的所有文件!',result: this.selectedCategory.id, confirm:this.selectedCategory.name}}).afterClosed().subscribe(result => {
      if (result){
        this._camundaService.deleteDocument(this.taskId,result).subscribe(docId => {
          const originDoc = this.fileCategorys.find(item => item.id === docId);
          const index = this.fileCategorys.indexOf(originDoc);
          if (index + 1 < this.fileCategorys.length){
            this.selectedCategory = this.fileCategorys[index + 1]
          }else if (index > 0) {
            this.selectedCategory = this.fileCategorys[index - 1]
          }else{
            this.selectedCategory = null;
          }
          this.fileCategorys = this.fileCategorys.filter(item => item.id !== docId);
        });
      }
    })
   
  }

  

  delFile(fid:string){
    this.dialog.open(ConfirmDialogComponent, {width: '400px', data: {title:'删除确认',description:'删除文件确认!',result: fid}}).afterClosed().subscribe(result => {
      if (result){
        this._camundaService.deleteFile(this.taskId,fid).subscribe(fid => {
          this.fileCategorys.forEach(item => {
            item.files = item.files.filter(file => file.id != result);
          })
        })
      }
    })
  }


  iframe:SafeResourceUrl;
  fileChangeListening: boolean = false;

  //TODO change application to local port
  connectListening(): void {
    this.fileChangeListening = true;
    this._camundaService.getFileChangeEvent().subscribe(
      message => {
        console.log(message); 
        let n : {doc: number, files: BusinessFile[]} = JSON.parse(message.data);
        let doc = this.fileCategorys.find(item => item.id === n.doc)
        if (doc){
          n.files.forEach(file => doc.files.push(new FileItem(file)));
        }
      },
      (err) => {
        console.log(err); 
        this.fileChangeListening = false;
      })

  }



  callCamera(){
    this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl("ExtendsCamera://-key='" + this.selectedCategory.id + "' -title='" + this.selectedCategory.name + "'");
    console.log("call camera:" + "ExtendsCamera://-key='" + this.selectedCategory.id + "' -title='" + this.selectedCategory.name + "'");
    if (!this.fileChangeListening){
      this.connectListening();
    }
  }

}

// @Injectable()
// export class HammerCustomConfig extends HammerGestureConfig {
//   overrides = { 'pinch': { enable: false }, 'rotate': { enable: false } } as any;
// }

@NgModule({
  imports:[
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    MatTableModule,
    MatProgressSpinnerModule,
    NgxUiLoaderModule,
    ConfirmDialogModule,
    MatSlideToggleModule,
    MatDialogModule,
    OcticonModule,
    FilePreviewModule,
    DragulaModule,
    MatButtonToggleModule
  ],
  declarations:[
    BusinessDocumentFilesComponent,
    CategoryEditDialogComponent,
  ],
  exports:[
    BusinessDocumentFilesComponent
  ],
  providers: [
    // config may be provided in module where needed or in app.module
    // {
    //   provide: HAMMER_GESTURE_CONFIG,
    //   useClass: HammerCustomConfig,
    // }
  ]
})
export class BusinessDocumentModule{}
import { Injectable, NgModule, ViewChild, InjectionToken, Injector, ComponentRef, Inject, OnInit } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Component, Input } from '@angular/core';
import { NgxGalleryModule, NgxGalleryComponent, NgxGalleryOptions, NgxGalleryImage } from '@kolkov/ngx-gallery';
import { CommonModule } from '@angular/common';
import 'hammerjs';
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

export declare class ContextNgxGalleryImage extends NgxGalleryImage{
  id: string;
}

export declare class ViewImage {
  id: string;
  images: ContextNgxGalleryImage[];
}

export const FILE_PREVIEW_DIALOG_DATA = new InjectionToken<ContextNgxGalleryImage[]>('FILE_PREVIEW_DIALOG_DATA')


export class FilePreviewOverlayRef {

  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.dispose();
  }
}


@Component({
  selector: 'file-preview-overlay',
  template: `<div class="gallery-wrapper"> <ngx-gallery class="ngx-gallery" (previewClose)="close()" [options]="galleryOptions" [images]="galleryImages" #onlyPreviewGallery></ngx-gallery></div>
  `
})
export class FilePreviewOverlayComponent { 
  @ViewChild('onlyPreviewGallery') 
  onlyPreviewGallery: NgxGalleryComponent;

  loading:boolean;

  galleryOptions: NgxGalleryOptions[] = [
    { "image": false, "thumbnails": false, "width": "0", "height": "0" ,"previewZoom": true, "previewRotate": true, "previewDownload": false, actions:[{icon:'fa fa-arrow-circle-down',onClick:this.downloadClick.bind(this)}]},
    { "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3 },
    { "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 },
  ];
  galleryImages: ContextNgxGalleryImage[];

  constructor(public dialogRef: FilePreviewOverlayRef,
    @Inject(FILE_PREVIEW_DIALOG_DATA) public image: ViewImage,
    private http: HttpClient){
      this.galleryImages = image.images;

    }


  ngAfterViewInit() {
    setTimeout(()=>{
      this.loading = true;
      if (this.loading == true) {
        this.showPreview();
      }
       },100);   
  }


  showPreview(){
    this.galleryImages.forEach(img => {if (img.id === this.image.id){
      this.onlyPreviewGallery.openPreview(this.galleryImages.indexOf(img));
      return;
    }});
  }

  close(){
    this.dialogRef.close();
  }

  private downloadUrl(url: string) {
    let a: any = document.createElement('a');
    a.href = url;
    a.download = 'aa.png';
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  };


  downloadClick(event: Event, index: number){

    let urlImage = this.galleryImages[index].url;
    this.downloadUrl(urlImage);
  }
  
}


@Injectable()
export class FilePreviewOverlayService {

  constructor(
    private injector: Injector,
    private overlay: Overlay) { }

  open(images: ViewImage) {
    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.overlay.create();
    const dialogRef = new FilePreviewOverlayRef(overlayRef);
        //overlayRef.backdropClick().subscribe(_ => dialogRef.close());

    const injectionTokens = new WeakMap();
    injectionTokens.set(FilePreviewOverlayRef, dialogRef);
    injectionTokens.set(FILE_PREVIEW_DIALOG_DATA, images);
    const injector = new PortalInjector(this.injector, injectionTokens);

    
    // Create ComponentPortal that can be attached to a PortalHost
    const filePreviewPortal = new ComponentPortal(FilePreviewOverlayComponent, null ,injector );


    // Attach ComponentPortal to PortalHost
    const containerRef: ComponentRef<FilePreviewOverlayComponent> = overlayRef.attach(filePreviewPortal);

    return containerRef.instance;
  }
}

@NgModule({
  imports:[
    NgxGalleryModule,
    CommonModule,
    HammerModule
  ],
  declarations:[
    FilePreviewOverlayComponent
  ],
  providers:[
    FilePreviewOverlayService
        // config may be provided in module where needed or in app.module
    // {
    //   provide: HAMMER_GESTURE_CONFIG,
    //   useClass: HammerCustomConfig,
    // }
  ],
  entryComponents:[
    FilePreviewOverlayComponent
  ]
})
export class FilePreviewModule {}
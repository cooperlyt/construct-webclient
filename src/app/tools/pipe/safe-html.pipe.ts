import { PipeTransform, Pipe, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
//import DOMPurify from 'dompurify';
@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) {}

 public transform(content: any): any {
    //  const sanitizedContent = DOMPurify.sanitize(value);
    //  return angular.bypassSecurityTrustHtml(sanitizedContent);
     return this.sanitizer.bypassSecurityTrustHtml(content);

  }
}


@NgModule({declarations:[SafeHtmlPipe], exports:[SafeHtmlPipe]})
export class SafeHtmlModule {}
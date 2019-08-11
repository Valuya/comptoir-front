import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'byPassSafeHtml'
})
export class ByPassSafeHtmlPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) {

  }

  transform(value: any, ...args: any[]): any {
    if (typeof value !== 'string') {
      return value;
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}

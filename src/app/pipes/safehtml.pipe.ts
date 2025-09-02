import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  standalone: true,
  name: "safehtml"
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html: string): unknown {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}

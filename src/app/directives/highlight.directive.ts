import {AfterViewInit, Directive, ElementRef, Input, OnDestroy} from "@angular/core";
import hljs from "highlight.js";

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective  implements AfterViewInit, OnDestroy {

  private observer: MutationObserver;

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    this.observer = new MutationObserver(() => {
      this.highlight();
    });

    this.observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
      characterData: true
    });

    this.highlight(); // Initial highlight when the view is initialized
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

  highlight() {
    const element = this.el.nativeElement;
    const codeElements = element.querySelectorAll('pre > code'); // Select all code elements inside pre tags
    // @ts-ignore
    codeElements.forEach((codeElement) => {
      hljs.highlightElement(codeElement);
    });
  }
}

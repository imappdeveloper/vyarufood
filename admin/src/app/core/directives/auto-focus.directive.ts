import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({ selector: '[autoFocus]', standalone: true })
export class AutoFocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.el.nativeElement.focus(), 0);
  }
}

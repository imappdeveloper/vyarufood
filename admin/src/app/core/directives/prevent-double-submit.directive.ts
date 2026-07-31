import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[preventDoubleSubmit]', standalone: true })
export class PreventDoubleSubmitDirective {
  private isSubmitting = false;

  @HostListener('submit', ['$event'])
  onSubmit(event: Event): void {
    if (this.isSubmitting) {
      event.preventDefault();
      return;
    }
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
    }, 3000);
  }
}

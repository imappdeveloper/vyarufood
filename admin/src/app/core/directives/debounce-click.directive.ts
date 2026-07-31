import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject, debounceTime, Subscription } from 'rxjs';

@Directive({ selector: '[debounceClick]', standalone: true })
export class DebounceClickDirective implements OnDestroy {
  @Input() debounceTime = 300;
  @Output() debounceClick = new EventEmitter<Event>();

  private clicks = new Subject<Event>();
  private subscription?: Subscription;

  constructor() {
    this.subscription = this.clicks
      .pipe(debounceTime(this.debounceTime))
      .subscribe((event) => this.debounceClick.emit(event));
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

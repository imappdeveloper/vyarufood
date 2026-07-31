import { Directive, ElementRef, OnDestroy, OnInit, input } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
  animation = input<string>('fade-up', { alias: 'appScrollAnimate' });
  delay = input<number>(0, { alias: 'animationDelay' });

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const el = this.el.nativeElement;

    el.style.opacity = '0';
    el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    el.style.transitionDelay = `${this.delay()}ms`;

    const anim = this.animation();
    if (anim === 'fade-up') {
      el.style.transform = 'translateY(20px)';
    } else if (anim === 'fade-left') {
      el.style.transform = 'translateX(-20px)';
    } else if (anim === 'fade-right') {
      el.style.transform = 'translateX(20px)';
    } else if (anim === 'scale') {
      el.style.transform = 'scale(0.95)';
    } else {
      el.style.transform = 'translateY(15px)';
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1';
            el.style.transform = 'translate(0) scale(1)';
            this.observer?.unobserve(el);
          }
        });
      },
      { threshold: 0.05, rootMargin: '50px 0px 0px 0px' }
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

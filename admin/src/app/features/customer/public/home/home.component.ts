import { Component, AfterViewInit, OnDestroy, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroSectionComponent } from './sections/hero-section.component';
import { SearchSectionComponent } from './sections/search-section.component';
import { CategorySectionComponent } from './sections/category-section.component';
import { SpecialsSectionComponent } from './sections/specials-section.component';
import { PopularSectionComponent } from './sections/popular-section.component';
import { HealthySectionComponent } from './sections/healthy-section.component';
import { PlansSectionComponent } from './sections/plans-section.component';
import { CookingAnimationComponent } from './sections/cooking-animation.component';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroSectionComponent,
    SearchSectionComponent,
    CategorySectionComponent,
    SpecialsSectionComponent,
    PopularSectionComponent,
    HealthySectionComponent,
    PlansSectionComponent,
    CookingAnimationComponent,
  ],
  styles: [`
    .home-container { overflow-x: clip; }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeSlideLeft {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeSlideRight {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    .anim-section {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .anim-section.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    .anim-section.anim-left {
      transform: translateX(-40px);
    }
    .anim-section.anim-left.is-visible {
      transform: translateX(0);
    }
    .anim-section.anim-right {
      transform: translateX(40px);
    }
    .anim-section.anim-right.is-visible {
      transform: translateX(0);
    }
    .anim-section.anim-scale {
      transform: scale(0.9);
    }
    .anim-section.anim-scale.is-visible {
      transform: scale(1);
    }

    .anim-delay-1 { transition-delay: 0.05s; }
    .anim-delay-2 { transition-delay: 0.1s; }
    .anim-delay-3 { transition-delay: 0.15s; }
    .anim-delay-4 { transition-delay: 0.2s; }
    .anim-delay-5 { transition-delay: 0.25s; }
    .anim-delay-6 { transition-delay: 0.3s; }
    .anim-delay-7 { transition-delay: 0.35s; }
    .anim-delay-8 { transition-delay: 0.4s; }
  `],
  template: `
    <div class="home-container bg-white">
      <app-hero-section />
      <div class="anim-section anim-left" #animSection><app-search-section /></div>
      <div class="anim-section anim-scale" #animSection><app-category-section /></div>
      <app-cooking-animation />
      <div class="anim-section" #animSection><app-specials-section /></div>
      <div class="anim-section anim-right" #animSection><app-popular-section /></div>
      <div class="anim-section" #animSection><app-healthy-section /></div>
      <div class="anim-section anim-scale" #animSection><app-plans-section /></div>
    </div>
  `,
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('animSection') animSections!: QueryList<ElementRef>;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    this.animSections.forEach((ref) => {
      this.observer!.observe(ref.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

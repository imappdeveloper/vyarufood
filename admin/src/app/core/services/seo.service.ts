import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private readonly appName = 'Vyaru Tiffin';

  init(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = inject(ActivatedRoute);
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary')
    ).subscribe(route => {
      const pageTitle = route.snapshot.data['title'] || '';
      const description = route.snapshot.data['description'] || '';

      this.title.setTitle(pageTitle ? `${pageTitle} | ${this.appName}` : this.appName);

      if (description) {
        this.meta.updateTag({ name: 'description', content: description });
      }

      this.meta.updateTag({ property: 'og:title', content: pageTitle ? `${pageTitle} | ${this.appName}` : this.appName });
      if (description) {
        this.meta.updateTag({ property: 'og:description', content: description });
      }
    });
  }

  setPageTitle(title: string, description?: string): void {
    this.title.setTitle(title ? `${title} | ${this.appName}` : this.appName);
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }
    this.meta.updateTag({ property: 'og:title', content: title ? `${title} | ${this.appName}` : this.appName });
  }

  setNoIndex(): void {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  clearNoIndex(): void {
    this.meta.removeTag('name="robots"');
  }
}

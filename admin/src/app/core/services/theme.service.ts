import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>(this.getStoredTheme());

  readonly theme$: Observable<string> = this.themeSubject.asObservable();

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.themeSubject.next(newTheme);
    localStorage.setItem('tiffin_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }

  private getStoredTheme(): string {
    const stored = localStorage.getItem('tiffin_theme');
    if (stored) {
      document.documentElement.classList.toggle('dark', stored === 'dark');
      return stored;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
    return prefersDark ? 'dark' : 'light';
  }
}

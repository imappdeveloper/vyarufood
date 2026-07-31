import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = 0;
  private loadingSignal = signal<boolean>(false);

  get isLoading(): boolean {
    return this.loadingSignal();
  }

  show(): void {
    this.loadingCount++;
    this.loadingSignal.set(true);
  }

  hide(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      this.loadingSignal.set(false);
    }
  }
}

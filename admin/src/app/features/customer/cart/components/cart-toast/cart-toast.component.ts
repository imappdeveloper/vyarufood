import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CartStateService } from '../../../../../core/services/cart-state.service';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Component({
  selector: 'app-cart-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div style="position: fixed; top: 1rem; right: 1rem; z-index: 100; display: flex; flex-direction: column; gap: 0.5rem; max-width: 24rem;">
      @for (toast of toasts; track toast.id) {
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 0.75rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15); font-size: 0.85rem; font-weight: 500; animation: slideIn 0.3s ease-out; color: white;"
          [style.background]="toast.type === 'success' ? '#16a34a' : toast.type === 'error' ? '#dc2626' : '#2563eb'">
          <span class="material-icons" style="font-size: 1.15rem;">
            {{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}
          </span>
          <span style="flex: 1;">{{ toast.message }}</span>
          <button (click)="removeToast(toast.id)"
            style="background: transparent; border: none; color: white; opacity: 0.7; cursor: pointer; padding: 0; display: flex; transition: opacity 0.2s;"
            onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
            <span class="material-icons" style="font-size: 1rem;">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `],
})
export class CartToastComponent implements OnInit, OnDestroy {
  private cartState = inject(CartStateService);
  private destroy$ = new Subject<void>();
  toasts: Toast[] = [];
  private nextId = 0;

  ngOnInit(): void {
    this.cartState.toasts$.pipe(takeUntil(this.destroy$)).subscribe(toast => {
      const id = this.nextId++;
      this.toasts.push({ ...toast, id });
      setTimeout(() => this.removeToast(id), 4000);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}

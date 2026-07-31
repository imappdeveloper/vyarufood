import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStateService } from '../../../../../core/services/cart-state.service';
import { AppStateService } from '../../../../../core/services/app-state.service';

@Component({
  selector: 'app-wallet-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (appState.isLoggedIn() && appState.walletBalance() > 0) {
      <div style="background: white; border-radius: 0.75rem; border: 1px solid #f1f5f9; padding: 1rem; margin-top: 0.75rem;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 2.5rem; height: 2.5rem; background: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #2563eb; font-size: 1.2rem;">account_balance_wallet</span>
            </div>
            <div>
              <p style="font-size: 0.85rem; font-weight: 500; color: #111827; margin: 0;">Wallet Balance</p>
              <p style="font-size: 0.7rem; color: #6b7280; margin: 0;">&#8377;{{ appState.walletBalance() | number:'1.2-2' }} available</p>
            </div>
          </div>

          @if (cartState.walletAmount() > 0) {
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 500; color: #2563eb;">-&#8377;{{ cartState.walletAmount() | number:'1.2-2' }} applied</span>
              <button (click)="cartState.removeWallet()"
                [disabled]="cartState.updating()"
                style="font-size: 0.7rem; color: #ef4444; background: transparent; border: none; cursor: pointer; font-weight: 500; padding: 0.2rem 0.4rem; border-radius: 0.25rem; transition: all 0.2s;"
                onmouseover="this.style.background='#fef2f2'; this.style.color='#dc2626'"
                onmouseout="this.style.background='transparent'; this.style.color='#ef4444'">
                Remove
              </button>
            </div>
          } @else {
            <button (click)="cartState.applyWallet()"
              [disabled]="cartState.updating() || cartState.totalAmount() <= 0"
              style="padding: 0.4rem 0.75rem; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; font-size: 0.75rem; font-weight: 500; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.25rem;"
              onmouseover="this.style.background='linear-gradient(135deg, #1d4ed8, #2563eb)'"
              onmouseout="this.style.background='linear-gradient(135deg, #2563eb, #3b82f6)'">
              @if (cartState.updating()) {
                <span class="material-icons" style="font-size: 0.85rem; animation: spin 1s linear infinite;">refresh</span>
              } @else {
                Apply Max
              }
            </button>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
})
export class WalletSectionComponent {
  cartState = inject(CartStateService);
  appState = inject(AppStateService);
}

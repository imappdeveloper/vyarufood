import { Component, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppStateService } from '../../../../../core/services/app-state.service';

@Component({
  selector: 'app-mobile-bottom-nav',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="bottom-nav" [class.hidden]="!isMobile()" aria-label="Mobile navigation">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
        class="nav-item" aria-label="Home">
        <span class="material-icons nav-icon">home</span>
        <span class="nav-label">Home</span>
      </a>
      <a routerLink="/meals" routerLinkActive="active" class="nav-item" aria-label="Meals">
        <span class="material-icons nav-icon">restaurant_menu</span>
        <span class="nav-label">Meals</span>
      </a>
      <a routerLink="/cart" routerLinkActive="active" class="nav-item" aria-label="Cart">
        <span class="nav-icon-wrap">
          <span class="material-icons nav-icon">shopping_cart</span>
          @if (cartCount() > 0) {
            <span class="cart-badge">{{ cartCount() > 99 ? '99+' : cartCount() }}</span>
          }
        </span>
        <span class="nav-label">Cart</span>
      </a>
      <a routerLink="/customer/orders" routerLinkActive="active" class="nav-item" aria-label="Orders">
        <span class="material-icons nav-icon">receipt_long</span>
        <span class="nav-label">Orders</span>
      </a>
      <a routerLink="/customer/profile" routerLinkActive="active" class="nav-item" aria-label="Profile">
        <span class="material-icons nav-icon">person</span>
        <span class="nav-label">Profile</span>
      </a>
    </nav>
  `,
  styles: [`
    :host { display: contents; }

    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      padding-bottom: env(safe-area-inset-bottom);
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid #e2e8f0;
      box-shadow: 0 -6px 24px rgba(15, 23, 42, 0.07);
      display: flex;
      align-items: center;
      justify-content: space-around;
      z-index: 90;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      flex: 1;
      height: 100%;
      text-decoration: none;
      color: #94a3b8;
      position: relative;
      transition: color 0.2s;
    }

    .nav-icon {
      font-size: 23px;
      line-height: 1;
      transition: transform 0.2s;
    }

    .nav-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.2px;
    }

    .nav-item.active {
      color: #059669;
    }
    .nav-item.active .nav-icon {
      transform: translateY(-1px) scale(1.05);
    }
    .nav-item.active::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 32px;
      height: 3px;
      border-radius: 0 0 6px 6px;
      background: linear-gradient(90deg, #059669, #10b981);
    }

    .nav-icon-wrap {
      position: relative;
      display: flex;
    }
    .cart-badge {
      position: absolute;
      top: -6px;
      right: -10px;
      background: #ef4444;
      color: white;
      font-size: 9px;
      font-weight: 800;
      border-radius: 999px;
      min-width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
    }

    @media (min-width: 1024px) {
      .bottom-nav { display: none; }
    }
  `],
})
export class MobileBottomNavComponent implements OnInit, OnDestroy {
  private appState = inject(AppStateService);

  isMobile = signal(typeof window !== 'undefined' && window.innerWidth < 1024);

  cartCount = this.appState.cartCount;

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile.set(window.innerWidth < 1024);
  }

  ngOnInit(): void {
    this.isMobile.set(window.innerWidth < 1024);
  }

  ngOnDestroy(): void {}
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 0;">
      <!-- Hero Welcome Header -->
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
        <div style="position: absolute; bottom: -60px; left: 30%; width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
        <div style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; font-weight: 500; letter-spacing: 0.5px; margin: 0 0 4px 0;">WELCOME BACK</p>
            <h1 style="color: #fff; font-size: 28px; font-weight: 700; margin: 0 0 6px 0;">Your Dashboard</h1>
            <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0;">Track orders, manage subscriptions &amp; more</p>
          </div>
          <a routerLink="/meals" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: #fff; color: #059669; font-weight: 600; font-size: 14px; border-radius: 12px; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
            <span class="material-icons" style="font-size: 20px;">local_dining</span> Order Now
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px;">
        @for (stat of stats; track stat.label; let i = $index) {
          <div style="background: #fff; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; transition: all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: {{ stat.bg }};">
                <span class="material-icons" style="font-size: 20px; color: {{ stat.iconColor }};">{{ stat.icon }}</span>
              </div>
              <span style="font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; background: {{ stat.badgeBg }}; color: {{ stat.badgeColor }};">{{ stat.badge }}</span>
            </div>
            <p style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 2px 0;">{{ stat.value }}</p>
            <p style="font-size: 13px; color: #6b7280; margin: 0;">{{ stat.label }}</p>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 28px;">
        <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
          <span class="material-icons" style="font-size: 20px; color: #059669;">flash_on</span> Quick Actions
        </h2>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
          <a routerLink="/meals" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; background: #f0fdf4; border-radius: 14px; text-decoration: none; cursor: pointer; transition: all 0.2s; border: 1px solid transparent;" onmouseover="this.style.borderColor='#059669';this.style.background='#ecfdf5';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='transparent';this.style.background='#f0fdf4';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #059669; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #fff; font-size: 22px;">restaurant_menu</span>
            </div>
            <span style="font-size: 12px; font-weight: 600; color: #065f46;">Browse Meals</span>
          </a>
          <a routerLink="/orders" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; background: #eff6ff; border-radius: 14px; text-decoration: none; cursor: pointer; transition: all 0.2s; border: 1px solid transparent;" onmouseover="this.style.borderColor='#3b82f6';this.style.background='#eff6ff';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='transparent';this.style.background='#eff6ff';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #3b82f6; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #fff; font-size: 22px;">receipt_long</span>
            </div>
            <span style="font-size: 12px; font-weight: 600; color: #1e40af;">My Orders</span>
          </a>
          <a routerLink="/subscriptions" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; background: #fefce8; border-radius: 14px; text-decoration: none; cursor: pointer; transition: all 0.2s; border: 1px solid transparent;" onmouseover="this.style.borderColor='#ca8a04';this.style.background='#fefce8';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='transparent';this.style.background='#fefce8';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #ca8a04; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #fff; font-size: 22px;">card_membership</span>
            </div>
            <span style="font-size: 12px; font-weight: 600; color: #854d0e;">Subscriptions</span>
          </a>
          <a routerLink="/wallet" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; background: #f5f3ff; border-radius: 14px; text-decoration: none; cursor: pointer; transition: all 0.2s; border: 1px solid transparent;" onmouseover="this.style.borderColor='#7c3aed';this.style.background='#f5f3ff';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='transparent';this.style.background='#f5f3ff';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #7c3aed; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #fff; font-size: 22px;">account_balance_wallet</span>
            </div>
            <span style="font-size: 12px; font-weight: 600; color: #4c1d95;">Wallet</span>
          </a>
        </div>
      </div>

      <!-- Bottom Grid: Recent Orders + Active Subscription -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px;">
        <!-- Recent Orders -->
        <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
              <span class="material-icons" style="font-size: 20px; color: #059669;">receipt_long</span> Recent Orders
            </h2>
            <a routerLink="/orders" style="font-size: 13px; color: #059669; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 4px;" onmouseover="this.style.color='#047857'" onmouseout="this.style.color='#059669'">
              View All <span class="material-icons" style="font-size: 16px;">arrow_forward</span>
            </a>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; padding: 24px 0; text-align: center;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #f0fdf4; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
              <span class="material-icons" style="font-size: 28px; color: #059669;">shopping_bag</span>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">No recent orders yet</p>
            <p style="font-size: 12px; color: #9ca3af; margin: 0 0 16px 0;">Your order history will appear here</p>
            <a routerLink="/meals" style="display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; background: #059669; color: #fff; font-size: 13px; font-weight: 600; border-radius: 10px; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
              <span class="material-icons" style="font-size: 16px;">add_shopping_cart</span> Order Now
            </a>
          </div>
        </div>

        <!-- Active Subscription -->
        <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0; display: flex; align-items: center; gap: 8px;">
              <span class="material-icons" style="font-size: 20px; color: #059669;">card_membership</span> Active Subscription
            </h2>
            <a routerLink="/subscriptions" style="font-size: 13px; color: #059669; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 4px;" onmouseover="this.style.color='#047857'" onmouseout="this.style.color='#059669'">
              View Plans <span class="material-icons" style="font-size: 16px;">arrow_forward</span>
            </a>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; padding: 24px 0; text-align: center;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #fefce8; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
              <span class="material-icons" style="font-size: 28px; color: #ca8a04;">card_membership</span>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">No active subscription</p>
            <p style="font-size: 12px; color: #9ca3af; margin: 0 0 16px 0;">Subscribe to save more on every meal</p>
            <a routerLink="/subscriptions" style="display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; background: #ca8a04; color: #fff; font-size: 13px; font-weight: 600; border-radius: 10px; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='#a16207';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#ca8a04';this.style.transform=''">
              <span class="material-icons" style="font-size: 16px;">subscriptions</span> Subscribe Now
            </a>
          </div>
        </div>
      </div>

      <!-- Support Card -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-radius: 16px; padding: 24px; border: 1px solid #d1fae5; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 14px; background: #059669; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="color: #fff; font-size: 24px;">headset_mic</span>
          </div>
          <div>
            <p style="font-size: 14px; font-weight: 600; color: #065f46; margin: 0 0 2px 0;">Need help with your order?</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">Our support team is here to help you 24/7</p>
          </div>
        </div>
        <a routerLink="/contact" style="display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; background: #059669; color: #fff; font-size: 13px; font-weight: 600; border-radius: 10px; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
          <span class="material-icons" style="font-size: 16px;">support_agent</span> Contact Support
        </a>
      </div>
    </div>
  `,
  styles: [`
    @media (max-width: 768px) {
      :host > div > div:nth-child(2) { grid-template-columns: repeat(2, 1fr) !important; }
      :host > div > div:nth-child(3) > div { grid-template-columns: repeat(2, 1fr) !important; }
      :host > div > div:nth-child(4) { grid-template-columns: 1fr !important; }
    }
  `]
})
export class DashboardComponent {
  private router = inject(Router);

  stats = [
    { icon: 'receipt_long', label: 'Total Orders', value: '0', badge: 'All time', bg: '#f0fdf4', iconColor: '#059669', badgeBg: '#f0fdf4', badgeColor: '#059669' },
    { icon: 'card_membership', label: 'Active Subscriptions', value: '0', badge: 'Active', bg: '#fefce8', iconColor: '#ca8a04', badgeBg: '#fefce8', badgeColor: '#ca8a04' },
    { icon: 'account_balance_wallet', label: 'Wallet Balance', value: '₹0', badge: 'Available', bg: '#f0fdf4', iconColor: '#059669', badgeBg: '#dcfce7', badgeColor: '#166534' },
    { icon: 'star', label: 'Reviews Given', value: '0', badge: 'Total', bg: '#fef2f2', iconColor: '#ef4444', badgeBg: '#fef2f2', badgeColor: '#ef4444' },
  ];
}

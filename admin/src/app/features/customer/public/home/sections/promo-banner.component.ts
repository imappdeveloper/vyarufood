import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section style="max-width: 80rem; margin: 0 auto; padding: 1.5rem 1rem;" aria-label="Promotional offer">
      <div style="position: relative; overflow: hidden; border-radius: 1rem; background: linear-gradient(135deg, #059669, #0d9488, #0891b2); box-shadow: 0 16px 48px rgba(13,148,136,0.18);">
        <!-- Decorative blurs -->
        <div style="position: absolute; inset: 0; opacity: 0.08; pointer-events: none;">
          <div style="position: absolute; top: -3rem; right: -3rem; width: 14rem; height: 14rem; background: #fff; border-radius: 50%; filter: blur(50px);"></div>
          <div style="position: absolute; bottom: -4rem; left: 20%; width: 12rem; height: 12rem; background: #facc15; border-radius: 50%; filter: blur(50px);"></div>
        </div>

        <div style="position: relative; z-index: 10; display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem; padding: 1.5rem 2rem;">
          <!-- Left: text + buttons -->
          <div style="flex: 1; min-width: 18rem; color: #fff;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.15rem 0.625rem; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); border-radius: 9999px; font-size: 0.65rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.2); animation: promoSlideIn 0.6s ease-out;">
                <span class="material-icons" style="font-size: 12px; color: #facc15;">local_offer</span> Limited Time
              </span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.375rem; animation: promoSlideIn 0.6s ease-out 0.1s both;">
              Get <span style="color: #facc15;">20% OFF</span> on First Subscription
            </h2>
            <p style="color: rgba(255,255,255,0.85); font-size: 0.8rem; line-height: 1.5; margin-bottom: 1rem; animation: promoSlideIn 0.6s ease-out 0.2s both;">
              Fresh homestyle meals delivered to your doorstep with zero delivery charges.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; animation: promoSlideIn 0.6s ease-out 0.3s both;">
              <a routerLink="/subscriptions"
                 style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.625rem 1.25rem; background: #fff; color: #0f172a; font-weight: 600; font-size: 0.8rem; border-radius: 0.625rem; text-decoration: none; box-shadow: 0 4px 16px rgba(0,0,0,0.12); transition: all 0.3s ease;"
                 onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.18)';"
                 onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)';">
                <span class="material-icons" style="font-size: 18px;">card_membership</span> View Plans
              </a>
              <a routerLink="/meals"
                 style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.625rem 1.25rem; border: 1.5px solid rgba(255,255,255,0.3); color: #fff; font-weight: 600; font-size: 0.8rem; border-radius: 0.625rem; text-decoration: none; transition: all 0.3s ease;"
                 onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='rgba(255,255,255,0.5)';"
                 onmouseout="this.style.background='transparent'; this.style.borderColor='rgba(255,255,255,0.3)';">
                <span class="material-icons" style="font-size: 18px;">restaurant_menu</span> Browse
              </a>
            </div>
          </div>

          <!-- Right: visual -->
          <div style="flex-shrink: 0; display: flex; align-items: center; gap: 1rem; animation: promoSlideRight 0.7s ease-out 0.2s both;">
            <div style="position: relative;">
              <div style="width: 7rem; height: 7rem; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.15); animation: float 3s ease-in-out infinite;">
                <span style="font-size: 3rem;">&#127859;</span>
              </div>
              <div style="position: absolute; top: -0.375rem; right: -0.5rem; background: #facc15; color: #1e293b; border-radius: 0.5rem; padding: 0.25rem 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.2); animation: promoPop 0.5s ease-out 0.5s both;">
                <p style="font-size: 0.55rem; font-weight: 700; margin: 0; line-height: 1;">CODE</p>
                <p style="font-size: 0.8rem; font-weight: 800; letter-spacing: 0.05em; margin: 0; line-height: 1.2;">FIRST20</p>
              </div>
              <div style="position: absolute; bottom: -0.25rem; left: -0.75rem; background: #fff; border-radius: 0.5rem; padding: 0.25rem 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.12); display: flex; align-items: center; gap: 0.25rem; animation: promoPop 0.5s ease-out 0.6s both;">
                <span class="material-icons" style="color: #22c55e; font-size: 14px;">check_circle</span>
                <span style="font-size: 0.65rem; font-weight: 700; color: #334155;">Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes promoSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes promoSlideRight {
      from { opacity: 0; transform: translateX(20px) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes promoPop {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
  `],
})
export class PromoBannerComponent {}

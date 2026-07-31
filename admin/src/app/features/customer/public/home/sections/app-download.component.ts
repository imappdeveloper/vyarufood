import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-download',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding: 3.5rem 1rem;" aria-label="Download our app">
      <div style="max-width: 80rem; margin: 0 auto;">
        <div style="position: relative; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.12); background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);">

          <!-- Decorative background elements -->
          <div style="position: absolute; inset: 0; pointer-events: none; overflow: hidden;">
            <div style="position: absolute; top: -6rem; left: -4rem; width: 16rem; height: 16rem; background: radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -4rem; right: -3rem; width: 12rem; height: 12rem; background: radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
            <!-- Subtle dot grid pattern -->
            <div style="position: absolute; inset: 0; opacity: 0.03; background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 24px 24px;"></div>
          </div>

          <div style="position: relative; z-index: 10; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; padding: 2.5rem;">

            <!-- Left: Content -->
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.25rem 0.75rem; background: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.2); border-radius: 9999px; margin-bottom: 1rem; animation: appSlideIn 0.6s ease-out;">
                <span class="material-icons" style="font-size: 14px; color: #fb923c;">new_releases</span>
                <span style="color: #fb923c; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">Coming Soon</span>
              </div>

              <h2 style="font-size: 1.75rem; font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 0.75rem; animation: appSlideIn 0.6s ease-out 0.1s both;">
                Get the<br>
                <span style="background: linear-gradient(135deg, #059669, #16a34a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Vyaru Tiffin</span> App
              </h2>

              <p style="color: #94a3b8; font-size: 0.82rem; line-height: 1.6; margin-bottom: 1.5rem; max-width: 24rem; animation: appSlideIn 0.6s ease-out 0.2s both;">
                Order meals, manage subscriptions, track deliveries, and more — all from your phone.
              </p>

              <!-- Store buttons -->
              <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; animation: appSlideIn 0.6s ease-out 0.3s both;">
                <button style="display: inline-flex; align-items: center; gap: 0.625rem; padding: 0.75rem 1.25rem; background: #fff; color: #0f172a; border: none; border-radius: 0.75rem; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.15); transition: all 0.3s ease;"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)';"
                        onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)';">
                  <span class="material-icons" style="font-size: 1.5rem; color: #22c55e;">android</span>
                  <div style="text-align: left;">
                    <p style="font-size: 0.55rem; color: #64748b; margin: 0; line-height: 1;">GET IT ON</p>
                    <p style="font-size: 0.8rem; font-weight: 700; margin: 0; line-height: 1.3;">Google Play</p>
                  </div>
                </button>
                <button style="display: inline-flex; align-items: center; gap: 0.625rem; padding: 0.75rem 1.25rem; background: #fff; color: #0f172a; border: none; border-radius: 0.75rem; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.15); transition: all 0.3s ease;"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)';"
                        onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)';">
                  <span class="material-icons" style="font-size: 1.5rem; color: #0f172a;">phone_iphone</span>
                  <div style="text-align: left;">
                    <p style="font-size: 0.55rem; color: #64748b; margin: 0; line-height: 1;">Download on the</p>
                    <p style="font-size: 0.8rem; font-weight: 700; margin: 0; line-height: 1.3;">App Store</p>
                  </div>
                </button>
              </div>

              <!-- Stats row -->
              <div style="display: flex; gap: 1.5rem; animation: appSlideIn 0.6s ease-out 0.4s both;">
                <div>
                  <p style="font-size: 1.1rem; font-weight: 800; color: #059669; margin: 0;">4.8</p>
                  <div style="display: flex; gap: 1px; margin: 0.125rem 0;">
                    <span class="material-icons" style="font-size: 10px; color: #facc15;">star</span>
                    <span class="material-icons" style="font-size: 10px; color: #facc15;">star</span>
                    <span class="material-icons" style="font-size: 10px; color: #facc15;">star</span>
                    <span class="material-icons" style="font-size: 10px; color: #facc15;">star</span>
                    <span class="material-icons" style="font-size: 10px; color: #facc15;">star_half</span>
                  </div>
                  <p style="font-size: 0.6rem; color: #64748b; margin: 0;">App Rating</p>
                </div>
                <div style="width: 1px; background: rgba(255,255,255,0.08);"></div>
                <div>
                  <p style="font-size: 1.1rem; font-weight: 800; color: #059669; margin: 0;">5K+</p>
                  <p style="font-size: 0.6rem; color: #64748b; margin: 0;">Downloads</p>
                </div>
                <div style="width: 1px; background: rgba(255,255,255,0.08);"></div>
                <div>
                  <p style="font-size: 1.1rem; font-weight: 800; color: #059669; margin: 0;">24/7</p>
                  <p style="font-size: 0.6rem; color: #64748b; margin: 0;">Support</p>
                </div>
              </div>
            </div>

            <!-- Right: Phone mockup -->
            <div style="display: flex; justify-content: center; align-items: center;" class="app-phone-wrap">
              <div style="position: relative; animation: appSlideRight 0.7s ease-out 0.2s both;">
                <!-- Phone body -->
                <div style="width: 13rem; height: 22rem; background: linear-gradient(145deg, #1e293b, #334155); border-radius: 2rem; padding: 0.375rem; box-shadow: 0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);">
                  <div style="width: 100%; height: 100%; background: linear-gradient(160deg, #059669, #16a34a, #22c55e); border-radius: 1.625rem; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <!-- Status bar -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; color: rgba(255,255,255,0.8); font-size: 0.55rem; font-weight: 600; z-index: 10;">
                      <span>9:41</span>
                      <div style="display: flex; gap: 0.25rem; align-items: center;">
                        <span class="material-icons" style="font-size: 10px;">signal_cellular_alt</span>
                        <span class="material-icons" style="font-size: 10px;">wifi</span>
                        <span class="material-icons" style="font-size: 10px;">battery_full</span>
                      </div>
                    </div>
                    <!-- App content preview -->
                    <div style="text-align: center; color: #fff; padding: 1.5rem;">
                      <div style="width: 3.5rem; height: 3.5rem; background: rgba(255,255,255,0.15); border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1);">
                        <span class="material-icons" style="font-size: 1.75rem;">restaurant_menu</span>
                      </div>
                      <p style="font-size: 0.85rem; font-weight: 800; margin-bottom: 0.25rem;">Vyaru Tiffin</p>
                      <p style="font-size: 0.55rem; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem;">Homestyle Meals Delivered</p>
                      <!-- Mini food cards -->
                      <div style="display: flex; gap: 0.375rem; justify-content: center;">
                        <div style="width: 2.75rem; height: 2.75rem; background: rgba(255,255,255,0.12); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.08);">
                          <span style="font-size: 1rem;">&#127834;</span>
                        </div>
                        <div style="width: 2.75rem; height: 2.75rem; background: rgba(255,255,255,0.12); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.08);">
                          <span style="font-size: 1rem;">&#127835;</span>
                        </div>
                        <div style="width: 2.75rem; height: 2.75rem; background: rgba(255,255,255,0.12); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.08);">
                          <span style="font-size: 1rem;">&#127857;</span>
                        </div>
                      </div>
                    </div>
                    <!-- Bottom nav -->
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 0.625rem 1.5rem 0.875rem; display: flex; justify-content: space-around; background: rgba(0,0,0,0.2); backdrop-filter: blur(10px);">
                      <span class="material-icons" style="font-size: 16px; color: #fff;">home</span>
                      <span class="material-icons" style="font-size: 16px; color: rgba(255,255,255,0.5);">search</span>
                      <span class="material-icons" style="font-size: 16px; color: rgba(255,255,255,0.5);">shopping_cart</span>
                      <span class="material-icons" style="font-size: 16px; color: rgba(255,255,255,0.5);">person</span>
                    </div>
                    <!-- Notch -->
                    <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 5rem; height: 1.125rem; background: #1e293b; border-radius: 0 0 1rem 1rem;"></div>
                  </div>
                </div>

                <!-- Floating badges -->
                <div style="position: absolute; top: 2rem; -right: 1rem; background: #fff; border-radius: 0.75rem; padding: 0.5rem 0.75rem; box-shadow: 0 8px 24px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 0.375rem; animation: appBadgeFloat 3s ease-in-out infinite;">
                  <div style="width: 1.5rem; height: 1.5rem; background: rgba(34,197,94,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span class="material-icons" style="font-size: 14px; color: #22c55e;">notifications_active</span>
                  </div>
                  <span style="font-size: 0.65rem; font-weight: 700; color: #1e293b; white-space: nowrap;">Order Updates</span>
                </div>

                <div style="position: absolute; bottom: 4rem; -left: 1rem; background: #fff; border-radius: 0.75rem; padding: 0.5rem 0.75rem; box-shadow: 0 8px 24px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 0.375rem; animation: appBadgeFloat 3s ease-in-out 1s infinite;">
                  <div style="width: 1.5rem; height: 1.5rem; background: rgba(249,115,22,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span class="material-icons" style="font-size: 14px; color: #f97316;">local_shipping</span>
                  </div>
                  <span style="font-size: 0.65rem; font-weight: 700; color: #1e293b; white-space: nowrap;">Live Tracking</span>
                </div>

                <div style="position: absolute; bottom: 1rem; right: -0.5rem; background: linear-gradient(135deg, #059669, #16a34a); border-radius: 0.75rem; padding: 0.5rem 0.75rem; box-shadow: 0 8px 24px rgba(5,150,105,0.3); display: flex; align-items: center; gap: 0.375rem; animation: appBadgeFloat 3s ease-in-out 2s infinite;">
                  <span class="material-icons" style="font-size: 14px; color: #fff;">schedule</span>
                  <span style="font-size: 0.65rem; font-weight: 700; color: #fff; white-space: nowrap;">30 min delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes appSlideIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes appSlideRight {
      from { opacity: 0; transform: translateX(30px) scale(0.95); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes appBadgeFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @media (max-width: 640px) {
      .app-phone-wrap { display: none !important; }
    }
    @media (min-width: 641px) and (max-width: 1023px) {
      .app-phone-wrap { display: none !important; }
    }
  `],
})
export class AppDownloadComponent {}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-public-loading',
  standalone: true,
  template: `
    <div class="loader-wrap">
      <div class="loader-inner">
        <div class="icon-ring">
          <div class="icon-badge">
            <svg class="lunchbox" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <g class="steam" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round">
                <path d="M30 24 Q26 16 30 7" />
                <path d="M50 20 Q46 12 50 3" />
                <path d="M70 24 Q66 16 70 7" />
              </g>
              <g transform="rotate(-28 50 34)" class="lid">
                <rect x="18" y="26" width="64" height="16" rx="6" fill="#fbbf24" />
                <rect x="42" y="21" width="16" height="7" rx="3.5" fill="#f59e0b" />
              </g>
              <g class="box">
                <rect x="14" y="48" width="72" height="34" rx="9" fill="#059669" />
                <rect x="14" y="48" width="72" height="12" rx="6" fill="#047857" />
                <rect x="14" y="68" width="72" height="7" fill="#047857" opacity="0.35" />
                <path d="M32 48 v-9 a6 6 0 0 1 12 0 v9" fill="none" stroke="#047857" stroke-width="4" stroke-linecap="round" />
                <path d="M56 48 v-9 a6 6 0 0 1 12 0 v9" fill="none" stroke="#047857" stroke-width="4" stroke-linecap="round" />
                <rect x="21" y="52" width="6" height="16" rx="3" fill="#ffffff" opacity="0.18" />
              </g>
            </svg>
          </div>
        </div>

        <div class="brand">Vyaru<span class="brand-accent">Food</span> &amp; Tiffin Service</div>

        <p class="tagline">{{ message() }}</p>

        <div class="dots" aria-hidden="true">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loader-wrap {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.82);
      -webkit-backdrop-filter: blur(14px) saturate(140%);
      backdrop-filter: blur(14px) saturate(140%);
    }

    .loader-inner {
      text-align: center;
      max-width: 360px;
      width: 100%;
    }

    .icon-ring {
      width: 118px;
      height: 118px;
      margin: 0 auto 24px;
      border-radius: 50%;
      padding: 7px;
      background: conic-gradient(from 0deg, #059669, #fbbf24, #34d399, #059669);
      animation: spin 1.6s linear infinite;
      box-shadow: 0 10px 40px rgba(5, 150, 105, 0.25);
    }
    .icon-badge {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: floaty 2.4s ease-in-out infinite;
    }
    .lunchbox {
      width: 66px;
      height: 66px;
    }

    .lid {
      transform-origin: 50% 34px;
      animation: lid-bob 2.4s ease-in-out infinite;
    }
    .box {
      animation: floaty 2.4s ease-in-out infinite;
    }
    .steam path {
      opacity: 0;
      animation: steam 2s ease-in-out infinite;
    }
    .steam path:nth-child(2) { animation-delay: 0.35s; }
    .steam path:nth-child(3) { animation-delay: 0.7s; }

    .brand {
      font-size: 1.45rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
    }
    .brand-accent {
      color: #059669;
    }

    .tagline {
      font-size: 0.95rem;
      color: #475569;
      font-weight: 500;
      margin: 0 0 26px;
    }

    .dots {
      display: flex;
      justify-content: center;
      gap: 8px;
    }
    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #059669;
      animation: bounce 1.2s ease-in-out infinite;
    }
    .dot:nth-child(2) {
      animation-delay: 0.15s;
      background: #fbbf24;
    }
    .dot:nth-child(3) {
      animation-delay: 0.3s;
      background: #059669;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes floaty {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @keyframes lid-bob {
      0%, 100% { transform: rotate(-28deg) translateY(0); }
      50% { transform: rotate(-22deg) translateY(-5px); }
    }
    @keyframes steam {
      0% { opacity: 0; transform: translateY(4px); }
      35% { opacity: 0.9; }
      100% { opacity: 0; transform: translateY(-10px); }
    }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-9px); opacity: 1; }
    }
  `],
})
export class PublicLoadingComponent {
  message = input('Loading…');
}

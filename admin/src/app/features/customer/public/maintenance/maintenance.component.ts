import { Component } from '@angular/core';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  template: `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#022c22,#064e3b,#065f46);">
      <div style="text-align:center;padding:40px 24px;max-width:520px;">
        <div style="width:100px;height:100px;border-radius:24px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 32px;">
          <span class="material-icons" style="font-size:48px;color:#a7f3d0;">construction</span>
        </div>
        <h1 style="font-size:36px;font-weight:800;color:white;margin:0 0 12px;letter-spacing:-0.02em;">Under Maintenance</h1>
        <p style="font-size:16px;color:rgba(167,243,208,0.8);margin:0 0 32px;line-height:1.6;">
          We're currently performing scheduled maintenance to improve your experience. We'll be back shortly!
        </p>
        <div style="display:flex;align-items:center;justify-content:center;gap:12px;">
          <div style="width:12px;height:12px;border-radius:50%;background:#34d399;animation:pulse 1.5s ease-in-out infinite;"></div>
          <div style="width:12px;height:12px;border-radius:50%;background:#34d399;animation:pulse 1.5s ease-in-out infinite;animation-delay:0.3s;"></div>
          <div style="width:12px;height:12px;border-radius:50%;background:#34d399;animation:pulse 1.5s ease-in-out infinite;animation-delay:0.6s;"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }
  `],
})
export class MaintenanceComponent {}

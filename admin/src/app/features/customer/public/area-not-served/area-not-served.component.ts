import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PincodeStateService } from '../../../../core/services/pincode-state.service';

@Component({
  selector: 'app-area-not-served',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0f172a,#1e293b,#334155);padding:1rem;">
      <div style="text-align:center;padding:40px 24px;max-width:560px;width:100%;">

        <div style="width:100px;height:100px;border-radius:24px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 32px;">
          <span class="material-icons" style="font-size:48px;color:#fbbf24;">location_disabled</span>
        </div>

        <div style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.3rem 0.8rem;border-radius:999px;font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem;background:rgba(251,191,36,0.2);color:#fbbf24;">
          Delivery Area Unavailable
        </div>

        <h1 style="font-size:1.9rem;font-weight:800;color:white;margin:0 0 0.75rem;letter-spacing:-0.02em;line-height:1.2;">
          We're not delivering to {{ pincode || 'your area' }} yet
        </h1>

        <p style="font-size:1rem;color:rgba(226,232,240,0.8);margin:0 0 2rem;line-height:1.6;">
          We're expanding to new areas soon. Request service in your pincode and we'll notify you as soon as we start delivering there.
        </p>

        @if (pincodeState.requestSuccess()) {
          <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(74,222,128,0.4);border-radius:1rem;padding:1.5rem;margin-bottom:1.5rem;">
            <div style="width:56px;height:56px;border-radius:16px;background:rgba(74,222,128,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
              <span class="material-icons" style="font-size:28px;color:#4ade80;">task_alt</span>
            </div>
            <h2 style="font-size:1.15rem;font-weight:700;color:white;margin:0 0 0.4rem;">Request received!</h2>
            <p style="font-size:0.9rem;color:rgba(226,232,240,0.75);margin:0;line-height:1.6;">
              {{ pincodeState.requestMessage() || 'Thank you! We\'ll notify you when we start serving ' + (pincode || 'your area') + '.' }}
            </p>
          </div>
        } @else {
          <form (ngSubmit)="submitRequest()" style="background:rgba(255,255,255,0.06);border-radius:1rem;padding:1.5rem;margin-bottom:1.5rem;text-align:left;">
            <div style="font-size:0.75rem;font-weight:700;color:rgba(226,232,240,0.7);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem;">
              Request Service in Your Area
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem;">
              <input type="text" [(ngModel)]="name" name="name" placeholder="Your name"
                style="padding:0.6rem 0.75rem;border:1px solid rgba(255,255,255,0.15);border-radius:0.5rem;background:rgba(255,255,255,0.08);color:white;font-size:0.85rem;outline:none;box-sizing:border-box;"
                onfocus="this.style.borderColor='#fbbf24'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'" />
              <input type="tel" [(ngModel)]="phone" name="phone" placeholder="Phone number" maxlength="10"
                style="padding:0.6rem 0.75rem;border:1px solid rgba(255,255,255,0.15);border-radius:0.5rem;background:rgba(255,255,255,0.08);color:white;font-size:0.85rem;outline:none;box-sizing:border-box;"
                onfocus="this.style.borderColor='#fbbf24'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'" />
            </div>
            <div style="margin-bottom:0.75rem;">
              <input type="email" [(ngModel)]="email" name="email" placeholder="Email address (optional)"
                style="width:100%;padding:0.6rem 0.75rem;border:1px solid rgba(255,255,255,0.15);border-radius:0.5rem;background:rgba(255,255,255,0.08);color:white;font-size:0.85rem;outline:none;box-sizing:border-box;"
                onfocus="this.style.borderColor='#fbbf24'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'" />
            </div>
            <div style="margin-bottom:1rem;">
              <textarea [(ngModel)]="message" name="message" rows="2" placeholder="Anything you'd like to tell us (optional)"
                style="width:100%;padding:0.6rem 0.75rem;border:1px solid rgba(255,255,255,0.15);border-radius:0.5rem;background:rgba(255,255,255,0.08);color:white;font-size:0.85rem;outline:none;box-sizing:border-box;resize:none;font-family:inherit;"
                onfocus="this.style.borderColor='#fbbf24'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'"></textarea>
            </div>
            <button type="submit" [disabled]="pincodeState.requesting()"
              style="width:100%;padding:0.75rem;background:linear-gradient(135deg,#059669,#10b981);color:white;font-weight:700;font-size:0.88rem;border-radius:0.75rem;border:none;cursor:pointer;transition:opacity 0.2s;"
              [style.opacity]="pincodeState.requesting() ? '0.6' : '1'">
              {{ pincodeState.requesting() ? 'Submitting...' : 'Notify Me' }}
            </button>
            @if (pincodeState.requestMessage() && !pincodeState.requestSuccess()) {
              <p style="font-size:0.8rem;color:#fca5a5;margin:0.75rem 0 0;text-align:center;">{{ pincodeState.requestMessage() }}</p>
            }
          </form>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class AreaNotServedComponent {
  pincodeState = inject(PincodeStateService);

  name = '';
  email = '';
  phone = '';
  message = '';

  get pincode(): string {
    return this.pincodeState.selectedPincode();
  }

  submitRequest(): void {
    this.pincodeState.requestService({
      pincode: this.pincode,
      name: this.name || undefined,
      email: this.email || undefined,
      phone: this.phone || undefined,
      message: this.message || undefined,
    });
  }
}

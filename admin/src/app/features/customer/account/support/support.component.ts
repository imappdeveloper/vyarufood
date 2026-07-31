import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="max-width: 800px; margin: 0 auto; padding: 1.5rem 0;">
      <!-- Hero Header -->
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
        <div style="position: absolute; bottom: -60px; left: 30%; width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
        <div style="position: relative; z-index: 1;">
          <p style="color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 500; letter-spacing: 0.5px; margin: 0 0 2px 0;">SUPPORT</p>
          <h1 style="color: #fff; font-size: 26px; font-weight: 700; margin: 0 0 4px 0;">Help & Support</h1>
          <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0;">We are here to help you, {{ customerName() }}. Choose an option below.</p>
        </div>
      </div>

      <!-- Quick Links -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <a routerLink="/faq" style="display: flex; align-items: center; gap: 14px; background: #fff; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; text-decoration: none; transition: all 0.2s; cursor: pointer;" onmouseover="this.style.borderColor='#059669';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.06)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.boxShadow='none'">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #dbeafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="color: #2563eb; font-size: 22px;">help_outline</span>
          </div>
          <div>
            <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 0 0 2px 0;">FAQ</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">Find answers to common questions</p>
          </div>
        </a>
        <a routerLink="/contact" style="display: flex; align-items: center; gap: 14px; background: #fff; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; text-decoration: none; transition: all 0.2s; cursor: pointer;" onmouseover="this.style.borderColor='#059669';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.06)'" onmouseout="this.style.borderColor='#e5e7eb';this.style.boxShadow='none'">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="color: #059669; font-size: 22px;">mail_outline</span>
          </div>
          <div>
            <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 0 0 2px 0;">Contact Us</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">Send us a message</p>
          </div>
        </a>
      </div>

      <!-- Contact Information -->
      <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 20px;">
        <div style="padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
          <h2 style="font-size: 15px; font-weight: 600; color: #111827; margin: 0;">Contact Information</h2>
        </div>
        <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
          <!-- Phone -->
          <div style="display: flex; align-items: flex-start; gap: 14px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #e0e7ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="color: #4f46e5; font-size: 20px;">phone</span>
            </div>
            <div>
              <p style="font-size: 13px; font-weight: 500; color: #111827; margin: 0 0 2px 0;">Phone</p>
              <a href="tel:+919876543210" style="font-size: 13px; color: #059669; text-decoration: none; transition: all 0.15s;" onmouseover="this.style.color='#047857'" onmouseout="this.style.color='#059669'">+91 98765 43210</a>
              <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0;">Mon - Sat, 9:00 AM - 8:00 PM</p>
            </div>
          </div>
          <!-- Email -->
          <div style="display: flex; align-items: flex-start; gap: 14px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="color: #9333ea; font-size: 20px;">email</span>
            </div>
            <div>
              <p style="font-size: 13px; font-weight: 500; color: #111827; margin: 0 0 2px 0;">Email</p>
              <a href="mailto:support&#64;vyarutiffin.com" style="font-size: 13px; color: #059669; text-decoration: none; transition: all 0.15s;" onmouseover="this.style.color='#047857'" onmouseout="this.style.color='#059669'">support&#64;vyarutiffin.com</a>
              <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0;">We respond within 24 hours</p>
            </div>
          </div>
          <!-- WhatsApp -->
          <div style="display: flex; align-items: flex-start; gap: 14px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="color: #059669; font-size: 20px;">chat</span>
            </div>
            <div>
              <p style="font-size: 13px; font-weight: 500; color: #111827; margin: 0 0 2px 0;">WhatsApp</p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style="font-size: 13px; color: #059669; text-decoration: none; transition: all 0.15s;" onmouseover="this.style.color='#047857'" onmouseout="this.style.color='#059669'">+91 98765 43210</a>
              <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0;">Quick responses during business hours</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Operating Hours -->
      <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 20px;">
        <div style="padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
          <h2 style="font-size: 15px; font-weight: 600; color: #111827; margin: 0;">Operating Hours</h2>
        </div>
        <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 13px; color: #6b7280;">Monday - Friday</span>
            <span style="font-size: 13px; font-weight: 500; color: #111827;">9:00 AM - 8:00 PM</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 13px; color: #6b7280;">Saturday</span>
            <span style="font-size: 13px; font-weight: 500; color: #111827;">9:00 AM - 6:00 PM</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 13px; color: #6b7280;">Sunday</span>
            <span style="font-size: 13px; font-weight: 500; color: #111827;">10:00 AM - 4:00 PM</span>
          </div>
        </div>
      </div>

      <!-- Common Issues -->
      <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div style="padding: 16px 20px; border-bottom: 1px solid #f3f4f6;">
          <h2 style="font-size: 15px; font-weight: 600; color: #111827; margin: 0;">Common Issues</h2>
        </div>
        <div style="padding: 8px;">
          <a routerLink="/faq" fragment="order" style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; text-decoration: none; transition: all 0.15s; cursor: pointer;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='transparent'">
            <span class="material-icons" style="font-size: 18px; color: #9ca3af;">receipt_long</span>
            <span style="font-size: 13px; color: #374151; flex: 1;">Order related issues</span>
            <span class="material-icons" style="font-size: 18px; color: #d1d5db;">chevron_right</span>
          </a>
          <a routerLink="/faq" fragment="payment" style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; text-decoration: none; transition: all 0.15s; cursor: pointer;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='transparent'">
            <span class="material-icons" style="font-size: 18px; color: #9ca3af;">payment</span>
            <span style="font-size: 13px; color: #374151; flex: 1;">Payment & refund issues</span>
            <span class="material-icons" style="font-size: 18px; color: #d1d5db;">chevron_right</span>
          </a>
          <a routerLink="/faq" fragment="subscription" style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; text-decoration: none; transition: all 0.15s; cursor: pointer;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='transparent'">
            <span class="material-icons" style="font-size: 18px; color: #9ca3af;">card_membership</span>
            <span style="font-size: 13px; color: #374151; flex: 1;">Subscription issues</span>
            <span class="material-icons" style="font-size: 18px; color: #d1d5db;">chevron_right</span>
          </a>
          <a routerLink="/refund-policy" style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; text-decoration: none; transition: all 0.15s; cursor: pointer;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='transparent'">
            <span class="material-icons" style="font-size: 18px; color: #9ca3af;">assignment_return</span>
            <span style="font-size: 13px; color: #374151; flex: 1;">Refund policy</span>
            <span class="material-icons" style="font-size: 18px; color: #d1d5db;">chevron_right</span>
          </a>
          <a routerLink="/cancellation-policy" style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; text-decoration: none; transition: all 0.15s; cursor: pointer;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='transparent'">
            <span class="material-icons" style="font-size: 18px; color: #9ca3af;">cancel</span>
            <span style="font-size: 13px; color: #374151; flex: 1;">Cancellation policy</span>
            <span class="material-icons" style="font-size: 18px; color: #d1d5db;">chevron_right</span>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class SupportComponent implements OnInit {
  private authService = inject(CustomerAuthService);

  customerName = signal('');

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.customerName.set(user.first_name || 'there');
    }
  }
}

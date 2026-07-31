import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PublicApiService, CompanyInfo } from '../../../../core/services/public-api.service';
import { ContactApiService } from '../../../../core/services/contact-api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <!-- HERO -->
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 100px 24px 140px; overflow: hidden; min-height: 420px;">
      <div *ngFor="let item of heroFloaters" [style]="item.style">{{ item.emoji }}</div>
      <div *ngFor="let s of steamWisps" [style]="s.style"></div>
      <div style="position: absolute; top: 8%; left: 8%; width: 200px; height: 200px; background: rgba(255,255,255,0.06); border-radius: 50%; filter: blur(50px);"></div>
      <div style="position: absolute; bottom: 15%; right: 10%; width: 160px; height: 160px; background: rgba(255,255,255,0.05); border-radius: 50%; filter: blur(40px);"></div>
      <div style="max-width: 800px; margin: 0 auto; position: relative; z-index: 2; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.8); margin-bottom: 16px; animation: contactSlideIn 0.6s ease-out 0.1s both;">
          <a routerLink="/" style="color: rgba(255,255,255,0.8); text-decoration: none;">Home</a>
          <span style="font-size: 10px;">&#9654;</span>
          <span style="color: white;">Contact Us</span>
        </div>
        <h1 style="font-size: clamp(2.2rem, 5vw, 3.2rem); font-weight: 800; color: white; margin: 0 0 16px 0; line-height: 1.2; animation: contactSlideIn 0.6s ease-out 0.15s both;">
          <span class="material-icons" style="font-size: clamp(1.8rem, 4vw, 2.6rem); vertical-align: middle; margin-right: 8px;">mail</span>
          Contact Us
        </h1>
        <p style="font-size: clamp(1rem, 2vw, 1.15rem); color: rgba(255,255,255,0.9); max-width: 600px; margin: 0 auto; line-height: 1.7; animation: contactSlideIn 0.6s ease-out 0.25s both;">
          Have questions, feedback, or need support? We'd love to hear from you. Reach out anytime!
        </p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 60px; display: block;" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="white"/>
      </svg>
    </section>

    <!-- CONTACT INFO CARDS -->
    <section style="padding: 60px 24px 40px; background: white;">
      <div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
        <div *ngFor="let info of contactInfo; let i = index"
             [style]="'background: white; border-radius: 20px; padding: 32px; border: 1px solid #e5e7eb; text-align: center; transition: all 0.3s ease; animation: cardFadeIn 0.5s ease-out ' + (0.1 + i * 0.1) + 's both;'"
             onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 40px rgba(5,150,105,0.12)'; this.style.borderColor='#a7f3d0';"
             onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='#e5e7eb';">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <span class="material-icons" style="color: #059669; font-size: 28px;">{{ info.icon }}</span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #166534; margin: 0 0 8px 0;">{{ info.title }}</h3>
          <p style="font-size: 0.9rem; color: #6b7280; line-height: 1.6; margin: 0;">{{ info.detail }}</p>
          <p *ngIf="info.sub" style="font-size: 0.82rem; color: #9ca3af; margin: 6px 0 0 0;">{{ info.sub }}</p>
        </div>
      </div>
    </section>

    <!-- FORM + OFFICE INFO -->
    <section style="padding: 40px 24px 80px; background: white;">
      <div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 40px;">
        <!-- Form -->
        <div style="background: white; border-radius: 24px; padding: 40px; border: 1px solid #e5e7eb; animation: contactSlideIn 0.6s ease-out 0.2s both;"
             class="contact-form-card">
          <div style="display: inline-block; background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; border: 1px solid #d1fae5; letter-spacing: 0.5px; text-transform: uppercase;">Send a Message</div>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #166534; margin: 0 0 8px 0;">Let's Talk</h2>
          <p style="font-size: 0.95rem; color: #6b7280; margin: 0 0 28px 0; line-height: 1.6;">Fill out the form below and we'll get back to you within 24 hours.</p>

          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 6px;">Your Name *</label>
                <input formControlName="name" placeholder="Rahul Sharma"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 0.95rem; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 6px;">Email Address *</label>
                <input formControlName="email" type="email" placeholder="rahul@example.com"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 0.95rem; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 6px;">Phone Number</label>
                <input formControlName="phone" type="tel" placeholder="+91 98765 43210"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 0.95rem; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 6px;">Subject</label>
                <select formControlName="subject"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 0.95rem; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; appearance: auto;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="subscription">Subscription Help</option>
                  <option value="delivery">Delivery Issue</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 6px;">Your Message *</label>
              <textarea formControlName="message" rows="5" placeholder="Tell us how we can help you..."
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 0.95rem; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; resize: vertical; box-sizing: border-box; font-family: inherit;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
            <button type="submit" [disabled]="contactForm.invalid && contactForm.touched"
              style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 36px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 14px; border: none; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 20px rgba(5,150,105,0.3); transition: all 0.3s ease;"
              onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px rgba(5,150,105,0.4)';"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 20px rgba(5,150,105,0.3)';">
              <span class="material-icons" style="font-size: 20px;">send</span>
              Send Message
            </button>
            <div *ngIf="submitted()" style="margin-top: 16px; padding: 14px 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; display: flex; align-items: center; gap: 10px; animation: contactSlideIn 0.4s ease-out;">
              <span class="material-icons" style="color: #16a34a; font-size: 22px;">check_circle</span>
              <span style="color: #166534; font-weight: 600; font-size: 0.95rem;">Message sent successfully! We'll get back to you soon.</span>
            </div>
            <div *ngIf="submitError()" style="margin-top: 16px; padding: 14px 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; display: flex; align-items: center; gap: 10px;">
              <span class="material-icons" style="color: #ef4444; font-size: 22px;">error_outline</span>
              <span style="color: #991b1b; font-weight: 600; font-size: 0.95rem;">{{ submitError() }}</span>
            </div>
          </form>
        </div>

        <!-- Right Column: Office Info + FAQ -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Office Hours -->
          <div style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e5e7eb; animation: contactSlideIn 0.6s ease-out 0.3s both;"
               onmouseover="this.style.borderColor='#a7f3d0';"
               onmouseout="this.style.borderColor='#e5e7eb';">
            <div style="display: inline-block; background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; border: 1px solid #d1fae5; letter-spacing: 0.5px; text-transform: uppercase;">Office Hours</div>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div *ngFor="let h of companyInfo()?.office_hours ?? officeHours" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f9fafb; border-radius: 10px;">
                <span style="font-size: 0.9rem; color: #374151; font-weight: 500;">{{ h.day }}</span>
                <span [style]="'font-size: 0.85rem; font-weight: 600; color: ' + (h.open ? '#059669' : '#ef4444') + ';'">{{ h.time }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Contact -->
          <div style="background: linear-gradient(135deg, #059669, #047857, #166534); border-radius: 24px; padding: 32px; position: relative; overflow: hidden; animation: contactSlideIn 0.6s ease-out 0.4s both;">
            <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 2;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <div style="width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="color: white; font-size: 24px;">phone</span>
                </div>
                <div>
                  <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">Prefer to call?</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: white;">{{ companyInfo()?.phone ?? '+91 98765 43210' }}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <div style="width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="color: white; font-size: 24px;">email</span>
                </div>
                <div>
                  <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">Email us</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: white;">{{ companyInfo()?.email ?? 'hello@vyarutiffin.com' }}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons" style="color: white; font-size: 24px;">location_on</span>
                </div>
                <div>
                  <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">Visit us</div>
                  <div style="font-size: 1rem; font-weight: 600; color: white;">{{ companyInfo()?.address ?? 'Mumbai, Maharashtra, India' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Quick Links -->
          <div style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #e5e7eb; animation: contactSlideIn 0.6s ease-out 0.5s both;"
               onmouseover="this.style.borderColor='#a7f3d0';"
               onmouseout="this.style.borderColor='#e5e7eb';">
            <div style="display: inline-block; background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 20px; margin-bottom: 16px; border: 1px solid #d1fae5; letter-spacing: 0.5px; text-transform: uppercase;">Quick Answers</div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;">
              <div *ngFor="let q of quickFaqs" style="padding: 12px 14px; background: #f9fafb; border-radius: 10px; border-left: 3px solid #059669;">
                <div style="font-size: 0.85rem; font-weight: 600; color: #166534; margin-bottom: 4px;">{{ q.q }}</div>
                <div style="font-size: 0.82rem; color: #6b7280; line-height: 1.5;">{{ q.a }}</div>
              </div>
            </div>
            <a routerLink="/faq"
               style="display: inline-flex; align-items: center; gap: 6px; color: #059669; font-weight: 600; font-size: 0.9rem; text-decoration: none; transition: gap 0.2s ease;"
               onmouseover="this.style.gap='10px';"
               onmouseout="this.style.gap='6px';">
              View all FAQs
              <span class="material-icons" style="font-size: 18px;">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- MAP / LOCATION SECTION -->
    <section style="padding: 0 24px 80px; background: white;">
      <div style="max-width: 1100px; margin: 0 auto;">
        <div style="background: #f0fdf4; border: 1px solid #d1fae5; border-radius: 24px; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; animation: contactSlideIn 0.6s ease-out 0.1s both;">
          <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #059669, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="color: white; font-size: 32px;">delivery_dining</span>
          </div>
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: #166534; margin: 0 0 10px 0;">We Deliver Across {{ companyInfo()?.address?.split(',')?.pop()?.trim() ?? 'Mumbai' }}</h2>
            <p style="font-size: 0.95rem; color: #6b7280; max-width: 500px; margin: 0 auto; line-height: 1.7;">
              Our delivery network covers major areas across {{ companyInfo()?.address?.split(',')?.pop()?.trim() ?? 'Mumbai' }}. Check if we deliver to your pincode.
            </p>
          </div>
          <a routerLink="/delivery-areas"
             style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: white; color: #059669; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 0.95rem; border: 2px solid #d1fae5; transition: all 0.3s ease;"
             onmouseover="this.style.borderColor='#059669'; this.style.background='#f0fdf4';"
             onmouseout="this.style.borderColor='#d1fae5'; this.style.background='white';">
            <span class="material-icons" style="font-size: 20px;">pin_drop</span>
            Check Your Pincode
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes contactHeroFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-18px) rotate(5deg); }
    }
    @keyframes contactSteam {
      0% { opacity: 0; transform: translateY(0) scaleX(1); }
      50% { opacity: 0.25; transform: translateY(-25px) scaleX(1.3); }
      100% { opacity: 0; transform: translateY(-55px) scaleX(1.6); }
    }
    @keyframes contactSlideIn {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes cardFadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (min-width: 768px) {
      .contact-form-card { grid-column: 1; }
    }
  `],
})
export class ContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private publicApi = inject(PublicApiService);
  private contactApi = inject(ContactApiService);

  submitted = signal(false);
  submitError = signal('');
  submitting = signal(false);
  companyInfo = signal<CompanyInfo | null>(null);

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: [''],
    message: ['', Validators.required],
  });

  ngOnInit(): void {
    this.publicApi.getCompanyInfo().subscribe({
      next: (res) => { if (res.data) this.companyInfo.set(res.data); },
    });
  }

  get contactInfo() {
    const info = this.companyInfo();
    return [
      { icon: 'location_on', title: 'Our Address', detail: info?.address ?? 'Mumbai, Maharashtra, India', sub: '' },
      { icon: 'phone', title: 'Phone Number', detail: info?.phone ?? '+91 98765 43210', sub: 'Mon - Sat, 9AM - 8PM' },
      { icon: 'email', title: 'Email Us', detail: info?.email ?? 'hello@vyarutiffin.com', sub: 'We reply within 24 hours' },
    ];
  }

  officeHours = [
    { day: 'Monday - Friday', time: '9:00 AM - 8:00 PM', open: true },
    { day: 'Saturday', time: '9:00 AM - 6:00 PM', open: true },
    { day: 'Sunday', time: '10:00 AM - 4:00 PM', open: true },
  ];

  quickFaqs = [
    { q: 'How do I subscribe?', a: 'Browse our plans page and pick one that suits you.' },
    { q: 'Can I skip meals?', a: 'Yes, skip at least 24 hours before delivery from your dashboard.' },
    { q: 'What is the refund policy?', a: 'Report within 2 hours of delivery for a replacement or wallet credit.' },
  ];

  heroFloaters = [
    { emoji: '🍕', style: 'position:absolute; top:12%; left:10%; font-size:36px; opacity:0.18; animation: contactHeroFloat 5s ease-in-out infinite;' },
    { emoji: '🍔', style: 'position:absolute; top:25%; right:12%; font-size:30px; opacity:0.15; animation: contactHeroFloat 6s ease-in-out 1s infinite;' },
    { emoji: '🥘', style: 'position:absolute; top:55%; left:20%; font-size:28px; opacity:0.12; animation: contactHeroFloat 4.5s ease-in-out 2s infinite;' },
    { emoji: '🍛', style: 'position:absolute; top:15%; left:50%; font-size:32px; opacity:0.14; animation: contactHeroFloat 5.5s ease-in-out 0.5s infinite;' },
    { emoji: '🥗', style: 'position:absolute; bottom:20%; right:22%; font-size:30px; opacity:0.16; animation: contactHeroFloat 7s ease-in-out 1.5s infinite;' },
    { emoji: '🫓', style: 'position:absolute; bottom:30%; left:35%; font-size:26px; opacity:0.12; animation: contactHeroFloat 5s ease-in-out 3s infinite;' },
  ];

  steamWisps = [
    { style: 'position:absolute; top:22%; left:16%; width:60px; height:3px; background:rgba(255,255,255,0.2); border-radius:50px; animation: contactSteam 2.5s ease-out infinite;' },
    { style: 'position:absolute; top:18%; right:18%; width:50px; height:2px; background:rgba(255,255,255,0.15); border-radius:50px; animation: contactSteam 3s ease-out 0.8s infinite;' },
    { style: 'position:absolute; top:45%; left:40%; width:45px; height:2px; background:rgba(255,255,255,0.12); border-radius:50px; animation: contactSteam 2s ease-out 1.5s infinite;' },
  ];

  onSubmit(): void {
    if (this.contactForm.invalid) return;
    this.submitting.set(true);
    this.submitError.set('');
    this.contactApi.submitForm(this.contactForm.value as any).subscribe({
      next: () => {
        this.submitted.set(true);
        this.contactForm.reset();
        this.submitting.set(false);
      },
      error: (err) => {
        this.submitError.set(err.error?.message || 'Failed to send message. Please try again.');
        this.submitting.set(false);
      },
    });
  }
}

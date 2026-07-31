import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CmsApiService } from '../../../../core/services/cms-api.service';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 80px 24px 100px; overflow: hidden;">
      <div style="position: absolute; top: -40px; right: -30px; width: 200px; height: 200px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -50px; left: 15%; width: 160px; height: 160px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 800px; margin: 0 auto; position: relative; z-index: 2; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); margin-bottom: 16px; animation: faqFadeIn 0.5s ease-out;">
          <span class="material-icons" style="font-size: 14px; color: #facc15;">live_help</span>
          <span style="color: white; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;">HELP CENTER</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 12px; justify-content: center; animation: faqFadeIn 0.5s ease-out 0.1s both;">
          <a routerLink="/" style="color: rgba(255,255,255,0.75); text-decoration: none;">Home</a>
          <span style="font-size: 10px;">&#9654;</span>
          <span style="color: white; font-weight: 500;">FAQs</span>
        </div>
        <h1 style="font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; color: white; margin: 0 0 8px 0; animation: faqFadeIn 0.5s ease-out 0.15s both;">
          Frequently Asked Questions
        </h1>
        <p style="font-size: 1rem; color: rgba(255,255,255,0.85); max-width: 520px; margin: 0 auto 28px; line-height: 1.6; animation: faqFadeIn 0.5s ease-out 0.2s both;">
          Everything you need to know about our tiffin service. Can't find what you're looking for? Contact us!
        </p>
        <div style="max-width: 500px; margin: 0 auto; position: relative; animation: faqFadeIn 0.5s ease-out 0.25s both;">
          <span class="material-icons" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.5); font-size: 20px;">search</span>
          <input type="text" [ngModel]="search()" (ngModelChange)="search.set($event)" placeholder="Search questions..."
            style="width: 100%; padding: 14px 16px 14px 48px; border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); color: white; font-size: 15px; outline: none; box-sizing: border-box; transition: all 0.3s ease;"
            onfocus="this.style.borderColor='rgba(255,255,255,0.5)'; this.style.background='rgba(255,255,255,0.15)';"
            onblur="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.background='rgba(255,255,255,0.1)';" />
        </div>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f8fafc"/>
      </svg>
    </section>

    @if (cmsContent) {
      <section style="max-width: 800px; margin: -30px auto 0; padding: 0 24px; position: relative; z-index: 3;">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <div [innerHTML]="cmsContent" style="font-size: 14px; color: #4b5563; line-height: 1.7;"></div>
        </div>
      </section>
    }

    <section style="max-width: 800px; margin: 32px auto 0; padding: 0 24px;">
      <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
        @for (cat of categories; track cat) {
          <button (click)="selectedCategory.set(cat)"
            [style]="'padding: 8px 18px; border-radius: 20px; border: 1.5px solid; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; ' + (selectedCategory() === cat
              ? 'background: linear-gradient(135deg, #059669, #16a34a); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(5,150,105,0.2);'
              : 'background: white; color: #6b7280; border-color: #e5e7eb;')"
            onmouseover="this.style.transform='translateY(-1px)'"
            onmouseout="this.style.transform=''">
            {{ cat }}
          </button>
        }
      </div>
    </section>

    <section style="max-width: 800px; margin: 28px auto 60px; padding: 0 24px;">
      @if (loading) {
        <div style="display: flex; align-items: center; justify-content: center; padding: 60px 0;">
          <div style="width: 32px; height: 32px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>
      }

      @if (filteredFaqs().length === 0 && !loading) {
        <div style="text-align: center; padding: 48px 0;">
          <span class="material-icons" style="font-size: 48px; color: #d1d5db; display: block; margin-bottom: 12px;">search_off</span>
          <p style="font-size: 15px; color: #9ca3af; font-weight: 500;">No questions match your search</p>
          <button (click)="search.set(''); selectedCategory.set('All')"
            style="margin-top: 12px; padding: 8px 20px; background: #f3f4f6; border: none; border-radius: 8px; color: #374151; font-size: 13px; font-weight: 600; cursor: pointer;">
            Clear filters
          </button>
        </div>
      }

      <div style="display: flex; flex-direction: column; gap: 10px;">
        @for (faq of filteredFaqs(); track faq.question; let i = $index) {
          <div
            style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; transition: all 0.25s ease;"
            [style.boxShadow]="openIndex() === i ? '0 4px 20px rgba(5,150,105,0.08)' : 'none'"
            [style.borderColor]="openIndex() === i ? '#a7f3d0' : '#e5e7eb'"
            onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 2px 12px rgba(5,150,105,0.05)';"
            onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
            <button (click)="toggle(i)"
              style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border: none; background: none; cursor: pointer; text-align: left; transition: background 0.2s;"
              onmouseover="this.style.background='#fafafa'"
              onmouseout="this.style.background=''">
              <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                <span class="material-icons" style="font-size: 20px; color: #059669; flex-shrink: 0;">help_outline</span>
                <span style="font-size: 15px; font-weight: 600; color: #111827; line-height: 1.4;">{{ faq.question }}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 11px; color: #9ca3af; font-weight: 500; background: #f3f4f6; padding: 3px 10px; border-radius: 10px;">{{ faq.category }}</span>
                <span class="material-icons" style="font-size: 20px; color: #9ca3af; transition: transform 0.3s ease;"
                  [style.transform]="openIndex() === i ? 'rotate(180deg)' : 'rotate(0deg)'">expand_more</span>
              </div>
            </button>
            @if (openIndex() === i) {
              <div style="padding: 0 22px 18px 54px; font-size: 14px; color: #4b5563; line-height: 1.7; animation: faqSlideDown 0.25s ease-out;">
                {{ faq.answer }}
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- CTA -->
    <section style="padding: 60px 24px 80px; background: linear-gradient(135deg, #ecfdf5, #d1fae5);">
      <div style="max-width: 600px; margin: 0 auto; text-align: center;">
        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #059669, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 8px 24px rgba(5,150,105,0.2);">
          <span class="material-icons" style="color: white; font-size: 32px;">support_agent</span>
        </div>
        <h2 style="font-size: 24px; font-weight: 800; color: #166534; margin: 0 0 8px 0;">Still Have Questions?</h2>
        <p style="font-size: 15px; color: #6b7280; line-height: 1.6; margin: 0 0 28px 0;">Our support team is happy to help you with anything you need.</p>
        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <a routerLink="/contact"
            style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 14px; box-shadow: 0 4px 16px rgba(5,150,105,0.25); transition: all 0.3s ease;"
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(5,150,105,0.35)';"
            onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.25)';">
            <span class="material-icons" style="font-size: 18px;">mail</span>
            Contact Us
          </a>
          <a href="tel:+919876543210"
            style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: white; color: #059669; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 14px; border: 1.5px solid #d1fae5; transition: all 0.3s ease;"
            onmouseover="this.style.borderColor='#059669'; this.style.background='#f0fdf4';"
            onmouseout="this.style.borderColor='#d1fae5'; this.style.background='white';">
            <span class="material-icons" style="font-size: 18px;">phone</span>
            Call Support
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes faqFadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes faqSlideDown {
      from { opacity: 0; max-height: 0; }
      to { opacity: 1; max-height: 300px; }
    }
  `],
})
export class FaqComponent implements OnInit {
  private cmsApi = inject(CmsApiService);
  openIndex = signal<number | null>(null);
  search = signal('');
  selectedCategory = signal('All');
  cmsContent = '';
  loading = true;

  categories = ['All', 'Getting Started', 'Orders & Delivery', 'Subscription', 'Account & Billing'];

  faqs: FaqItem[] = [
    { question: 'How do I subscribe to a tiffin plan?', answer: 'Browse our subscription plans page, select a plan that suits your needs, choose your meal preferences, and complete the checkout process. You\'ll start receiving fresh meals from your next delivery window.', category: 'Getting Started' },
    { question: 'Can I customize my meals?', answer: 'Yes! You can customize meals based on dietary preferences, allergies, and taste. Set your preferences in your profile settings and select meals from the weekly menu before the cutoff time.', category: 'Getting Started' },
    { question: 'How do I place a one-time order?', answer: 'You can place a one-time order by browsing our menu, adding items to your cart, and checking out. No subscription commitment required — just pay and enjoy!', category: 'Getting Started' },
    { question: 'What are the delivery timings?', answer: 'We deliver meals during lunch (12:00 PM - 2:00 PM) and dinner (7:00 PM - 9:00 PM) windows. You can select your preferred delivery slot during checkout.', category: 'Orders & Delivery' },
    { question: 'Do you deliver on weekends?', answer: 'Yes! We deliver 7 days a week including weekends and public holidays. You can manage delivery preferences from your dashboard to skip specific days.', category: 'Orders & Delivery' },
    { question: 'How do I change my delivery address?', answer: 'Go to your dashboard, navigate to Addresses, and you can add, edit, or remove delivery addresses. Changes take effect from your next scheduled delivery.', category: 'Orders & Delivery' },
    { question: 'What is the minimum order amount?', answer: 'Minimum order amounts vary by delivery zone. Use the pincode checker on our Delivery Areas page to see if we serve your area and what the minimum order is.', category: 'Orders & Delivery' },
    { question: 'How do I skip or pause my subscription?', answer: 'You can skip individual meals or pause your subscription from your dashboard under "My Subscriptions". Please skip at least 24 hours before the scheduled delivery time.', category: 'Subscription' },
    { question: 'Can I upgrade or downgrade my plan?', answer: 'Yes, you can upgrade or downgrade your subscription plan at any time. Changes take effect from the next billing cycle. Contact support for assistance with plan changes.', category: 'Subscription' },
    { question: 'What is the refund policy?', answer: 'If you are not satisfied with a meal, please report it within 2 hours of delivery. We will either replace the meal or issue a credit to your wallet for future orders.', category: 'Account & Billing' },
    { question: 'How do I cancel my subscription?', answer: 'You can cancel your subscription from your dashboard. Cancellation takes effect at the end of the current billing period. Unused days may be credited to your wallet.', category: 'Subscription' },
    { question: 'What payment methods do you accept?', answer: 'We accept UPI, credit/debit cards, net banking, and wallet payments. All transactions are processed through secure payment gateways.', category: 'Account & Billing' },
  ];

  filteredFaqs = computed(() => {
    return this.faqs.filter(faq => {
      const matchesSearch = !this.search() ||
        faq.question.toLowerCase().includes(this.search().toLowerCase()) ||
        faq.answer.toLowerCase().includes(this.search().toLowerCase());
      const matchesCategory = this.selectedCategory() === 'All' || faq.category === this.selectedCategory();
      return matchesSearch && matchesCategory;
    });
  });

  ngOnInit(): void {
    this.cmsApi.getCmsPage('faq').subscribe({
      next: (res) => { if (res.data?.content) this.cmsContent = res.data.content; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  toggle(i: number): void {
    this.openIndex.set(this.openIndex() === i ? null : i);
  }
}

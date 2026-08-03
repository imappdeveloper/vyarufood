import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq-preview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-white py-14 sm:py-20" aria-label="Frequently asked questions">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 sm:mb-14">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 text-blue-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            <span class="material-icons text-sm">help_outline</span> FAQ
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Frequently Asked Questions</h2>
          <p class="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">Quick answers to common questions about our tiffin service</p>
        </div>

        <div class="max-w-3xl mx-auto space-y-3">
          @for (faq of faqs; track faq.question; let i = $index) {
            <div class="bg-white rounded-2xl border overflow-hidden transition-all duration-300"
                 [class]="openIndex() === i ? 'border-orange-200 shadow-lg shadow-orange-500/5' : 'border-slate-200 hover:border-slate-300 shadow-sm'">
              <button
                (click)="toggle(i)"
                class="w-full flex items-center justify-between p-5 sm:p-6 text-left group">
                <div class="flex items-center gap-3 pr-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                       [class]="openIndex() === i ? 'bg-orange-500 text-white scale-110' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'">
                    <span class="material-icons text-xl">{{ faq.icon }}</span>
                  </div>
                  <span class="font-bold text-slate-900 text-sm sm:text-base group-hover:text-orange-600 transition-colors">{{ faq.question }}</span>
                </div>
                <span class="material-icons text-slate-400 flex-shrink-0 transition-transform duration-300"
                      [class.rotate-180]="openIndex() === i">
                  expand_more
                </span>
              </button>
              @if (openIndex() === i) {
                <div class="px-5 sm:px-6 pb-5 sm:pb-6 animate-fadeIn">
                  <div class="ml-[52px]">
                    <p class="text-slate-600 text-sm sm:text-base leading-relaxed">{{ faq.answer }}</p>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <div class="text-center mt-10">
          <a routerLink="/faq"
             class="inline-flex items-center gap-1.5 text-teal-600 font-semibold text-sm hover:text-teal-700 hover:gap-2.5 transition-all duration-300">
            View All FAQs <span class="material-icons text-base">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  `],
})
export class FaqPreviewComponent {
  openIndex = signal<number | null>(null);

  faqs = [
    { icon: 'local_shipping', question: 'How does the tiffin delivery work?', answer: 'We prepare fresh meals daily and deliver them to your doorstep during your chosen time slot. Our delivery partners ensure your food arrives hot and on time. You can track your delivery in real-time through your account.' },
    { icon: 'pause_circle', question: 'Can I skip or pause my subscription?', answer: 'Absolutely! You can skip meals up to your plan\'s maximum skip days and pause your subscription whenever needed. Changes made before the cut-off time (typically 10 PM the previous day) will take effect from the next meal.' },
    { icon: 'swap_horiz', question: 'How do I upgrade or downgrade my plan?', answer: 'You can upgrade your plan anytime from your subscription dashboard. Upgrade charges are prorated for the remaining days. For downgrades, please contact our support team as this is handled on a case-by-case basis.' },
    { icon: 'payments', question: 'What payment methods are accepted?', answer: 'We accept UPI, credit/debit cards, net banking, and wallet payments through Razorpay. You can also use your VyaruFood wallet balance for payments. All transactions are 100% secure.' },
    { icon: 'cancel', question: 'How do I cancel my subscription?', answer: 'You can cancel your subscription from your account dashboard. Cancellation takes effect at the end of your current billing cycle. Depending on your plan, a cancellation fee may apply.' },
  ];

  toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}

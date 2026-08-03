import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-slate-100 py-14 sm:py-20 relative overflow-hidden" aria-label="Why choose us">
      <div class="absolute top-0 right-0 w-80 h-80 bg-green-100/40 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-12 sm:mb-14">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/15 text-green-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            <span class="material-icons text-sm">favorite</span> Our Promise
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Why Choose VyaruFood &amp; Tiffin Service?</h2>
          <p class="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">We make healthy eating effortless</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          @for (feature of features; track feature.title; let i = $index) {
            <div class="group bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-green-200 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1 shadow-sm">
              <div class="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                   [class]="feature.bgClass">
                <span class="material-icons text-2xl" [class]="feature.iconClass">{{ feature.icon }}</span>
              </div>
              <h3 class="font-bold text-slate-900 mb-2 text-base group-hover:text-green-600 transition-colors">{{ feature.title }}</h3>
              <p class="text-slate-600 text-sm leading-relaxed">{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class WhyChooseUsComponent {
  features = [
    { icon: 'local_dining', title: 'Freshly Prepared', description: 'Every meal is freshly cooked using the finest ingredients just before delivery.', bgClass: 'bg-green-100', iconClass: 'text-green-700' },
    { icon: 'health_and_safety', title: 'Healthy & Nutritious', description: 'Balanced meals prepared by expert nutritionists for your well-being.', bgClass: 'bg-emerald-100', iconClass: 'text-emerald-700' },
    { icon: 'card_membership', title: 'Flexible Plans', description: 'Choose from daily, weekly, or monthly plans. Pause, skip, or cancel anytime.', bgClass: 'bg-green-100', iconClass: 'text-green-600' },
    { icon: 'skip_next', title: 'Easy Meal Skipping', description: "Don't want a meal? Skip it with a single tap. We'll adjust your plan.", bgClass: 'bg-emerald-100', iconClass: 'text-emerald-600' },
    { icon: 'local_shipping', title: 'Reliable Delivery', description: 'Hot meals delivered on time, every time, to your doorstep.', bgClass: 'bg-green-100', iconClass: 'text-green-700' },
    { icon: 'lock', title: 'Secure Payments', description: 'Pay securely through multiple payment options with encrypted transactions.', bgClass: 'bg-emerald-100', iconClass: 'text-emerald-700' },
  ];
}

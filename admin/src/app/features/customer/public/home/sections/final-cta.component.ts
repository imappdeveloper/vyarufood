import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" aria-label="Get started">
      <div class="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-10 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div class="absolute bottom-10 right-20 w-56 h-56 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div class="relative z-10">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Ready to Eat Healthy?</h2>
          <p class="text-orange-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Join thousands of happy customers who enjoy fresh, home-style meals delivered daily.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a routerLink="/meals"
               class="inline-flex items-center justify-center px-8 py-3.5 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all shadow-lg text-sm sm:text-base">
              <span class="material-icons mr-2">restaurant_menu</span> Order a Meal
            </a>
            <a routerLink="/register"
               class="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm sm:text-base">
              <span class="material-icons mr-2">person_add</span> Create Account
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class FinalCtaComponent {}

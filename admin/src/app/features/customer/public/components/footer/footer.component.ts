import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-slate-900 text-gray-300 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          <!-- Company -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="material-icons text-primary-400 text-3xl">restaurant_menu</span>
              <span class="text-2xl font-bold text-white">Vyaru Tiffin</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">
              Fresh, healthy tiffin meals delivered to your doorstep
            </p>
            <div class="flex items-center gap-4">
              <a href="javascript:void(0)" class="text-gray-400 hover:text-primary-400 transition-colors" aria-label="Facebook">
                <span class="material-icons text-xl">facebook</span>
              </a>
              <a href="javascript:void(0)" class="text-gray-400 hover:text-primary-400 transition-colors" aria-label="Instagram">
                <span class="material-icons text-xl">photo_camera</span>
              </a>
              <a href="javascript:void(0)" class="text-gray-400 hover:text-primary-400 transition-colors" aria-label="Twitter">
                <span class="material-icons text-xl">tag</span>
              </a>
              <a href="javascript:void(0)" class="text-gray-400 hover:text-primary-400 transition-colors" aria-label="YouTube">
                <span class="material-icons text-xl">play_circle</span>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul class="space-y-2.5">
              <li><a routerLink="/" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Home</a></li>
              <li><a routerLink="/meals" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Meals</a></li>
              <li><a routerLink="/subscriptions" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Subscription Plans</a></li>
              <li><a routerLink="/about" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">About Us</a></li>
              <li><a routerLink="/contact" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Contact Us</a></li>
              <li><a routerLink="/blog" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Blog</a></li>
            </ul>
          </div>

          <!-- Customer Support -->
          <div>
            <h3 class="text-white font-semibold text-lg mb-4">Customer Support</h3>
            <ul class="space-y-2.5">
              <li><a routerLink="/faq" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Help Center</a></li>
              <li><a routerLink="/faq" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">FAQs</a></li>
              <li><a routerLink="/delivery-areas" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Delivery Areas</a></li>
              <li><a routerLink="/contact" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Report an Issue</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul class="space-y-2.5">
              <li><a routerLink="/privacy-policy" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Privacy Policy</a></li>
              <li><a routerLink="/terms-and-conditions" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Terms & Conditions</a></li>
              <li><a routerLink="/refund-policy" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Refund Policy</a></li>
              <li><a routerLink="/cancellation-policy" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Cancellation Policy</a></li>
            </ul>
          </div>

        </div>

        <div class="border-t border-slate-700 pt-8">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-gray-400 text-sm">
              &copy; 2026 Vyaru Tiffin. All rights reserved.
            </p>
            <p class="text-gray-400 text-sm">
              Made with <span class="text-red-500">&#10084;&#65039;</span> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}

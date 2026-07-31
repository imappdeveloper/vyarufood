import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div class="text-center max-w-md">
        <div class="mb-6">
          <span class="text-8xl font-bold text-indigo-600">404</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p class="text-gray-500 mb-8 leading-relaxed">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a routerLink="/" class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
            <span class="material-icons mr-2">home</span> Return Home
          </a>
          <a routerLink="/meals" class="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
            <span class="material-icons mr-2">restaurant_menu</span> Browse Meals
          </a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}

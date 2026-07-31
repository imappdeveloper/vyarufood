import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Blog</h1>
      <p class="text-gray-500 mb-10">Tips, recipes, and news from our kitchen.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        @for (post of posts; track post.title) {
          <article class="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
            <div class="h-48 bg-gradient-to-br from-indigo-100 to-purple-50 flex items-center justify-center">
              <span class="material-icons text-indigo-300 text-5xl">article</span>
            </div>
            <div class="p-6">
              <span class="text-xs font-medium text-indigo-600 uppercase tracking-wide">{{ post.category }}</span>
              <h2 class="text-xl font-semibold text-gray-900 mt-2 mb-3">{{ post.title }}</h2>
              <p class="text-gray-500 text-sm mb-4">{{ post.excerpt }}</p>
              <div class="flex items-center justify-between text-sm text-gray-400">
                <span>{{ post.date }}</span>
                <a class="text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer">Read More →</a>
              </div>
            </div>
          </article>
        }
      </div>
    </div>
  `,
})
export class BlogComponent {
  posts = [
    { title: '5 Benefits of Eating Home-Style Meals', excerpt: 'Discover why home-cooked meals are better for your health and wellbeing.', category: 'Health', date: 'Jan 15, 2026' },
    { title: 'Meal Planning for Busy Professionals', excerpt: 'Learn how to plan your weekly meals to save time and eat healthy.', category: 'Tips', date: 'Jan 10, 2026' },
    { title: 'The Secret Behind Our Paneer Butter Masala', excerpt: 'A behind-the-scenes look at how we prepare our most popular dish.', category: 'Recipes', date: 'Jan 5, 2026' },
    { title: 'Why Tiffin Services Are Growing in Mumbai', excerpt: 'The rising trend of tiffin services and how they are transforming urban dining.', category: 'Industry', date: 'Dec 28, 2025' },
  ];
}

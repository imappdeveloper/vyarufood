import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cms-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">{{ title }}</h1>
      <div class="prose prose-lg max-w-none text-gray-600 leading-relaxed" [innerHTML]="content"></div>
    </div>
  `,
})
export class CmsPageComponent {
  @Input() title = '';
  @Input() content = '';
}

import { Component } from '@angular/core';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="h-12 bg-white border-t border-gray-100 flex items-center justify-between px-6">
      <span class="text-xs text-gray-400">{{ appName }} &copy; {{ currentYear }}</span>
      <span class="text-xs text-gray-400">v{{ version }}</span>
    </footer>
  `,
})
export class FooterComponent {
  appName = APP_CONSTANTS.APP_NAME;
  currentYear = new Date().getFullYear();
  version = APP_CONSTANTS.APP_VERSION;
}

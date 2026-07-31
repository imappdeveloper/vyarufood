import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-support-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div [style.background]="'#fff'" [style.borderRadius]="'16px'" [style.border]="'1px solid #f0f0f0'"
         [style.boxShadow]="'0 1px 3px rgba(0,0,0,0.04)'" [style.overflow]="'hidden'">
      <div [style.background]="'linear-gradient(135deg, #047857, #059669)'" [style.padding]="'16px 20px'">
        <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'10px'">
          <span class="material-icons" [style.color]="'#fff'" [style.fontSize]="'20px'">support_agent</span>
          <div>
            <h3 [style.color]="'#fff'" [style.fontSize]="'14px'" [style.fontWeight]="'600'" [style.margin]="'0'">Quick Support</h3>
            <p [style.color]="'rgba(255,255,255,0.75)'" [style.fontSize]="'11px'" [style.margin]="'2px 0 0 0'">Get help instantly</p>
          </div>
        </div>
      </div>
      <div [style.padding]="'16px 20px'" [style.display]="'flex'" [style.flexDirection]="'column'" [style.gap]="'10px'">
        <a href="tel:+919999999999"
           [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'12px'"
           [style.padding]="'10px 14px'" [style.borderRadius]="'10px'"
           [style.textDecoration]="'none'" [style.transition]="'all 0.2s'"
           [style.background]="'#F0FDF4'" [style.border]="'1px solid #D1FAE5'"
           (mouseenter)="phHovered = true" (mouseleave)="phHovered = false"
           [style.background]="phHovered ? '#D1FAE5' : '#F0FDF4'">
          <span class="material-icons" [style.color]="'#059669'" [style.fontSize]="'18px'">phone</span>
          <div>
            <p [style.fontSize]="'12px'" [style.fontWeight]="'600'" [style.color]="'#065F46'" [style.margin]="'0'">Call Us</p>
            <p [style.fontSize]="'11px'" [style.color]="'#6B7280'" [style.margin]="'2px 0 0 0'">+91 9999999999</p>
          </div>
        </a>
        <a href="https://wa.me/919999999999" target="_blank"
           [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'12px'"
           [style.padding]="'10px 14px'" [style.borderRadius]="'10px'"
           [style.textDecoration]="'none'" [style.transition]="'all 0.2s'"
           [style.background]="'#F0FDF4'" [style.border]="'1px solid #D1FAE5'"
           (mouseenter)="waHovered = true" (mouseleave)="waHovered = false"
           [style.background]="waHovered ? '#D1FAE5' : '#F0FDF4'">
          <span class="material-icons" [style.color]="'#059669'" [style.fontSize]="'18px'">chat</span>
          <div>
            <p [style.fontSize]="'12px'" [style.fontWeight]="'600'" [style.color]="'#065F46'" [style.margin]="'0'">WhatsApp</p>
            <p [style.fontSize]="'11px'" [style.color]="'#6B7280'" [style.margin]="'2px 0 0 0'">Chat on WhatsApp</p>
          </div>
        </a>
        <a [href]="'mailto:support@vyarufood.com'"
           [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'12px'"
           [style.padding]="'10px 14px'" [style.borderRadius]="'10px'"
           [style.textDecoration]="'none'" [style.transition]="'all 0.2s'"
           [style.background]="'#EFF6FF'" [style.border]="'1px solid #BFDBFE'"
           (mouseenter)="emHovered = true" (mouseleave)="emHovered = false"
           [style.background]="emHovered ? '#BFDBFE' : '#EFF6FF'">
          <span class="material-icons" [style.color]="'#2563EB'" [style.fontSize]="'18px'">email</span>
          <div>
            <p [style.fontSize]="'12px'" [style.fontWeight]="'600'" [style.color]="'#1E3A5F'" [style.margin]="'0'">Email</p>
            <p [style.fontSize]="'11px'" [style.color]="'#6B7280'" [style.margin]="'2px 0 0 0'">support@vyarufood.com</p>
          </div>
        </a>
      </div>
    </div>
  `,
})
export class SupportWidgetComponent {
  phHovered = false;
  waHovered = false;
  emHovered = false;
}

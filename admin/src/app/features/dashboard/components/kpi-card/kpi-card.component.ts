import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div [style.background]="'#fff'" [style.borderRadius]="'16px'" [style.padding]="size === 'small' ? '16px 18px' : '22px 24px'"
         [style.border]="'1px solid #f0f0f0'"
         [style.boxShadow]="'0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'"
         [style.transition]="'all 0.25s ease'"
         (mouseenter)="hovered = true" (mouseleave)="hovered = false"
         [style.transform]="hovered ? 'translateY(-2px)' : 'translateY(0)'"
         [style.boxShadow]="hovered ? '0 8px 25px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'">
      <div [style.display]="'flex'" [style.alignItems]="'flex-start'" [style.justifyContent]="'space-between'">
        <div [style.flex]="'1'" [style.minWidth]="'0'">
          <p [style.fontSize]="'11px'" [style.fontWeight]="'600'" [style.color]="'#8b8fa3'"
             [style.letterSpacing]="'0.5px'" [style.textTransform]="'uppercase'" [style.margin]="'0 0 6px 0'"
             [style.whiteSpace]="'nowrap'" [style.overflow]="'hidden'" [style.textOverflow]="'ellipsis'">
            {{ label }}
          </p>
          <p [style.fontSize]="size === 'small' ? '20px' : '26px'" [style.fontWeight]="'700'" [style.color]="'#111827'"
             [style.margin]="'0'" [style.lineHeight]="'1.2'">{{ value }}</p>
        </div>
        <div [style.width]="size === 'small' ? '38px' : '46px'" [style.height]="size === 'small' ? '38px' : '46px'"
             [style.borderRadius]="'12px'" [style.display]="'flex'" [style.alignItems]="'center'" [style.justifyContent]="'center'"
             [style.flexShrink]="'0'" [style.background]="gradient || '#EEF2FF'">
          <mat-icon [style.color]="'#fff'" [style.fontSize]="size === 'small' ? '18px' : '22px'"
                    [style.width]="size === 'small' ? '18px' : '22px'" [style.height]="size === 'small' ? '18px' : '22px'">
            {{ icon }}
          </mat-icon>
        </div>
      </div>
      @if (change !== undefined && change !== 0) {
        <div [style.marginTop]="'12px'" [style.paddingTop]="'12px'" [style.borderTop]="'1px solid #f3f4f6'"
             [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'6px'">
          <span [style.display]="'inline-flex'" [style.alignItems]="'center'" [style.gap]="'3px'"
                [style.fontSize]="'12px'" [style.fontWeight]="'600'"
                [style.color]="change > 0 ? '#059669' : (change < 0 ? '#EF4444' : '#9CA3AF')">
            @if (change > 0) {
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
            } @else if (change < 0) {
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            }
            {{ change > 0 ? '+' : '' }}{{ change }}%
          </span>
          <span [style.fontSize]="'11px'" [style.color]="'#9CA3AF'">vs last period</span>
        </div>
      }
    </div>
  `,
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: string | number = 0;
  @Input() change: number | undefined;
  @Input() icon = 'analytics';
  @Input() gradient = 'linear-gradient(135deg, #6366F1, #8B5CF6)';
  @Input() size: 'normal' | 'small' = 'normal';
  hovered = false;
}

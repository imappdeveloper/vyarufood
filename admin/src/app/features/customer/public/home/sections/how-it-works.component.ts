import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="background: #fff; padding: 3.5rem 0; position: relative;" aria-label="How it works">
      <div style="max-width: 80rem; margin: 0 auto; padding: 0 1rem;">
        <div style="text-align: center; margin-bottom: 3rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.25rem 0.75rem; background: rgba(5,150,105,0.1); color: #047857; font-size: 0.7rem; font-weight: 700; border-radius: 9999px; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
            <span class="material-icons" style="font-size: 14px;">info</span> Simple Steps
          </div>
          <h2 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem; line-height: 1.2;">How It Works</h2>
          <p style="color: #64748b; max-width: 32rem; margin: 0 auto; font-size: 0.875rem;">Getting delicious meals delivered is as easy as 1-2-3-4</p>
        </div>

        <div style="position: relative;">
          <!-- Connector line (desktop only) -->
          <div style="display: none; position: absolute; top: 2.5rem; left: 15%; right: 15%; height: 2px; background: linear-gradient(90deg, #d1fae5, #059669, #d1fae5); border-radius: 1px;" class="hiw-line"></div>

          <div class="hiw-grid">
            @for (step of steps; track step.number) {
              <div style="text-align: center; position: relative;">
                <!-- Step number circle -->
                <div class="hiw-icon"
                     style="width: 4.5rem; height: 4.5rem; border-radius: 1rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; position: relative; z-index: 10; box-shadow: 0 8px 24px rgba(5,150,105,0.3); transition: all 0.3s ease;"
                     onmouseover="this.style.transform='translateY(-4px) scale(1.05)'; this.style.boxShadow='0 12px 32px rgba(5,150,105,0.4)';"
                     onmouseout="this.style.transform='none'; this.style.boxShadow='0 8px 24px rgba(5,150,105,0.3)';">
                  <span class="material-icons" style="font-size: 1.75rem;">{{ step.icon }}</span>
                </div>
                <!-- Step number label -->
                <div style="position: absolute; top: -0.375rem; left: 50%; transform: translateX(-50%); z-index: 11;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 1.5rem; height: 1.5rem; background: #fff; border: 2px solid #059669; color: #059669; font-size: 0.6rem; font-weight: 800; border-radius: 50%;">{{ step.number }}</span>
                </div>
                <!-- Content card -->
                <div style="background: #f8fafc; border-radius: 0.75rem; padding: 1.25rem 1rem; border: 1px solid #e2e8f0; transition: all 0.3s ease;"
                     onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 8px 24px rgba(5,150,105,0.08)';"
                     onmouseout="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';">
                  <h3 style="font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; font-size: 0.95rem;">{{ step.title }}</h3>
                  <p style="color: #64748b; font-size: 0.8rem; line-height: 1.6;">{{ step.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hiw-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 2rem;
    }
    @media (min-width: 640px) {
      .hiw-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1024px) {
      .hiw-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }
      .hiw-line { display: block; }
    }
  `],
})
export class HowItWorksComponent {
  steps = [
    { number: '1', icon: 'search', title: 'Browse Meals', description: 'Explore our menu of delicious homestyle meals and pick your favorites.' },
    { number: '2', icon: 'card_membership', title: 'Choose a Plan', description: 'Select a subscription plan that fits your schedule and budget.' },
    { number: '3', icon: 'event', title: 'Schedule Delivery', description: 'Pick your delivery time and let us handle the rest.' },
    { number: '4', icon: 'restaurant', title: 'Enjoy Your Tiffin', description: 'Receive hot, fresh meals delivered right to your doorstep.' },
  ];
}

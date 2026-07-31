import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cooking-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="overflow: hidden; background: linear-gradient(180deg, #fff 0%, #ecfdf5 50%, #fff 100%); padding: 1rem 0; position: relative;" aria-hidden="true">
      <div style="max-width: 80rem; margin: 0 auto; padding: 0 1rem; position: relative; height: 10rem; display: flex; align-items: center; justify-content: center;">

        <!-- Floating ingredients -->
        <div style="position: absolute; left: 5%; top: 15%; animation: cookFloat1 4s ease-in-out infinite; font-size: 2rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
          &#127813;
        </div>
        <div style="position: absolute; left: 15%; top: 60%; animation: cookFloat2 5s ease-in-out infinite 0.5s; font-size: 1.75rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
          &#127805;
        </div>
        <div style="position: absolute; left: 25%; top: 10%; animation: cookFloat3 4.5s ease-in-out infinite 1s; font-size: 1.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
          &#129367;
        </div>
        <div style="position: absolute; right: 25%; top: 20%; animation: cookFloat2 5.5s ease-in-out infinite 0.3s; font-size: 1.75rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
          &#127798;
        </div>
        <div style="position: absolute; right: 15%; top: 55%; animation: cookFloat1 4s ease-in-out infinite 1.2s; font-size: 2rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
          &#129361;
        </div>
        <div style="position: absolute; right: 5%; top: 12%; animation: cookFloat3 5s ease-in-out infinite 0.7s; font-size: 1.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
          &#127807;
        </div>

        <!-- Center: Cooking pot with steam -->
        <div style="position: relative; z-index: 10;">
          <!-- Steam wisps -->
          <div style="position: absolute; top: -2.5rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.75rem;">
            <div style="width: 3px; height: 2rem; background: linear-gradient(to top, rgba(5,150,105,0.3), transparent); border-radius: 9999px; animation: cookSteam1 2s ease-in-out infinite;"></div>
            <div style="width: 3px; height: 2.5rem; background: linear-gradient(to top, rgba(5,150,105,0.4), transparent); border-radius: 9999px; animation: cookSteam2 2.5s ease-in-out infinite 0.3s;"></div>
            <div style="width: 3px; height: 2rem; background: linear-gradient(to top, rgba(5,150,105,0.3), transparent); border-radius: 9999px; animation: cookSteam1 2s ease-in-out infinite 0.6s;"></div>
          </div>

          <!-- Pot -->
          <div style="width: 5rem; height: 3rem; background: linear-gradient(135deg, #334155, #475569); border-radius: 0 0 1.5rem 1.5rem; position: relative; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
            <!-- Pot rim -->
            <div style="position: absolute; top: -0.25rem; left: -0.375rem; right: -0.375rem; height: 0.5rem; background: linear-gradient(135deg, #64748b, #94a3b8); border-radius: 0.25rem;"></div>
            <!-- Left handle -->
            <div style="position: absolute; left: -1.25rem; top: 0.5rem; width: 1.25rem; height: 0.5rem; background: linear-gradient(135deg, #64748b, #94a3b8); border-radius: 0.25rem 0 0 0.25rem;"></div>
            <!-- Right handle -->
            <div style="position: absolute; right: -1.25rem; top: 0.5rem; width: 1.25rem; height: 0.5rem; background: linear-gradient(135deg, #64748b, #94a3b8); border-radius: 0 0.25rem 0.25rem 0;"></div>
            <!-- Bubbling content -->
            <div style="position: absolute; top: 0.375rem; left: 0.375rem; right: 0.375rem; bottom: 0; background: linear-gradient(135deg, #059669, #047857); border-radius: 0 0 1.25rem 1.25rem; overflow: hidden;">
              <div style="position: absolute; width: 0.375rem; height: 0.375rem; background: rgba(255,255,255,0.3); border-radius: 50%; animation: cookBubble 1.5s ease-in-out infinite;"></div>
              <div style="position: absolute; left: 40%; width: 0.25rem; height: 0.25rem; background: rgba(255,255,255,0.25); border-radius: 50%; animation: cookBubble 2s ease-in-out infinite 0.5s;"></div>
              <div style="position: absolute; left: 65%; width: 0.375rem; height: 0.375rem; background: rgba(255,255,255,0.2); border-radius: 50%; animation: cookBubble 1.8s ease-in-out infinite 1s;"></div>
            </div>
          </div>
        </div>

        <!-- Knife chopping animation (left side) -->
        <div style="position: absolute; left: 38%; top: 30%; z-index: 5;">
          <div style="animation: cookChop 1.2s ease-in-out infinite;">
            <!-- Knife blade -->
            <div style="width: 2rem; height: 0.375rem; background: linear-gradient(90deg, #d1d5db, #e5e7eb); border-radius: 0 0.25rem 0.25rem 0; transform-origin: right center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
            <!-- Knife handle -->
            <div style="width: 0.75rem; height: 0.625rem; background: linear-gradient(135deg, #78350f, #92400e); border-radius: 0.125rem; margin-left: 2rem; margin-top: -0.375rem;"></div>
          </div>
          <!-- Cutting board -->
          <div style="width: 3rem; height: 0.375rem; background: linear-gradient(135deg, #d97706, #b45309); border-radius: 0.25rem; margin-top: -0.125rem;"></div>
        </div>

        <!-- Hand serving plate (right side) -->
        <div style="position: absolute; right: 36%; bottom: 22%; z-index: 5; animation: cookServe 3s ease-in-out infinite;">
          <!-- Plate -->
          <div style="width: 3.5rem; height: 1.25rem; background: linear-gradient(135deg, #f1f5f9, #e2e8f0); border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 1rem; margin-top: -0.25rem;">&#127858;</span>
          </div>
          <!-- Hand -->
          <div style="width: 1.5rem; height: 0.75rem; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 0 0 0.5rem 0.5rem; margin: -0.25rem 0 0 1rem;"></div>
        </div>

        <!-- Dotted connecting line -->
        <div style="position: absolute; left: 38%; right: 36%; top: 50%; height: 1px; border-top: 2px dashed rgba(5,150,105,0.15); z-index: 1;"></div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes cookFloat1 {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-12px) rotate(5deg); }
      50% { transform: translateY(-6px) rotate(-3deg); }
      75% { transform: translateY(-14px) rotate(2deg); }
    }
    @keyframes cookFloat2 {
      0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
      33% { transform: translateY(-10px) rotate(-8deg) scale(1.05); }
      66% { transform: translateY(-16px) rotate(4deg) scale(0.95); }
    }
    @keyframes cookFloat3 {
      0%, 100% { transform: translateY(0) translateX(0); }
      25% { transform: translateY(-8px) translateX(4px); }
      50% { transform: translateY(-14px) translateX(-2px); }
      75% { transform: translateY(-6px) translateX(3px); }
    }
    @keyframes cookSteam1 {
      0% { opacity: 0; transform: translateY(0) scaleX(1); }
      50% { opacity: 0.6; transform: translateY(-1rem) scaleX(1.5); }
      100% { opacity: 0; transform: translateY(-2rem) scaleX(2); }
    }
    @keyframes cookSteam2 {
      0% { opacity: 0; transform: translateY(0) scaleX(1) translateX(0); }
      50% { opacity: 0.7; transform: translateY(-1.25rem) scaleX(1.3) translateX(3px); }
      100% { opacity: 0; transform: translateY(-2.5rem) scaleX(1.8) translateX(-2px); }
    }
    @keyframes cookBubble {
      0% { opacity: 0; transform: translateY(1rem) scale(0.5); }
      50% { opacity: 0.8; transform: translateY(0.25rem) scale(1); }
      100% { opacity: 0; transform: translateY(-0.5rem) scale(0.3); }
    }
    @keyframes cookChop {
      0%, 100% { transform: rotate(0deg); }
      30% { transform: rotate(-30deg); }
      50% { transform: rotate(5deg); }
      70% { transform: rotate(-15deg); }
    }
    @keyframes cookServe {
      0%, 100% { transform: translateX(0) translateY(0); }
      25% { transform: translateX(-0.5rem) translateY(-0.25rem); }
      50% { transform: translateX(0.25rem) translateY(-0.5rem); }
      75% { transform: translateX(-0.25rem) translateY(-0.125rem); }
    }
    @media (max-width: 640px) {
      section { display: none !important; }
    }
  `],
})
export class CookingAnimationComponent {}

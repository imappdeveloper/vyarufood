import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fog-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 5;" aria-hidden="true">
      <!-- Fog layer 1 -->
      <div style="position: absolute; bottom: 0; left: -10%; width: 120%; height: 40%; opacity: 0.06; animation: fogDrift1 20s linear infinite;">
        <svg viewBox="0 0 1440 200" fill="none" style="width: 100%; height: 100%;">
          <path d="M0 100 C360 40, 720 160, 1080 80 C1260 40, 1380 120, 1440 100 L1440 200 L0 200 Z" fill="white"/>
        </svg>
      </div>
      <!-- Fog layer 2 -->
      <div style="position: absolute; bottom: 0; left: -5%; width: 115%; height: 30%; opacity: 0.04; animation: fogDrift2 25s linear infinite 2s;">
        <svg viewBox="0 0 1440 160" fill="none" style="width: 100%; height: 100%;">
          <path d="M0 80 C240 120, 480 40, 720 100 C960 140, 1200 60, 1440 80 L1440 160 L0 160 Z" fill="white"/>
        </svg>
      </div>
      <!-- Fog layer 3 - thinnest, fastest -->
      <div style="position: absolute; bottom: 0; left: -15%; width: 130%; height: 25%; opacity: 0.03; animation: fogDrift3 18s linear infinite 5s;">
        <svg viewBox="0 0 1440 120" fill="none" style="width: 100%; height: 100%;">
          <path d="M0 60 C360 100, 600 20, 900 70 C1100 100, 1300 40, 1440 60 L1440 120 L0 120 Z" fill="white"/>
        </svg>
      </div>

      <!-- Floating spice particles -->
      <div style="position: absolute; top: 20%; left: 10%; width: 4px; height: 4px; background: rgba(250,204,21,0.5); border-radius: 50%; animation: spiceFloat 6s ease-in-out infinite;"></div>
      <div style="position: absolute; top: 35%; left: 25%; width: 3px; height: 3px; background: rgba(251,146,60,0.4); border-radius: 50%; animation: spiceFloat 7s ease-in-out infinite 1s;"></div>
      <div style="position: absolute; top: 15%; right: 20%; width: 3px; height: 3px; background: rgba(250,204,21,0.4); border-radius: 50%; animation: spiceFloat 8s ease-in-out infinite 2s;"></div>
      <div style="position: absolute; top: 40%; right: 30%; width: 4px; height: 4px; background: rgba(132,204,22,0.4); border-radius: 50%; animation: spiceFloat 6.5s ease-in-out infinite 3s;"></div>
      <div style="position: absolute; top: 25%; left: 60%; width: 2px; height: 2px; background: rgba(250,204,21,0.3); border-radius: 50%; animation: spiceFloat 7.5s ease-in-out infinite 1.5s;"></div>
      <div style="position: absolute; top: 45%; left: 45%; width: 3px; height: 3px; background: rgba(132,204,22,0.3); border-radius: 50%; animation: spiceFloat 9s ease-in-out infinite 4s;"></div>
    </div>
  `,
  styles: [`
    @keyframes fogDrift1 {
      0% { transform: translateX(0); }
      50% { transform: translateX(5%); }
      100% { transform: translateX(0); }
    }
    @keyframes fogDrift2 {
      0% { transform: translateX(0); }
      50% { transform: translateX(-4%); }
      100% { transform: translateX(0); }
    }
    @keyframes fogDrift3 {
      0% { transform: translateX(0); }
      50% { transform: translateX(6%); }
      100% { transform: translateX(0); }
    }
    @keyframes spiceFloat {
      0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
      50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
    }
  `],
})
export class FogOverlayComponent {}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- HERO -->
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 100px 24px 140px; overflow: hidden; min-height: 420px;">
      <!-- Floating food emojis -->
      <div *ngFor="let item of heroFloaters" [style]="item.style" class="hero-floater"> {{ item.emoji }} </div>
      <!-- Steam wisps -->
      <div *ngFor="let s of steamWisps" [style]="s.style" class="steam-wisp"></div>
      <!-- Decorative blurs -->
      <div style="position: absolute; top: 8%; left: 8%; width: 200px; height: 200px; background: rgba(255,255,255,0.06); border-radius: 50%; filter: blur(50px);"></div>
      <div style="position: absolute; bottom: 15%; right: 10%; width: 160px; height: 160px; background: rgba(255,255,255,0.05); border-radius: 50%; filter: blur(40px);"></div>
      <!-- Content -->
      <div style="max-width: 800px; margin: 0 auto; position: relative; z-index: 2; text-align: center; animation: aboutSlideIn 0.6s ease-out;">
        <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.8); margin-bottom: 16px; animation: aboutSlideIn 0.6s ease-out 0.1s both;">
          <a routerLink="/" style="color: rgba(255,255,255,0.8); text-decoration: none;">Home</a>
          <span style="font-size: 10px;">&#9654;</span>
          <span style="color: white;">About Us</span>
        </div>
        <h1 style="font-size: clamp(2.2rem, 5vw, 3.2rem); font-weight: 800; color: white; margin: 0 0 16px 0; line-height: 1.2; animation: aboutSlideIn 0.6s ease-out 0.15s both;">
          <span class="material-icons" style="font-size: clamp(1.8rem, 4vw, 2.6rem); vertical-align: middle; margin-right: 8px;">info</span>
          About Vyaru Tiffin
        </h1>
        <p style="font-size: clamp(1rem, 2vw, 1.15rem); color: rgba(255,255,255,0.9); max-width: 600px; margin: 0 auto; line-height: 1.7; animation: aboutSlideIn 0.6s ease-out 0.25s both;">
          Delivering fresh, nutritious, homestyle meals to your doorstep since 2024. We believe healthy eating should be convenient and affordable.
        </p>
      </div>
      <!-- Wave divider -->
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 60px; display: block;" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="white"/>
      </svg>
    </section>

    <!-- COMPANY STORY -->
    <section style="padding: 80px 24px; background: white;">
      <div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 60px; align-items: center;">
        <div class="about-story-text" style="animation: aboutSlideIn 0.6s ease-out 0.1s both;">
          <div style="display: inline-block; background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; border: 1px solid #d1fae5; letter-spacing: 0.5px; text-transform: uppercase;">Our Story</div>
          <h2 style="font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; color: #166534; margin: 0 0 20px 0; line-height: 1.25;">
            From a Simple Idea to <span style="color: #059669;">1000+ Happy Customers</span>
          </h2>
          <p style="font-size: 1rem; color: #4b5563; line-height: 1.8; margin: 0 0 16px 0;">
            Vyaru Tiffin started with a simple belief: everyone deserves access to fresh, homestyle meals without the hassle of cooking. Founded in 2024, we set out to bridge the gap between busy lifestyles and nutritious eating.
          </p>
          <p style="font-size: 1rem; color: #4b5563; line-height: 1.8; margin: 0 0 24px 0;">
            What began as a small kitchen serving a handful of customers has grown into a trusted meal delivery service serving hundreds of happy families daily across Mumbai.
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="material-icons" style="color: #059669; font-size: 20px;">check_circle</span>
              <span style="font-size: 0.95rem; color: #374151;">Fresh ingredients sourced daily from local markets</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="material-icons" style="color: #059669; font-size: 20px;">check_circle</span>
              <span style="font-size: 0.95rem; color: #374151;">Prepared by experienced home-style chefs</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="material-icons" style="color: #059669; font-size: 20px;">check_circle</span>
              <span style="font-size: 0.95rem; color: #374151;">Hygienic packaging with real-time delivery tracking</span>
            </div>
          </div>
        </div>
        <div class="about-story-visual" style="animation: aboutSlideIn 0.6s ease-out 0.3s both;">
          <div style="position: relative; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 24px; padding: 40px; border: 1px solid #a7f3d0;">
            <div style="position: absolute; top: -16px; right: -16px; width: 64px; height: 64px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(5,150,105,0.15); font-size: 32px;">🍽️</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 2rem; font-weight: 800; color: #059669; line-height: 1;">2024</div>
                <div style="font-size: 0.85rem; color: #6b7280; margin-top: 6px;">Founded</div>
              </div>
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 2rem; font-weight: 800; color: #059669; line-height: 1;">1000+</div>
                <div style="font-size: 0.85rem; color: #6b7280; margin-top: 6px;">Happy Customers</div>
              </div>
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 2rem; font-weight: 800; color: #059669; line-height: 1;">50+</div>
                <div style="font-size: 0.85rem; color: #6b7280; margin-top: 6px;">Menu Items</div>
              </div>
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 2rem; font-weight: 800; color: #059669; line-height: 1;">7 Days</div>
                <div style="font-size: 0.85rem; color: #6b7280; margin-top: 6px;">Delivery</div>
              </div>
            </div>
            <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 12px; text-align: center;">
              <span style="font-size: 0.9rem; color: #059669; font-weight: 600;">🌱 100% Pure Vegetarian</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VISION & MISSION -->
    <section style="padding: 80px 24px; background: #f8fafc;">
      <div style="max-width: 1100px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 50px; animation: aboutSlideIn 0.6s ease-out 0.1s both;">
          <div style="display: inline-block; background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 20px; margin-bottom: 16px; border: 1px solid #d1fae5; letter-spacing: 0.5px; text-transform: uppercase;">What Drives Us</div>
          <h2 style="font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; color: #166534; margin: 0 0 12px 0;">Our Vision & Mission</h2>
          <p style="font-size: 1rem; color: #6b7280; max-width: 500px; margin: 0 auto;">Guided by purpose, driven by passion for good food</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 28px; max-width: 800px; margin: 0 auto;">
          <!-- Vision Card -->
          <div class="about-vm-card" style="background: white; border-radius: 20px; padding: 36px; border: 1px solid #e5e7eb; transition: all 0.3s ease; animation: cardFadeIn 0.5s ease-out 0.15s both; cursor: default;"
               onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 40px rgba(5,150,105,0.12)'; this.style.borderColor='#a7f3d0';"
               onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='#e5e7eb';">
            <div style="display: flex; align-items: flex-start; gap: 20px;">
              <div style="flex-shrink: 0; width: 56px; height: 56px; background: linear-gradient(135deg, #059669, #16a34a); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: white; font-size: 28px;">visibility</span>
              </div>
              <div>
                <h3 style="font-size: 1.3rem; font-weight: 700; color: #166534; margin: 0 0 10px 0;">Our Vision</h3>
                <p style="font-size: 0.95rem; color: #6b7280; line-height: 1.7; margin: 0;">To become the most trusted meal delivery service, making healthy eating accessible and affordable for everyone. We envision a world where nutritious food is not a luxury but a daily convenience.</p>
              </div>
            </div>
          </div>
          <!-- Mission Card -->
          <div class="about-vm-card" style="background: white; border-radius: 20px; padding: 36px; border: 1px solid #e5e7eb; transition: all 0.3s ease; animation: cardFadeIn 0.5s ease-out 0.25s both; cursor: default;"
               onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 40px rgba(5,150,105,0.12)'; this.style.borderColor='#a7f3d0';"
               onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='#e5e7eb';">
            <div style="display: flex; align-items: flex-start; gap: 20px;">
              <div style="flex-shrink: 0; width: 56px; height: 56px; background: linear-gradient(135deg, #059669, #16a34a); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: white; font-size: 28px;">flag</span>
              </div>
              <div>
                <h3 style="font-size: 1.3rem; font-weight: 700; color: #166534; margin: 0 0 10px 0;">Our Mission</h3>
                <p style="font-size: 0.95rem; color: #6b7280; line-height: 1.7; margin: 0;">To deliver happiness through food by combining traditional recipes with modern convenience and unwavering quality standards. Every meal we deliver carries the warmth of a home-cooked experience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- OUR VALUES -->
    <section style="padding: 80px 24px; background: white;">
      <div style="max-width: 1100px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 50px; animation: aboutSlideIn 0.6s ease-out 0.1s both;">
          <div style="display: inline-block; background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 20px; margin-bottom: 16px; border: 1px solid #d1fae5; letter-spacing: 0.5px; text-transform: uppercase;">Core Values</div>
          <h2 style="font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; color: #166534; margin: 0 0 12px 0;">What We Stand For</h2>
          <p style="font-size: 1rem; color: #6b7280; max-width: 500px; margin: 0 auto;">The principles that guide every meal we prepare</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px;">
          <div *ngFor="let val of values; let i = index"
               class="about-value-card"
               [style]="'background: white; border-radius: 20px; padding: 32px; border: 1px solid #e5e7eb; text-align: center; transition: all 0.3s ease; animation: cardFadeIn 0.5s ease-out ' + (0.15 + i * 0.1) + 's both;'"
               onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 40px rgba(5,150,105,0.12)'; this.style.borderColor='#a7f3d0';"
               onmouseout="this.style.transform=''; this.style.boxShadow=''; this.style.borderColor='#e5e7eb';">
            <div style="width: 60px; height: 60px; background: #ecfdf5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;">
              <span class="material-icons" style="color: #059669; font-size: 28px;">{{ val.icon }}</span>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #166534; margin: 0 0 10px 0;">{{ val.title }}</h3>
            <p style="font-size: 0.9rem; color: #6b7280; line-height: 1.6; margin: 0;">{{ val.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section style="padding: 80px 24px; background: linear-gradient(135deg, #059669, #047857, #166534); position: relative; overflow: hidden;">
      <div style="position: absolute; top: 10%; left: 5%; width: 200px; height: 200px; background: rgba(255,255,255,0.05); border-radius: 50%; filter: blur(50px);"></div>
      <div style="position: absolute; bottom: 10%; right: 8%; width: 160px; height: 160px; background: rgba(255,255,255,0.04); border-radius: 50%; filter: blur(40px);"></div>
      <div style="max-width: 1100px; margin: 0 auto; position: relative; z-index: 2;">
        <div style="text-align: center; margin-bottom: 50px; animation: aboutSlideIn 0.6s ease-out 0.1s both;">
          <div style="display: inline-block; background: rgba(255,255,255,0.15); color: white; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 20px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.2); letter-spacing: 0.5px; text-transform: uppercase;">Why Us</div>
          <h2 style="font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; color: white; margin: 0 0 12px 0;">Why Choose Vyaru Tiffin?</h2>
          <p style="font-size: 1rem; color: rgba(255,255,255,0.85); max-width: 500px; margin: 0 auto;">Because your health and taste buds deserve the best</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <div *ngFor="let item of whyChooseUs; let i = index"
               [style]="'background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border-radius: 20px; padding: 32px; border: 1px solid rgba(255,255,255,0.15); animation: cardFadeIn 0.5s ease-out ' + (0.15 + i * 0.1) + 's both;'">
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
              <div style="width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: white; font-size: 24px;">{{ item.icon }}</span>
              </div>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: white; margin: 0;">{{ item.title }}</h3>
            </div>
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.85); line-height: 1.65; margin: 0;">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section style="padding: 80px 24px; background: white; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; animation: aboutSlideIn 0.6s ease-out 0.1s both;">
        <div style="font-size: 48px; margin-bottom: 20px;">🍳</div>
        <h2 style="font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #166534; margin: 0 0 14px 0;">Ready to Taste the Difference?</h2>
        <p style="font-size: 1rem; color: #6b7280; line-height: 1.7; margin: 0 0 32px 0;">
          Join thousands of happy customers who enjoy fresh, homestyle meals delivered to their door every day.
        </p>
        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <a routerLink="/meals"
             style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 14px; text-decoration: none; font-size: 1rem; box-shadow: 0 4px 20px rgba(5,150,105,0.3); transition: all 0.3s ease;"
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px rgba(5,150,105,0.4)';"
             onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 20px rgba(5,150,105,0.3)';">
            <span class="material-icons" style="font-size: 20px;">restaurant</span>
            Explore Our Menu
          </a>
          <a routerLink="/contact"
             style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: white; color: #059669; font-weight: 700; border-radius: 14px; text-decoration: none; font-size: 1rem; border: 2px solid #d1fae5; transition: all 0.3s ease;"
             onmouseover="this.style.borderColor='#059669'; this.style.background='#f0fdf4';"
             onmouseout="this.style.borderColor='#d1fae5'; this.style.background='white';">
            <span class="material-icons" style="font-size: 20px;">mail</span>
            Contact Us
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes aboutHeroFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-18px) rotate(5deg); }
    }
    @keyframes aboutSteam {
      0% { opacity: 0; transform: translateY(0) scaleX(1); }
      50% { opacity: 0.25; transform: translateY(-25px) scaleX(1.3); }
      100% { opacity: 0; transform: translateY(-55px) scaleX(1.6); }
    }
    @keyframes aboutSlideIn {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes cardFadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (min-width: 768px) {
      .about-story-text { grid-column: 1; }
      .about-story-visual { grid-column: 2; }
    }
  `],
})
export class AboutComponent {
  heroFloaters = [
    { emoji: '🍕', style: 'position:absolute; top:12%; left:10%; font-size:36px; opacity:0.18; animation: aboutHeroFloat 5s ease-in-out infinite;' },
    { emoji: '🍔', style: 'position:absolute; top:25%; right:12%; font-size:30px; opacity:0.15; animation: aboutHeroFloat 6s ease-in-out 1s infinite;' },
    { emoji: '🥘', style: 'position:absolute; top:55%; left:20%; font-size:28px; opacity:0.12; animation: aboutHeroFloat 4.5s ease-in-out 2s infinite;' },
    { emoji: '🍛', style: 'position:absolute; top:15%; left:50%; font-size:32px; opacity:0.14; animation: aboutHeroFloat 5.5s ease-in-out 0.5s infinite;' },
    { emoji: '🥗', style: 'position:absolute; bottom:20%; right:22%; font-size:30px; opacity:0.16; animation: aboutHeroFloat 7s ease-in-out 1.5s infinite;' },
    { emoji: '🫓', style: 'position:absolute; bottom:30%; left:35%; font-size:26px; opacity:0.12; animation: aboutHeroFloat 5s ease-in-out 3s infinite;' },
  ];

  steamWisps = [
    { style: 'position:absolute; top:22%; left:16%; width:60px; height:3px; background:rgba(255,255,255,0.2); border-radius:50px; animation: aboutSteam 2.5s ease-out infinite;' },
    { style: 'position:absolute; top:18%; right:18%; width:50px; height:2px; background:rgba(255,255,255,0.15); border-radius:50px; animation: aboutSteam 3s ease-out 0.8s infinite;' },
    { style: 'position:absolute; top:45%; left:40%; width:45px; height:2px; background:rgba(255,255,255,0.12); border-radius:50px; animation: aboutSteam 2s ease-out 1.5s infinite;' },
  ];

  values = [
    { icon: 'eco', title: 'Fresh Ingredients', desc: 'We source the freshest ingredients daily from local farms and markets to ensure every meal is nutritious and flavorful.' },
    { icon: 'verified', title: 'Quality First', desc: 'Every meal goes through strict quality checks before it reaches you. We never compromise on taste or hygiene.' },
    { icon: 'favorite', title: 'Customer Love', desc: 'Your satisfaction is our priority. We listen, adapt, and improve to make every meal experience delightful.' },
    { icon: 'schedule', title: 'On-Time Delivery', desc: 'We respect your time. Our reliable delivery network ensures your meals arrive fresh and right on schedule.' },
  ];

  whyChooseUs = [
    { icon: 'restaurant_menu', title: 'Homestyle Recipes', desc: 'Meals prepared just like your kitchen — authentic flavors, no preservatives, pure comfort in every bite.' },
    { icon: 'payments', title: 'Affordable Plans', desc: 'Premium quality meals at prices that don\'t break the bank. Flexible plans to fit every budget and lifestyle.' },
    { icon: 'local_shipping', title: 'Fast Delivery', desc: 'Hot, fresh meals delivered to your doorstep within your chosen time window. Track your order in real-time.' },
  ];
}

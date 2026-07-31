import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact-cta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-white py-14 sm:py-20" aria-label="Contact us">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/30">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div class="p-8 sm:p-10 lg:p-12 text-white">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-bold mb-4 border border-white/10">
                <span class="material-icons text-sm text-orange-400">support_agent</span> Get in Touch
              </span>
              <h2 class="text-2xl sm:text-3xl font-extrabold mb-3">Need Help?</h2>
              <p class="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">Have questions, feedback, or need help with your order? We're here for you. Reach out anytime!</p>

              <div class="space-y-3">
                <a href="tel:+919876543210"
                   class="flex items-center gap-4 p-4 bg-white/[0.06] rounded-2xl hover:bg-white/[0.1] transition-all duration-300 group border border-white/5 hover:border-white/10">
                  <div class="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span class="material-icons text-green-400 text-xl">call</span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400 mb-0.5">Call Us</p>
                    <p class="font-bold text-sm sm:text-base group-hover:text-green-400 transition-colors">+91 98765 43210</p>
                  </div>
                </a>

                <a href="mailto:support&#64;vyarutiffin.com"
                   class="flex items-center gap-4 p-4 bg-white/[0.06] rounded-2xl hover:bg-white/[0.1] transition-all duration-300 group border border-white/5 hover:border-white/10">
                  <div class="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span class="material-icons text-blue-400 text-xl">email</span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400 mb-0.5">Email Us</p>
                    <p class="font-bold text-sm sm:text-base group-hover:text-blue-400 transition-colors">support&#64;vyarutiffin.com</p>
                  </div>
                </a>

                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                   class="flex items-center gap-4 p-4 bg-white/[0.06] rounded-2xl hover:bg-white/[0.1] transition-all duration-300 group border border-white/5 hover:border-white/10">
                  <div class="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span class="material-icons text-emerald-400 text-xl">chat</span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400 mb-0.5">WhatsApp</p>
                    <p class="font-bold text-sm sm:text-base group-hover:text-emerald-400 transition-colors">+91 98765 43210</p>
                  </div>
                </a>

                <div class="flex items-center gap-4 p-4 bg-white/[0.06] rounded-2xl border border-white/5">
                  <div class="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                    <span class="material-icons text-orange-400 text-xl">schedule</span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400 mb-0.5">Operating Hours</p>
                    <p class="font-bold text-sm sm:text-base">Mon - Sat: 7:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-orange-500 to-red-500 p-8 sm:p-10 lg:p-12 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
              <div class="absolute inset-0 opacity-10">
                <div class="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-[80px]"></div>
              </div>
              <div class="relative z-10">
                <div class="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm border border-white/20">
                  <span class="material-icons text-4xl text-white">headset_mic</span>
                </div>
                <h3 class="text-xl sm:text-2xl font-extrabold mb-3">Immediate Help?</h3>
                <p class="text-orange-100 text-sm sm:text-base mb-6 max-w-sm leading-relaxed">Our support team is ready to assist you with any queries about your orders, subscriptions, or account.</p>
                <a routerLink="/contact"
                   class="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-xl text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                  <span class="material-icons text-lg group-hover:rotate-12 transition-transform duration-300">headset_mic</span> Contact Support
                </a>
                <div class="mt-8 flex items-center justify-center gap-6 text-orange-100 text-xs">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span class="font-medium">Online Now</span>
                  </div>
                  <span class="font-medium">Avg. Response: 5 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactCtaComponent {}

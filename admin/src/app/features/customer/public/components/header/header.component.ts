import { Component, signal, computed, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CustomerAuthService } from '../../../../../core/services/customer-auth.service';
import { AppStateService } from '../../../../../core/services/app-state.service';
import { CartStateService } from '../../../../../core/services/cart-state.service';
import { CustomerNotificationApiService } from '../../../../../core/services/customer-notification-api.service';
import { Subscription } from 'rxjs';

interface NavChild {
  label: string;
  route: string;
  description?: string;
  icon: string;
}

interface NavLink {
  label: string;
  route?: string;
  icon: string;
  highlight?: boolean;
  children?: NavChild[];
}

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  template: `
    <header
      style="position: sticky; top: 0; z-index: 50; background: white; transition: box-shadow 0.3s, border-color 0.3s;"
      [style.borderBottom]="scrolled() ? '1px solid #e2e8f0' : '1px solid #f1f5f9'"
      [style.boxShadow]="scrolled() ? '0 4px 24px rgba(0,0,0,0.06)' : 'none'">

      <div style="height: 3px; background: linear-gradient(90deg, #059669, #10b981, #34d399);"></div>

      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px;">
        <div style="display: flex; align-items: center; height: 64px;">

          <!-- Logo -->
          <a routerLink="/"
             style="display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0;"
             aria-label="Vyaru Tiffin Home">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #059669, #10b981); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(5,150,105,0.2);">
              <span style="font-size: 18px; line-height: 1; color: white;">&#127835;</span>
            </div>
            <div style="display: flex; flex-direction: column; line-height: 1.1;">
              <span style="font-size: 1.15rem; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">
                Vyaru<span style="color: #059669;">Tiffin</span>
              </span>
              <span style="font-size: 0.6rem; font-weight: 500; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase;">Pure Veg Meals</span>
            </div>
          </a>

          <!-- Desktop Nav -->
          <nav [style.display]="isDesktop() ? 'flex' : 'none'" style="flex: 1; align-items: center; justify-content: center; gap: 4px;" aria-label="Main navigation">
            <ng-container *ngFor="let link of navLinks; let i = index">
              <!-- With sub-menu -->
              <div
                *ngIf="link.children && link.children.length > 0"
                style="position: relative;"
                (mouseenter)="openDropdown(i)" (mouseleave)="closeDropdown(i)">

                <button
                  style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 999px; font-size: 0.85rem; font-weight: 500; color: #475569; background: transparent; border: none; cursor: pointer; transition: all 0.2s; position: relative;"
                  onmouseover="this.style.background='#f0fdf4'; this.style.color='#059669'"
                  onmouseout="this.style.background=''; this.style.color=''">
                  {{ link.label }}
                      <span class="material-icons" style="font-size: 18px; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);"
                    [style.transform]="dropdownStates[i] ? 'rotate(180deg)' : ''">expand_more</span>
                </button>

                <!-- Dropdown Arrow -->
                <div *ngIf="dropdownStates[i]"
                  style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 0; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid white; filter: drop-shadow(0 -2px 4px rgba(0,0,0,0.04)); z-index: 61;">
                </div>

                <!-- Dropdown -->
                <div
                  *ngIf="dropdownStates[i]"
                  style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px; background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 24px 56px -12px rgba(0,0,0,0.16), 0 8px 24px -8px rgba(0,0,0,0.06); padding: 8px; min-width: 260px; z-index: 60;"
                  (mouseenter)="openDropdown(i)" (mouseleave)="closeDropdown(i)">

                  <a *ngFor="let child of link.children; let ci = index"
                    [routerLink]="child.route"
                    (click)="closeDropdown(i)"
                    style="display: flex; align-items: center; gap: 14px; padding: 11px 14px; border-radius: 12px; text-decoration: none; transition: all 0.15s;"
                    [style.marginTop]="ci > 0 ? '2px' : '0'"
                    onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s;"
                      onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background='#f0fdf4'">
                      <span class="material-icons" style="font-size: 18px; color: #059669;">{{ child.icon }}</span>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-size: 0.85rem; font-weight: 600; color: #0f172a;">{{ child.label }}</span>
                      <span *ngIf="child.description" style="font-size: 0.72rem; color: #94a3b8; margin-top: 1px;">{{ child.description }}</span>
                    </div>
                  </a>
                </div>
              </div>

              <!-- Without sub-menu -->
              <a *ngIf="!link.children || link.children.length === 0"
                [routerLink]="link.route"
                routerLinkActive #rla="routerLinkActive"
                [routerLinkActiveOptions]="{ exact: link.route === '/' }"
                [style.background]="rla.isActive ? '#f0fdf4' : ''"
                [style.color]="rla.isActive ? '#059669' : '#475569'"
                [style.fontWeight]="rla.isActive ? '600' : '500'"
                style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 999px; font-size: 0.85rem; text-decoration: none; transition: all 0.2s; position: relative;"
                onmouseover="this.style.background='#f0fdf4'; this.style.color='#059669'"
                onmouseout="if(!this.classList.contains('active-route')){this.style.background=''; this.style.color=''}">
                <span class="material-icons" style="font-size: 18px;">{{ link.icon }}</span>
                {{ link.label }}
                <span *ngIf="rla.isActive"
                  style="position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; background: #059669; border-radius: 999px; box-shadow: 0 0 6px rgba(5,150,105,0.4);"></span>
              </a>
            </ng-container>
          </nav>

          <!-- Right Actions -->
          <div style="display: flex; align-items: center; gap: 2px; flex-shrink: 0; margin-left: auto;">



            <!-- Cart -->
            <button routerLink="/cart"
              style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border: none; background: transparent; color: #64748b; border-radius: 999px; cursor: pointer; transition: all 0.2s;"
              onmouseover="this.style.background='#f1f5f9'; this.style.color='#059669'"
              onmouseout="this.style.background='transparent'; this.style.color='#64748b'">
              <span class="material-icons" style="font-size: 20px;">shopping_cart</span>
              <span *ngIf="cartCount() > 0"
                style="position: absolute; top: 1px; right: 1px; background: #059669; color: white; font-size: 10px; font-weight: 800; border-radius: 999px; min-width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; padding: 0 4px; box-shadow: 0 2px 6px rgba(5,150,105,0.3);">
                {{ cartCount() > 99 ? '99+' : cartCount() }}
              </span>
            </button>

            <!-- Divider -->
            <div [style.display]="isDesktop() && !isLoggedIn() ? 'block' : 'none'" style="width: 1px; height: 24px; background: #e2e8f0; margin: 0 4px;"></div>

            <!-- Logged Out -->
            <ng-container *ngIf="!isLoggedIn()">
              <a routerLink="/login"
                [style.display]="isDesktop() ? 'inline-flex' : 'none'"
                style="padding: 7px 18px; font-size: 0.82rem; font-weight: 600; color: #059669; border-radius: 999px; text-decoration: none; transition: all 0.2s;"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='transparent'">
                Log in
              </a>
              <a routerLink="/register"
                style="display: inline-flex; align-items: center; padding: 7px 20px; font-size: 0.82rem; font-weight: 600; color: white; background: linear-gradient(135deg, #059669, #10b981); border-radius: 999px; text-decoration: none; transition: all 0.25s; box-shadow: 0 2px 8px rgba(5,150,105,0.2);"
                onmouseover="this.style.boxShadow='0 6px 20px rgba(5,150,105,0.35)'; this.style.transform='translateY(-1px)'"
                onmouseout="this.style.boxShadow='0 2px 8px rgba(5,150,105,0.2)'; this.style.transform='none'">
                Sign Up
              </a>
            </ng-container>

            <!-- Logged In -->
            <ng-container *ngIf="isLoggedIn()">
              <!-- Notifications -->
              <button routerLink="/customer/notifications"
                style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border: none; background: transparent; color: #64748b; border-radius: 999px; cursor: pointer; transition: all 0.2s;"
                onmouseover="this.style.background='#f1f5f9'; this.style.color='#059669'"
                onmouseout="this.style.background='transparent'; this.style.color='#64748b'">
                <span class="material-icons" style="font-size: 20px;">notifications</span>
                <span *ngIf="notificationCount() > 0"
                  style="position: absolute; top: 1px; right: 1px; background: #ef4444; color: white; font-size: 9px; font-weight: 800; border-radius: 999px; min-width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; padding: 0 3px; box-shadow: 0 2px 6px rgba(239,68,68,0.3);">
                  {{ notificationCount() > 99 ? '99+' : notificationCount() }}
                </span>
              </button>

              <!-- Profile -->
              <div style="position: relative;">
                <button (click)="toggleProfileDropdown($event)"
                  [attr.aria-expanded]="profileDropdownOpen()"
                  style="display: flex; align-items: center; gap: 8px; padding: 3px 10px 3px 3px; border-radius: 999px; border: 1.5px solid transparent; background: transparent; cursor: pointer; transition: all 0.2s;"
                  [style.borderColor]="profileDropdownOpen() ? '#d1fae5' : 'transparent'"
                  [style.background]="profileDropdownOpen() ? '#f0fdf4' : 'transparent'"
                  onmouseover="this.style.borderColor='#d1fae5'; this.style.background='#f0fdf4'"
                  onmouseout="this.style.borderColor=''; this.style.background=''">
                  <div style="width: 32px; height: 32px; border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.82rem; font-weight: 700; box-shadow: 0 2px 6px rgba(5,150,105,0.2);">
                    {{ userInitial() }}
                  </div>
                  <span [style.display]="isDesktop() ? 'inline-block' : 'none'"
                    style="font-size: 0.8rem; font-weight: 600; color: #334155; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ userFullName() }}</span>
                  <span class="material-icons" [style.display]="isDesktop() ? 'inline-block' : 'none'"
                    style="font-size: 18px; color: #94a3b8; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);"
                    [style.transform]="profileDropdownOpen() ? 'rotate(180deg)' : ''">expand_more</span>
                </button>

                <!-- Profile Dropdown -->
                <div *ngIf="profileDropdownOpen()"
                  style="position: absolute; right: 0; top: 100%; margin-top: 12px; width: 280px; background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 24px 56px -12px rgba(0,0,0,0.16); padding: 8px; z-index: 60;"
                  (click)="$event.stopPropagation()">

                  <div style="padding: 12px 12px 14px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px;">
                    <div style="width: 44px; height: 44px; border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.1rem; font-weight: 700; flex-shrink: 0;">
                      {{ userInitial() }}
                    </div>
                    <div style="min-width: 0;">
                      <p style="font-size: 0.88rem; font-weight: 700; color: #0f172a; margin: 0 0 2px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ userFullName() }}</p>
                      <p style="font-size: 0.75rem; color: #94a3b8; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ userEmail() }}</p>
                    </div>
                  </div>

                  <div style="padding: 4px 0;">
                    <a *ngFor="let item of accountMenuItems"
                      [routerLink]="item.route"
                      (click)="profileDropdownOpen.set(false)"
                      style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; font-size: 0.82rem; font-weight: 500; color: #334155; text-decoration: none; transition: all 0.15s;"
                      onmouseover="this.style.background='#f0fdf4'; this.style.color='#059669'" onmouseout="this.style.background=''; this.style.color='#334155'">
                      <div style="width: 32px; height: 32px; border-radius: 8px; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s;"
                        onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background='#f8fafc'">
                        <span class="material-icons" style="font-size: 16px; color: #64748b;">{{ item.icon }}</span>
                      </div>
                      <span style="flex: 1;">{{ item.label }}</span>
                      <span *ngIf="item.badge && item.badge() > 0"
                        style="background: #ef4444; color: white; font-size: 10px; font-weight: 800; border-radius: 999px; padding: 1px 7px;">
                        {{ item.badge!() > 99 ? '99+' : item.badge!() }}
                      </span>
                    </a>
                  </div>

                  <div style="border-top: 1px solid #f1f5f9; padding: 4px 0 0;">
                    <button (click)="logout()"
                      style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; font-size: 0.82rem; font-weight: 500; color: #dc2626; border: none; background: transparent; cursor: pointer; width: 100%; text-align: left; transition: all 0.15s;"
                      onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
                      <div style="width: 32px; height: 32px; border-radius: 8px; background: #fef2f2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <span class="material-icons" style="font-size: 16px; color: #dc2626;">logout</span>
                      </div>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </ng-container>

            <!-- Mobile Hamburger -->
            <button (click)="mobileMenuOpen.set(true)"
              [style.display]="isDesktop() ? 'none' : 'flex'"
              style="align-items: center; justify-content: center; width: 38px; height: 38px; border: none; background: transparent; color: #0f172a; border-radius: 999px; cursor: pointer; transition: all 0.2s;"
              onmouseover="this.style.background='#f1f5f9'; this.style.color='#059669'"
              onmouseout="this.style.background='transparent'; this.style.color='#0f172a'">
              <span class="material-icons" style="font-size: 22px;">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Backdrop -->
    <div *ngIf="mobileMenuOpen()" (click)="mobileMenuOpen.set(false)"
      style="position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 100; backdrop-filter: blur(6px);"></div>

    <!-- Mobile Drawer -->
    <div *ngIf="mobileMenuOpen()"
      style="position: fixed; top: 0; right: 0; height: 100%; width: 340px; max-width: 88vw; background: white; z-index: 110; box-shadow: -12px 0 40px rgba(0,0,0,0.12); display: flex; flex-direction: column;">

      <div style="display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #f1f5f9;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #059669, #10b981); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(5,150,105,0.2);">
            <span style="font-size: 16px; line-height: 1; color: white;">&#127835;</span>
          </div>
          <span style="font-size: 1.1rem; font-weight: 800; color: #0f172a;">Vyaru<span style="color: #059669;">Tiffin</span></span>
        </div>
        <button (click)="mobileMenuOpen.set(false)"
          style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: none; background: #f1f5f9; color: #64748b; border-radius: 10px; cursor: pointer; transition: all 0.15s;"
          onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      </div>

      <div *ngIf="isLoggedIn()" style="padding: 18px 20px; border-bottom: 1px solid #f1f5f9;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.1rem; font-weight: 700; box-shadow: 0 2px 8px rgba(5,150,105,0.2);">
            {{ userInitial() }}
          </div>
          <div style="min-width: 0;">
            <p style="font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0 0 2px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ userFullName() }}</p>
            <p style="font-size: 0.75rem; color: #94a3b8; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ userEmail() }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoggedIn()" style="padding: 18px 20px; border-bottom: 1px solid #f1f5f9;">
        <div style="display: flex; gap: 10px;">
          <a routerLink="/login" (click)="mobileMenuOpen.set(false)"
            style="flex: 1; text-align: center; padding: 11px; font-size: 0.85rem; font-weight: 600; color: #059669; border: 1.5px solid #d1fae5; border-radius: 999px; text-decoration: none; transition: all 0.15s;"
            onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='transparent'">
            Log in
          </a>
          <a routerLink="/register" (click)="mobileMenuOpen.set(false)"
            style="flex: 1; text-align: center; padding: 11px; font-size: 0.85rem; font-weight: 600; color: white; background: linear-gradient(135deg, #059669, #10b981); border-radius: 999px; text-decoration: none; box-shadow: 0 2px 8px rgba(5,150,105,0.2); transition: all 0.15s;"
            onmouseover="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.3)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(5,150,105,0.2)'">
            Sign Up
          </a>
        </div>
      </div>

      <nav style="flex: 1; overflow-y: auto; padding: 8px 0;" aria-label="Mobile navigation">
        <ng-container *ngFor="let link of navLinks; let i = index">
          <div *ngIf="link.children && link.children.length > 0">
            <button (click)="toggleMobileSubmenu(i)"
              style="display: flex; align-items: center; gap: 14px; width: 100%; padding: 14px 20px; border: none; background: transparent; font-size: 0.88rem; font-weight: 600; color: #334155; cursor: pointer; text-align: left; transition: all 0.15s;"
              onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <span class="material-icons" style="font-size: 18px; color: #94a3b8;">{{ link.icon }}</span>
              </div>
              <span style="flex: 1;">{{ link.label }}</span>
              <span class="material-icons" style="font-size: 20px; color: #cbd5e1; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);"
                [style.transform]="mobileSubmenuOpen[i] ? 'rotate(180deg)' : ''">expand_more</span>
            </button>
            <div *ngIf="mobileSubmenuOpen[i]" style="background: #f8fafc; padding: 4px 0; margin: 0 12px; border-radius: 12px;">
              <a *ngFor="let child of link.children"
                [routerLink]="child.route" (click)="mobileMenuOpen.set(false); mobileSubmenuOpen[i] = false"
                style="display: flex; align-items: center; gap: 14px; padding: 11px 16px 11px 16px; font-size: 0.82rem; font-weight: 500; color: #64748b; text-decoration: none; transition: all 0.15s; border-radius: 8px;"
                onmouseover="this.style.color='#059669'; this.style.background='#f0fdf4'" onmouseout="this.style.color='#64748b'; this.style.background='transparent'">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: #ecfdf5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-icons" style="font-size: 14px; color: #059669;">{{ child.icon }}</span>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <span>{{ child.label }}</span>
                  <span *ngIf="child.description" style="font-size: 0.7rem; color: #94a3b8;">{{ child.description }}</span>
                </div>
              </a>
            </div>
          </div>

          <a *ngIf="!link.children || link.children.length === 0"
            [routerLink]="link.route" (click)="mobileMenuOpen.set(false)"
            routerLinkActive #mrla="routerLinkActive"
            [routerLinkActiveOptions]="{ exact: link.route === '/' }"
            [style.background]="mrla.isActive ? '#f0fdf4' : ''"
            [style.color]="mrla.isActive ? '#059669' : '#334155'"
            [style.fontWeight]="mrla.isActive ? '700' : '600'"
            style="display: flex; align-items: center; gap: 14px; padding: 14px 20px; font-size: 0.88rem; text-decoration: none; transition: all 0.15s;"
            onmouseover="this.style.background='#f8fafc'" onmouseout="if(!this.classList.contains('mobile-active')){this.style.background=''}">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 18px; color: #94a3b8;">{{ link.icon }}</span>
            </div>
            {{ link.label }}
          </a>
        </ng-container>

        <ng-container *ngIf="isLoggedIn()">
          <div style="border-top: 1px solid #f1f5f9; margin: 12px 20px 8px;"></div>
          <p style="padding: 8px 20px 6px; font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px;">My Account</p>
          <a *ngFor="let item of accountMenuItems"
            [routerLink]="item.route" (click)="mobileMenuOpen.set(false)"
            style="display: flex; align-items: center; gap: 14px; padding: 12px 20px; font-size: 0.82rem; font-weight: 500; color: #475569; text-decoration: none; transition: all 0.15s;"
            onmouseover="this.style.background='#f0fdf4'; this.style.color='#059669'" onmouseout="this.style.background='transparent'; this.style.color='#475569'">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #f8fafc; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 16px; color: #94a3b8;">{{ item.icon }}</span>
            </div>
            <span style="flex: 1;">{{ item.label }}</span>
            <span *ngIf="item.badge && item.badge() > 0"
              style="background: #ef4444; color: white; font-size: 10px; font-weight: 800; border-radius: 999px; padding: 1px 7px;">
              {{ item.badge!() > 99 ? '99+' : item.badge!() }}
            </span>
          </a>
        </ng-container>
      </nav>

      <div *ngIf="isLoggedIn()" style="border-top: 1px solid #f1f5f9; padding: 16px 20px;">
        <button (click)="logout()"
          style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 12px; font-size: 0.85rem; font-weight: 600; color: #dc2626; border: 1.5px solid #fecaca; border-radius: 999px; background: transparent; cursor: pointer; transition: all 0.15s;"
          onmouseover="this.style.background='#fef2f2'; this.style.borderColor='#fca5a5'" onmouseout="this.style.background='transparent'; this.style.borderColor='#fecaca'">
          <span class="material-icons" style="font-size: 18px;">logout</span>
          Logout
        </button>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep .mat-mdc-icon-button {
      --mdc-icon-button-icon-color: currentColor;
    }
  `],
})
export class CustomerHeaderComponent implements OnInit, OnDestroy {
  private authService = inject(CustomerAuthService);
  private appState = inject(AppStateService);
  private cartState = inject(CartStateService);
  private notifApi = inject(CustomerNotificationApiService);
  private router = inject(Router);

  mobileMenuOpen = signal(false);
  profileDropdownOpen = signal(false);
  scrolled = signal(false);

  isDesktop = signal(window.innerWidth >= 1024);

  cartCount = computed(() => this.appState.cartCount());
  notificationCount = computed(() => this.appState.notificationCount());

  dropdownStates: boolean[] = [];
  mobileSubmenuOpen: boolean[] = [];

  private authSub?: Subscription;

  isLoggedIn = signal(false);
  userName = signal('');
  userEmail = signal('');
  userInitial = computed(() => {
    const name = this.userName();
    return name ? name.charAt(0).toUpperCase() : 'U';
  });
  userFullName = computed(() => this.userName() || 'Guest');

  navLinks: NavLink[] = [
    { label: 'Home', route: '/', icon: 'home' },
    {
      label: 'Meals', icon: 'restaurant_menu',
      children: [
        { label: 'All Meals', route: '/meals', description: 'Browse our full menu', icon: 'restaurant' },
        { label: "Today's Special", route: '/meals?is_featured=1', description: 'Chef recommended dishes', icon: 'star' },
      ],
    },
    {
      label: 'Subscriptions', icon: 'card_membership',
      children: [
        { label: 'View Plans', route: '/subscriptions', description: 'Choose a meal plan', icon: 'list_alt' },
        { label: 'How It Works', route: '/subscriptions', description: 'Learn about subscriptions', icon: 'info' },
      ],
    },
    { label: 'Delivery Areas', route: '/delivery-areas', icon: 'local_shipping' },
    {
      label: 'More', icon: 'more_horiz',
      children: [
        { label: 'About Us', route: '/about', description: 'Our story & values', icon: 'group' },
        { label: 'FAQ', route: '/faq', description: 'Frequently asked questions', icon: 'help' },
        { label: 'Contact', route: '/contact', description: 'Get in touch', icon: 'mail' },
        { label: 'Blog', route: '/blog', description: 'Tiffin stories & tips', icon: 'article' },
      ],
    },
  ];

  accountMenuItems = [
    { icon: 'receipt_long', label: 'My Orders', route: '/customer/orders', badge: undefined },
    { icon: 'card_membership', label: 'My Subscriptions', route: '/customer/subscriptions', badge: undefined },
    { icon: 'account_balance_wallet', label: 'Wallet', route: '/customer/wallet', badge: undefined },
    { icon: 'location_on', label: 'My Addresses', route: '/customer/addresses', badge: undefined },
    { icon: 'notifications', label: 'Notifications', route: '/customer/notifications', badge: computed(() => this.notificationCount()) },
    { icon: 'star', label: 'My Reviews', route: '/customer/reviews', badge: undefined },
    { icon: 'support_agent', label: 'Support', route: '/customer/support', badge: undefined },
    { icon: 'settings', label: 'Settings', route: '/customer/settings', badge: undefined },
  ];

  ngOnInit(): void {
    this.dropdownStates = new Array(this.navLinks.length).fill(false);
    this.mobileSubmenuOpen = new Array(this.navLinks.length).fill(false);

    this.authSub = this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn.set(!!user);
      this.userName.set(user?.full_name ?? '');
      this.userEmail.set(user?.email ?? '');
      if (user) {
        this.cartState.loadCart();
        this.loadUnreadCount();
      } else {
        this.appState.updateNotificationCount(0);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 10);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isDesktop.set(window.innerWidth >= 1024);
  }

  toggleProfileDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.profileDropdownOpen.set(!this.profileDropdownOpen());
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.mobileMenuOpen.set(false);
    this.profileDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    if (this.profileDropdownOpen()) {
      this.profileDropdownOpen.set(false);
    }
  }

  openDropdown(index: number): void {
    this.dropdownStates[index] = true;
  }

  closeDropdown(index: number): void {
    this.dropdownStates[index] = false;
  }

  toggleMobileSubmenu(index: number): void {
    this.mobileSubmenuOpen[index] = !this.mobileSubmenuOpen[index];
  }

  logout(): void {
    this.profileDropdownOpen.set(false);
    this.mobileMenuOpen.set(false);
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.router.navigate(['/']);
      },
    });
  }

  private loadUnreadCount(): void {
    this.notifApi.getUnreadCount().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.appState.updateNotificationCount(res.data.unread_count);
        }
      },
    });
  }
}

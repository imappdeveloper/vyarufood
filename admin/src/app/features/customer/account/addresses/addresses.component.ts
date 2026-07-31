import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SeoService } from '../../../../core/services/seo.service';
import { CustomerFrontAddressApiService } from '../../../../core/services/customer-front-address-api.service';
import { CustomerAddress } from '../../../../core/models/customer/customer-address.model';
import { AddressFormComponent } from './address-form.component';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, AddressFormComponent],
  template: `
    <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 0;">
      <!-- Toast -->
      @if (toast) {
        <div style="position: fixed; top: 24px; right: 24px; z-index: 50; animation: slideIn 0.3s ease-out;">
          <div [style]="getToastStyle(toast.type)">
            <span class="material-icons" style="font-size: 20px;">{{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}</span>
            {{ toast.message }}
            <button (click)="toast = null" style="background: none; border: none; cursor: pointer; opacity: 0.6; padding: 2px;">
              <span class="material-icons" style="font-size: 16px;">close</span>
            </button>
          </div>
        </div>
      }

      <!-- Add/Edit Form -->
      @if (showForm) {
        <div style="background: #fff; border-radius: 20px; border: 1px solid #e5e7eb; padding: 28px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <h1 style="font-size: 22px; font-weight: 700; color: #111827; margin: 0;">{{ editingAddress ? 'Edit Address' : 'Add New Address' }}</h1>
            <button (click)="cancelForm()" style="padding: 6px 16px; background: #f3f4f6; color: #374151; font-size: 13px; font-weight: 500; border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
              <span class="material-icons" style="font-size: 16px; vertical-align: middle;">arrow_back</span> Back
            </button>
          </div>
          <app-address-form [address]="editingAddress" (saved)="onAddressSaved($event)" (cancelled)="cancelForm()"></app-address-form>
        </div>
      }

      <!-- Address List -->
      @if (!showForm) {
        <!-- Hero Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); border-radius: 20px; padding: 32px; margin-bottom: 28px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
          <div style="position: absolute; bottom: -60px; left: 30%; width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
          <div style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
            <div>
              <p style="color: rgba(255,255,255,0.75); font-size: 14px; font-weight: 500; letter-spacing: 0.5px; margin: 0 0 4px 0;">ADDRESSES</p>
              <h1 style="color: #fff; font-size: 28px; font-weight: 700; margin: 0 0 4px 0;">My Addresses</h1>
              @if (!loading && addresses.length > 0) {
                <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0;">{{ addresses.length }} address{{ addresses.length !== 1 ? 'es' : '' }} saved</p>
              }
            </div>
            <button (click)="startAdd()" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; background: #fff; color: #059669; font-weight: 600; font-size: 14px; border-radius: 12px; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">add</span> Add Address
            </button>
          </div>
        </div>

        <!-- Loading Skeleton -->
        @if (loading) {
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            @for (i of [1,2,3]; track i) {
              <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background: #e5e7eb;"></div>
                  <div style="height: 20px; background: #e5e7eb; border-radius: 4px; width: 80px;"></div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <div style="height: 14px; background: #e5e7eb; border-radius: 4px; width: 140px;"></div>
                  <div style="height: 12px; background: #e5e7eb; border-radius: 4px; width: 200px;"></div>
                  <div style="height: 12px; background: #e5e7eb; border-radius: 4px; width: 170px;"></div>
                  <div style="height: 12px; background: #e5e7eb; border-radius: 4px; width: 120px;"></div>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                  <div style="height: 28px; background: #e5e7eb; border-radius: 6px; width: 80px;"></div>
                  <div style="height: 28px; background: #e5e7eb; border-radius: 6px; width: 60px;"></div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Empty State -->
        @if (!loading && addresses.length === 0) {
          <div style="background: #fff; border-radius: 20px; padding: 48px 24px; border: 1px solid #e5e7eb; text-align: center;">
            <div style="width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 16px; background: #f0fdf4; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 32px; color: #059669;">location_on</span>
            </div>
            <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">No saved addresses</h2>
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0;">Add a delivery address to make ordering easier.</p>
            <button (click)="startAdd()" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: #059669; color: #fff; font-size: 14px; font-weight: 600; border-radius: 12px; border: none; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
              <span class="material-icons" style="font-size: 18px;">add</span> Add Your First Address
            </button>
          </div>
        }

        <!-- Address Cards -->
        @if (!loading && addresses.length > 0) {
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            @for (addr of addresses; track addr.uuid) {
              <div [style]="getCardStyle(addr)" onmouseover="this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)';this.style.borderColor='#059669'" (mouseout)="resetCardStyle($event, addr)">
                <!-- Header -->
                <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div [style]="getTypeCircleStyle(addr.address_type)">
                      <span class="material-icons" [style]="'font-size: 20px; ' + getTypeIconColor(addr.address_type)">{{ getTypeIcon(addr.address_type) }}</span>
                    </div>
                    <div>
                      <span style="font-size: 14px; font-weight: 600; color: #111827;">{{ addr.address_type_label || addr.address_type }}</span>
                      @if (addr.is_default) {
                        <span style="margin-left: 8px; padding: 1px 8px; font-size: 10px; font-weight: 600; border-radius: 20px; background: #dcfce7; color: #166534;">Default</span>
                      }
                    </div>
                  </div>
                </div>

                <!-- Contact -->
                @if (addr.contact_person || addr.contact_mobile) {
                  <div style="margin-bottom: 8px;">
                    <p style="font-size: 13px; font-weight: 600; color: #111827; margin: 0 0 2px 0;">{{ addr.contact_person }}</p>
                    @if (addr.contact_mobile) {
                      <p style="font-size: 13px; color: #6b7280; margin: 0;">{{ addr.contact_mobile }}</p>
                    }
                  </div>
                }

                <!-- Address -->
                <div style="font-size: 13px; color: #6b7280; margin-bottom: 12px;">
                  @if (addr.house_no || addr.building_name || addr.floor) {
                    <p style="color: #374151; margin: 0 0 2px 0;">{{ getFullAddressLine(addr) }}</p>
                  }
                  @if (addr.street) {
                    <p style="margin: 0 0 2px 0;">{{ addr.street }}</p>
                  }
                  @if (addr.address_line_1) {
                    <p style="margin: 0 0 2px 0;">{{ addr.address_line_1 }}</p>
                  }
                  @if (addr.address_line_2) {
                    <p style="margin: 0 0 2px 0;">{{ addr.address_line_2 }}</p>
                  }
                  <p style="margin: 0 0 2px 0;">{{ getLocationParts(addr) }}</p>
                  @if (getPincodeDisplay(addr)) {
                    <p style="margin: 0;">{{ getPincodeDisplay(addr) }}</p>
                  }
                </div>

                <!-- Landmark -->
                @if (addr.landmark) {
                  <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #9ca3af; margin-bottom: 8px;">
                    <span class="material-icons" style="font-size: 14px;">near_me</span>
                    Near: {{ addr.landmark }}
                  </div>
                }

                <!-- Delivery Instructions -->
                @if (addr.delivery_instruction) {
                  <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #9ca3af; margin-bottom: 12px;">
                    <span class="material-icons" style="font-size: 14px;">info</span>
                    {{ addr.delivery_instruction }}
                  </div>
                }

                <!-- Actions -->
                <div style="display: flex; align-items: center; gap: 8px; padding-top: 12px; border-top: 1px solid #f3f4f6;">
                  @if (!addr.is_default) {
                    <button (click)="setDefault(addr)" [disabled]="actionInProgress === addr.uuid" [style]="'display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; font-size: 12px; font-weight: 500; background: #ecfdf5; color: #059669; border-radius: 8px; border: none; cursor: pointer; transition: all 0.15s;' + (actionInProgress === addr.uuid ? ' opacity: 0.5;' : '')" onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background='#ecfdf5'">
                      @if (actionInProgress === addr.uuid) {
                        <span class="material-icons" style="font-size: 14px; animation: spin 1s linear infinite;">refresh</span>
                      } @else {
                        <span class="material-icons" style="font-size: 14px;">star</span>
                      }
                      Set Default
                    </button>
                  }
                  <button (click)="startEdit(addr)" style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; font-size: 12px; font-weight: 500; background: #f3f4f6; color: #374151; border-radius: 8px; border: none; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
                    <span class="material-icons" style="font-size: 14px;">edit</span> Edit
                  </button>
                  <button (click)="confirmDelete(addr)" [disabled]="actionInProgress === addr.uuid" [style]="'display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; font-size: 12px; font-weight: 500; background: #fef2f2; color: #dc2626; border-radius: 8px; border: none; cursor: pointer; transition: all 0.15s;' + (actionInProgress === addr.uuid ? ' opacity: 0.5;' : '')" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#fef2f2'">
                    <span class="material-icons" style="font-size: 14px;">delete</span> Delete
                  </button>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>

    <!-- Delete Confirmation Modal -->
    @if (deletingAddress) {
      <div (click)="deletingAddress = null" style="position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px;">
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);"></div>
        <div (click)="$event.stopPropagation()" style="position: relative; background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); max-width: 420px; width: 100%; padding: 32px 24px; z-index: 10; text-align: center;">
          <div style="width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 16px; background: #fef2f2; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 28px; color: #dc2626;">delete_forever</span>
          </div>
          <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">Delete this address?</h3>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0;">This address will no longer be available for future orders.</p>
          <div style="display: flex; gap: 12px;">
            <button (click)="deletingAddress = null" style="flex: 1; padding: 12px 16px; background: #fff; color: #374151; font-size: 14px; font-weight: 500; border: 1px solid #d1d5db; border-radius: 12px; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'">Cancel</button>
            <button (click)="deleteAddress()" [disabled]="actionInProgress" [style]="'flex: 1; padding: 12px 16px; background: #dc2626; color: #fff; font-size: 14px; font-weight: 600; border-radius: 12px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s;' + (actionInProgress ? ' opacity: 0.6;' : '')" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">
              @if (actionInProgress) {
                <span class="material-icons" style="font-size: 16px; animation: spin 1s linear infinite;">refresh</span>
              }
              {{ actionInProgress ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @media (max-width: 768px) {
      :host > div > div:nth-child(3) > div { grid-template-columns: 1fr !important; }
    }
  `],
})
export class AddressesComponent implements OnInit, OnDestroy {
  private addressApi = inject(CustomerFrontAddressApiService);
  private seo = inject(SeoService);
  private destroy$ = new Subject<void>();

  addresses: CustomerAddress[] = [];
  loading = true;
  showForm = false;
  editingAddress: CustomerAddress | null = null;
  deletingAddress: CustomerAddress | null = null;
  actionInProgress: string | null = null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null = null;

  ngOnInit(): void {
    this.seo.setPageTitle('My Addresses');
    this.seo.setNoIndex();
    this.loadAddresses();
  }

  ngOnDestroy(): void {
    this.seo.clearNoIndex();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAddresses(): void {
    this.loading = true;
    this.addressApi.getAddresses().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.addresses = res.data;
        }
      },
      error: () => {
        this.loading = false;
        this.showToast('Unable to load addresses.', 'error');
      },
    });
  }

  startAdd(): void {
    this.editingAddress = null;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startEdit(addr: CustomerAddress): void {
    this.editingAddress = addr;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingAddress = null;
  }

  onAddressSaved(addr: CustomerAddress): void {
    const wasEditing = !!this.editingAddress;
    this.showForm = false;
    this.editingAddress = null;
    this.showToast(wasEditing ? 'Address updated successfully.' : 'Address added successfully.', 'success');
    this.loadAddresses();
  }

  confirmDelete(addr: CustomerAddress): void {
    this.deletingAddress = addr;
  }

  deleteAddress(): void {
    if (!this.deletingAddress) return;
    this.actionInProgress = this.deletingAddress.uuid;
    this.addressApi.deleteAddress(this.deletingAddress.uuid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.actionInProgress = null;
        this.deletingAddress = null;
        if (res.success) {
          this.showToast('Address deleted successfully.', 'success');
          this.loadAddresses();
        } else {
          this.showToast(res.message || 'Failed to delete address.', 'error');
        }
      },
      error: (err) => {
        this.actionInProgress = null;
        this.deletingAddress = null;
        this.showToast(err.error?.message || 'Failed to delete address.', 'error');
      },
    });
  }

  setDefault(addr: CustomerAddress): void {
    this.actionInProgress = addr.uuid;
    this.addressApi.setDefault(addr.uuid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.actionInProgress = null;
        if (res.success) {
          this.showToast('Default address updated.', 'success');
          this.loadAddresses();
        } else {
          this.showToast(res.message || 'Failed to update default address.', 'error');
        }
      },
      error: (err) => {
        this.actionInProgress = null;
        this.showToast(err.error?.message || 'Failed to update default address.', 'error');
      },
    });
  }

  getTypeIcon(type: string): string {
    const map: Record<string, string> = {
      home: 'home',
      office: 'business',
      apartment: 'apartment',
      hostel: 'other_houses',
      pg: 'hotel',
      other: 'location_on',
    };
    return map[type] || 'location_on';
  }

  getPincodeDisplay(addr: CustomerAddress): string {
    if (addr.pincode && typeof addr.pincode === 'object') {
      return addr.pincode.pincode || '';
    }
    return '';
  }

  getFullAddressLine(addr: CustomerAddress): string {
    return [addr.house_no, addr.floor, addr.building_name].filter(function(x) { return x; }).join(', ');
  }

  getLocationParts(addr: CustomerAddress): string {
    return [addr.city?.name, addr.state?.name, addr.country?.name].filter(function(x) { return x; }).join(', ');
  }

  getTypeCircleStyle(type: string): string {
    const bg = type === 'home' ? '#e0e7ff' : type === 'office' ? '#fef3c7' : type === 'apartment' ? '#dcfce7' : (type === 'hostel' || type === 'pg') ? '#dbeafe' : '#f3f4f6';
    return 'width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ' + bg + ';';
  }

  getTypeIconColor(type: string): string {
    return type === 'home' ? 'color: #4f46e5;' : type === 'office' ? 'color: #d97706;' : type === 'apartment' ? 'color: #16a34a;' : (type === 'hostel' || type === 'pg') ? 'color: #2563eb;' : 'color: #6b7280;';
  }

  getToastStyle(type: string): string {
    const base = 'display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); font-size: 13px; font-weight: 500;';
    if (type === 'success') {
      return base + ' background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;';
    } else if (type === 'error') {
      return base + ' background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;';
    }
    return base + ' background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;';
  }

  getCardStyle(addr: CustomerAddress): string {
    const borderColor = addr.is_default ? '#059669' : '#e5e7eb';
    const shadow = addr.is_default ? 'box-shadow: 0 0 0 2px rgba(5,150,105,0.15);' : '';
    return 'background: #fff; border-radius: 16px; border: 1px solid ' + borderColor + '; padding: 24px; transition: all 0.2s; ' + shadow;
  }

  resetCardStyle(event: Event, addr: CustomerAddress): void {
    const el = event.currentTarget as HTMLElement;
    if (addr.is_default) {
      el.style.boxShadow = '0 0 0 2px rgba(5,150,105,0.15)';
      el.style.borderColor = '#059669';
    } else {
      el.style.boxShadow = '';
      el.style.borderColor = '#e5e7eb';
    }
  }

  private showToast(message: string, type: 'success' | 'error' | 'info'): void {
    this.toast = { message, type };
    setTimeout(() => { this.toast = null; }, 5000);
  }
}

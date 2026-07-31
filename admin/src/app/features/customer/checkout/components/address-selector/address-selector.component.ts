import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAddress } from '../../../../../core/models/customer/customer-address.model';

@Component({
  selector: 'app-address-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (addresses.length === 0 && !showEmpty) {
      <div style="text-align: center; padding: 2rem 1rem;">
        <div style="width: 56px; height: 56px; margin: 0 auto 1rem; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span class="material-icons" style="color: #9ca3af; font-size: 1.5rem;">location_off</span>
        </div>
        <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem;">No saved addresses yet.</p>
        <button (click)="addNew.emit()"
          style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.5rem 1rem; background: #f0fdf4; border: 1px solid #bbf7d0; color: #059669; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s;"
          onmouseover="this.style.background='#dcfce7'" onmouseout="this.style.background='#f0fdf4'">
          <span class="material-icons" style="font-size: 0.9rem;">add</span> Add your first address
        </button>
      </div>
    }

    @if (addresses.length === 0 && showEmpty) {
      <div style="text-align: center; padding: 1.5rem 1rem;">
        <p style="color: #6b7280; font-size: 0.85rem; margin: 0;">Please add a delivery address to continue.</p>
      </div>
    }

    @if (addresses.length > 0) {
      <div style="display: flex; flex-direction: column; gap: 0.625rem;">
        @for (addr of addresses; track addr.id) {
          <div (click)="selected.emit(addr)"
            style="border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 0.875rem 1rem; cursor: pointer; display: flex; align-items: flex-start; gap: 0.75rem; transition: all 0.2s;"
            [style.border-color]="addr.id === selectedId ? '#059669' : '#e5e7eb'"
            [style.background]="addr.id === selectedId ? '#f0fdf4' : 'white'"
            [style.boxShadow]="addr.id === selectedId ? '0 0 0 3px rgba(5,150,105,0.08)' : 'none'"
            onmouseover="if(this.style.borderColor!=='#059669'){this.style.borderColor='#d1d5db'}"
            onmouseout="if(this.style.borderColor==='#d1d5db'){this.style.borderColor='#e5e7eb'}">
            <!-- Radio -->
            <div style="flex-shrink: 0; padding-top: 2px;">
              <div style="width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"
                [style.border]="addr.id === selectedId ? '2px solid #059669' : '2px solid #d1d5db'">
                @if (addr.id === selectedId) {
                  <div style="width: 10px; height: 10px; border-radius: 50%; background: #059669;"></div>
                }
              </div>
            </div>

            <!-- Content -->
            <div style="flex: 1; min-width: 0;">
              <!-- Tags -->
              <div style="display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.35rem;">
                <span style="display: inline-flex; align-items: center; gap: 0.2rem; padding: 0.15rem 0.5rem; border-radius: 0.25rem; font-size: 0.68rem; font-weight: 500; background: #f3f4f6; color: #374151;">
                  <span class="material-icons" style="font-size: 0.7rem;">{{ addr.address_type === 'home' ? 'home' : addr.address_type === 'office' ? 'business' : 'location_on' }}</span>
                  {{ addr.address_type_label || addr.address_type }}
                </span>
                @if (addr.is_default) {
                  <span style="display: inline-flex; align-items: center; padding: 0.15rem 0.5rem; border-radius: 0.25rem; font-size: 0.68rem; font-weight: 500; background: #f0fdf4; color: #059669; border: 1px solid #bbf7d0;">
                    Default
                  </span>
                }
              </div>

              <!-- Address -->
              <p style="font-size: 0.85rem; font-weight: 600; color: #1e293b; margin: 0;">{{ addr.address_line_1 }}</p>
              @if (addr.address_line_2) {
                <p style="font-size: 0.8rem; color: #6b7280; margin: 0.15rem 0 0;">{{ addr.address_line_2 }}</p>
              }
              <p style="font-size: 0.78rem; color: #6b7280; margin: 0.15rem 0 0;">
                @if (addr.city?.name) { {{ addr.city.name }} }
                @if (addr.state?.name) { , {{ addr.state.name }} }
                @if (addr.pincode?.pincode) { - {{ addr.pincode.pincode }} }
              </p>
              @if (addr.contact_person || addr.contact_mobile) {
                <p style="font-size: 0.7rem; color: #9ca3af; margin: 0.25rem 0 0;">
                  @if (addr.contact_person) { {{ addr.contact_person }} }
                  @if (addr.contact_person && addr.contact_mobile) { &middot; }
                  @if (addr.contact_mobile) { {{ addr.contact_mobile }} }
                </p>
              }
            </div>
          </div>
        }
      </div>
    }

    @if (addresses.length > 0) {
      <button (click)="addNew.emit()"
        style="width: 100%; margin-top: 0.75rem; padding: 0.625rem; border: 2px dashed #d1d5db; border-radius: 0.75rem; background: transparent; color: #6b7280; font-size: 0.8rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem; transition: all 0.2s;"
        onmouseover="this.style.borderColor='#86efac'; this.style.color='#059669'" onmouseout="this.style.borderColor='#d1d5db'; this.style.color='#6b7280'">
        <span class="material-icons" style="font-size: 0.9rem;">add</span> Add new address
      </button>
    }
  `,
})
export class AddressSelectorComponent {
  @Input() addresses: CustomerAddress[] = [];
  @Input() selectedId: number | null = null;
  @Output() selected = new EventEmitter<CustomerAddress>();
  @Output() addNew = new EventEmitter<void>();

  showEmpty = true;
}

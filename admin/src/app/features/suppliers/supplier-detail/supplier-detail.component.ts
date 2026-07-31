import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupplierApiService } from '../../../core/services/supplier-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  Supplier,
  SupplierProduct,
  SupplierDocument,
  SupplierContact,
  SupplierPriceHistory,
  SUPPLIER_TYPES,
} from '../../../core/models/supplier/supplier.model';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading supplier details...</p>
      </div>
    </div>

    <div *ngIf="!loading && supplier" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/suppliers" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Suppliers
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ supplier.supplier_name || supplier.company_name }}</h1>
              <span *ngIf="supplier.is_preferred" style="padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 11px; font-weight: 700; color: white;">
                <span class="material-icons" style="font-size: 12px; vertical-align: middle;">star</span> Preferred
              </span>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getStatusBg(supplier.status)"
                [style.color]="getStatusText(supplier.status)">
                {{ supplier.status | titlecase }}
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
              <span style="font-family: monospace; font-weight: 700;">{{ supplier.supplier_code }}</span>
              <span style="margin: 0 8px;">&bull;</span>
              {{ formatType(supplier.supplier_type) }}
              <span style="margin: 0 8px;">&bull;</span>
              Rating:
              <span style="color: #fbbf24;">
                <span *ngFor="let star of getStars(supplier.rating)" class="material-icons" style="font-size: 14px; vertical-align: middle;">{{ star }}</span>
              </span>
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button (click)="editSupplier()"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; border: none; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </button>
            <button *ngIf="supplier.status === 'active'" (click)="changeStatus('inactive')"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">pause</span> Deactivate
            </button>
            <button *ngIf="supplier.status === 'inactive'" (click)="changeStatus('active')"
              style="padding: 8px 16px; background: rgba(5,150,105,0.4); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(5,150,105,0.6)'" onmouseout="this.style.background='rgba(5,150,105,0.4)'">
              <span class="material-icons" style="font-size: 18px;">check_circle</span> Activate
            </button>
            <button *ngIf="supplier.status !== 'blacklisted' && supplier.status !== 'blocked'" (click)="blacklistSupplier()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">gpp_bad</span> Blacklist
            </button>
            <button *ngIf="supplier.status === 'blacklisted'" (click)="restoreSupplier()"
              style="padding: 8px 16px; background: rgba(5,150,105,0.4); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(5,150,105,0.6)'" onmouseout="this.style.background='rgba(5,150,105,0.4)'">
              <span class="material-icons" style="font-size: 18px;">restore</span> Restore
            </button>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">local_shipping</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Products</p>
              <p style="font-size: 20px; font-weight: 800; color: #166534; margin: 0;">{{ supplier.products_count || 0 }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 20px; color: #7c3aed;">description</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Documents</p>
              <p style="font-size: 20px; font-weight: 800; color: #166534; margin: 0;">{{ supplier.documents_count || 0 }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">contacts</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Contacts</p>
              <p style="font-size: 20px; font-weight: 800; color: #166534; margin: 0;">{{ supplier.contacts_count || 0 }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 20px; color: #d97706;">account_balance</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Current Balance</p>
              <p style="font-size: 20px; font-weight: 800; color: #166534; margin: 0;">{{ supplier.current_balance | number:'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="display: flex; border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
            <button (click)="setActiveTab('overview')"
              style="flex: 1; padding: 14px 20px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s ease; border-bottom: 2px solid transparent;"
              [style.color]="activeTab === 'overview' ? '#059669' : '#6b7280'"
              [style.borderBottomColor]="activeTab === 'overview' ? '#059669' : 'transparent'"
              onmouseover="this.style.color='#059669'" onmouseout="this.style.color=(this.getAttribute('data-active') === 'true' ? '#059669' : '#6b7280')"
              data-active="overview">
              <span class="material-icons" style="font-size: 18px;">info</span> Overview
            </button>
            <button (click)="setActiveTab('products')"
              style="flex: 1; padding: 14px 20px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s ease; border-bottom: 2px solid transparent;"
              [style.color]="activeTab === 'products' ? '#059669' : '#6b7280'"
              [style.borderBottomColor]="activeTab === 'products' ? '#059669' : 'transparent'"
              onmouseover="this.style.color='#059669'" onmouseout="this.style.color=(this.getAttribute('data-active') === 'true' ? '#059669' : '#6b7280')"
              data-active="products">
              <span class="material-icons" style="font-size: 18px;">inventory_2</span> Products
            </button>
            <button (click)="setActiveTab('documents')"
              style="flex: 1; padding: 14px 20px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s ease; border-bottom: 2px solid transparent;"
              [style.color]="activeTab === 'documents' ? '#059669' : '#6b7280'"
              [style.borderBottomColor]="activeTab === 'documents' ? '#059669' : 'transparent'"
              onmouseover="this.style.color='#059669'" onmouseout="this.style.color=(this.getAttribute('data-active') === 'true' ? '#059669' : '#6b7280')"
              data-active="documents">
              <span class="material-icons" style="font-size: 18px;">description</span> Documents
            </button>
            <button (click)="setActiveTab('contacts')"
              style="flex: 1; padding: 14px 20px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s ease; border-bottom: 2px solid transparent;"
              [style.color]="activeTab === 'contacts' ? '#059669' : '#6b7280'"
              [style.borderBottomColor]="activeTab === 'contacts' ? '#059669' : 'transparent'"
              onmouseover="this.style.color='#059669'" onmouseout="this.style.color=(this.getAttribute('data-active') === 'true' ? '#059669' : '#6b7280')"
              data-active="contacts">
              <span class="material-icons" style="font-size: 18px;">contacts</span> Contacts
            </button>
            <button (click)="setActiveTab('pricehistory')"
              style="flex: 1; padding: 14px 20px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s ease; border-bottom: 2px solid transparent;"
              [style.color]="activeTab === 'pricehistory' ? '#059669' : '#6b7280'"
              [style.borderBottomColor]="activeTab === 'pricehistory' ? '#059669' : 'transparent'"
              onmouseover="this.style.color='#059669'" onmouseout="this.style.color=(this.getAttribute('data-active') === 'true' ? '#059669' : '#6b7280')"
              data-active="pricehistory">
              <span class="material-icons" style="font-size: 18px;">trending_up</span> Price History
            </button>
          </div>

          <div *ngIf="activeTab === 'overview'" style="padding: 24px;">
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">business</span>
                  <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Company Information</h3>
                </div>
                <div style="height: 1px; background: #f3f4f6; margin-bottom: 16px;"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Supplier Code</p>
                    <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ supplier.supplier_code }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Supplier Name</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.supplier_name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Company Name</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.company_name }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Supplier Type</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ formatType(supplier.supplier_type) }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Contact Person</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.contact_person || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Email</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.email || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Mobile</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.mobile || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Alternate Mobile</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.alternate_mobile || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Website</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.website || '-' }}</p>
                  </div>
                </div>
              </div>

              <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #7c3aed;">verified</span>
                  <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Compliance</h3>
                </div>
                <div style="height: 1px; background: #f3f4f6; margin-bottom: 16px;"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">GST Number</p>
                    <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ supplier.gst_number || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">PAN Number</p>
                    <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ supplier.pan_number || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">FSSAI License</p>
                    <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ supplier.fssai_license || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Drug License</p>
                    <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ supplier.drug_license || '-' }}</p>
                  </div>
                </div>
              </div>

              <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">location_on</span>
                  <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Address</h3>
                </div>
                <div style="height: 1px; background: #f3f4f6; margin-bottom: 16px;"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div style="grid-column: 1 / -1;">
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Address</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">
                      {{ supplier.address_line_1 || '' }}{{ supplier.address_line_2 ? ', ' + supplier.address_line_2 : '' }}
                    </p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">City</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.city_name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">State</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.state_name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Country</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.country_name || '-' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Pincode</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.pincode || '-' }}</p>
                  </div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 24px;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                    <span class="material-icons" style="font-size: 18px; color: #d97706;">account_balance</span>
                    <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Bank Details</h3>
                  </div>
                  <div style="height: 1px; background: #f3f4f6; margin-bottom: 16px;"></div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                      <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Bank Name</p>
                      <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.bank_name || '-' }}</p>
                    </div>
                    <div>
                      <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Account Holder</p>
                      <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.account_holder_name || '-' }}</p>
                    </div>
                    <div>
                      <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Account Number</p>
                      <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ supplier.account_number || '-' }}</p>
                    </div>
                    <div>
                      <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">IFSC Code</p>
                      <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ supplier.ifsc_code || '-' }}</p>
                    </div>
                    <div>
                      <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Branch</p>
                      <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.branch_name || '-' }}</p>
                    </div>
                  </div>
                </div>

                <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 24px;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                    <span class="material-icons" style="font-size: 18px; color: #3b82f6;">credit_card</span>
                    <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Credit Terms</h3>
                  </div>
                  <div style="height: 1px; background: #f3f4f6; margin-bottom: 16px;"></div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                      <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Credit Limit</p>
                      <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.credit_limit | number:'1.2-2' }}</p>
                    </div>
                    <div>
                      <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Credit Days</p>
                      <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.credit_days }} days</p>
                    </div>
                    <div>
                      <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Payment Terms</p>
                      <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.payment_terms || '-' }}</p>
                    </div>
                    <div>
                      <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Opening Balance</p>
                      <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.opening_balance | number:'1.2-2' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="supplier.remarks" style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #9ca3af;">notes</span>
                  <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Remarks</h3>
                </div>
                <div style="height: 1px; background: #f3f4f6; margin-bottom: 16px;"></div>
                <p style="font-size: 13px; font-weight: 600; color: #374151; margin: 0;">{{ supplier.remarks }}</p>
              </div>

              <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #9ca3af;">history</span>
                  <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Audit</h3>
                </div>
                <div style="height: 1px; background: #f3f4f6; margin-bottom: 16px;"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Created At</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.created_at | date:'medium' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Updated At</p>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ supplier.updated_at | date:'medium' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="activeTab === 'products'" style="padding: 24px;">
            <div *ngIf="productsLoading" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
              <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            </div>
            <div *ngIf="!productsLoading && products.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border: 2px dashed #e5e7eb; border-radius: 12px;">
              <span class="material-icons" style="font-size: 36px; color: #d1d5db; margin-bottom: 12px;">inventory_2</span>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">No products linked to this supplier</p>
            </div>
            <div *ngIf="!productsLoading && products.length > 0" style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Product</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Price</th>
                    <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">MOQ</th>
                    <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Lead Time</th>
                    <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Primary</th>
                    <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of products; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                    [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                    <td style="padding: 12px;">
                      <span style="font-size: 13px; font-weight: 600; color: #1f2937;">{{ row.supplier_product_name || row.inventory_item_name }}</span>
                      <span *ngIf="row.supplier_product_code" style="display: block; font-size: 11px; color: #9ca3af; font-family: monospace;">{{ row.supplier_product_code }}</span>
                    </td>
                    <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600; color: #1f2937;">{{ row.purchase_price | number:'1.2-2' }}</td>
                    <td style="padding: 12px; text-align: center; font-size: 12px; color: #374151;">{{ row.minimum_order_quantity }}</td>
                    <td style="padding: 12px; text-align: center; font-size: 12px; color: #374151;">{{ row.lead_time_days }} days</td>
                    <td style="padding: 12px; text-align: center;">
                      <span *ngIf="row.is_primary_supplier" class="material-icons" style="font-size: 18px; color: #059669; vertical-align: middle;">check_circle</span>
                      <span *ngIf="!row.is_primary_supplier" style="color: #d1d5db;">-</span>
                    </td>
                    <td style="padding: 12px; text-align: center;">
                      <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                        [style.background]="row.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                        [style.color]="row.status === 'active' ? '#047857' : '#6b7280'">{{ row.status | titlecase }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div *ngIf="activeTab === 'documents'" style="padding: 24px;">
            <div *ngIf="documentsLoading" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
              <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            </div>
            <div *ngIf="!documentsLoading && documents.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border: 2px dashed #e5e7eb; border-radius: 12px;">
              <span class="material-icons" style="font-size: 36px; color: #d1d5db; margin-bottom: 12px;">description</span>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">No documents uploaded</p>
            </div>
            <div *ngIf="!documentsLoading && documents.length > 0" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
              <div *ngFor="let doc of documents" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; display: flex; align-items: flex-start; gap: 12px;">
                <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-icons" style="font-size: 20px; color: #047857;">description</span>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ doc.document_name }}</p>
                  <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ formatDocType(doc.document_type) }}</p>
                  <p *ngIf="doc.expiry_date" style="font-size: 11px; margin: 4px 0 0 0;"
                    [style.color]="isExpired(doc.expiry_date) ? '#dc2626' : '#9ca3af'"
                    [style.fontWeight]="isExpired(doc.expiry_date) ? '600' : '400'">
                    Expires: {{ doc.expiry_date | date:'mediumDate' }}
                    <span *ngIf="isExpired(doc.expiry_date)"> (Expired)</span>
                  </p>
                </div>
                <span style="display: inline-flex; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; flex-shrink: 0;"
                  [style.background]="doc.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="doc.status === 'active' ? '#047857' : '#6b7280'">{{ doc.status | titlecase }}</span>
              </div>
            </div>
          </div>

          <div *ngIf="activeTab === 'contacts'" style="padding: 24px;">
            <div *ngIf="contactsLoading" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
              <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            </div>
            <div *ngIf="!contactsLoading && contacts.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border: 2px dashed #e5e7eb; border-radius: 12px;">
              <span class="material-icons" style="font-size: 36px; color: #d1d5db; margin-bottom: 12px;">contacts</span>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">No contacts added</p>
            </div>
            <div *ngIf="!contactsLoading && contacts.length > 0" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
              <div *ngFor="let contact of contacts" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span class="material-icons" style="font-size: 20px; color: #047857;">person</span>
                  </div>
                  <div>
                    <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0; display: flex; align-items: center; gap: 6px;">
                      {{ contact.name }}
                      <span *ngIf="contact.is_primary" style="font-size: 10px; background: #d1fae5; color: #047857; padding: 1px 8px; border-radius: 4px; font-weight: 700;">Primary</span>
                    </p>
                    <p *ngIf="contact.designation" style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ contact.designation }}</p>
                  </div>
                </div>
                <div style="height: 1px; background: #f3f4f6; margin-bottom: 12px;"></div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <div *ngIf="contact.mobile" style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #374151;">
                    <span class="material-icons" style="font-size: 16px; color: #9ca3af;">phone</span>
                    {{ contact.mobile }}
                  </div>
                  <div *ngIf="contact.email" style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #374151;">
                    <span class="material-icons" style="font-size: 16px; color: #9ca3af;">email</span>
                    {{ contact.email }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="activeTab === 'pricehistory'" style="padding: 24px;">
            <div *ngIf="priceHistoryLoading" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
              <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            </div>
            <div *ngIf="!priceHistoryLoading && priceHistory.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border: 2px dashed #e5e7eb; border-radius: 12px;">
              <span class="material-icons" style="font-size: 36px; color: #d1d5db; margin-bottom: 12px;">trending_up</span>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">No price history available</p>
            </div>
            <div *ngIf="!priceHistoryLoading && priceHistory.length > 0" style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Product</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Old Price</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">New Price</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Effective From</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of priceHistory; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                    [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                    <td style="padding: 12px; font-size: 13px; font-weight: 600; color: #1f2937;">{{ row.inventory_item_name }}</td>
                    <td style="padding: 12px; text-align: right; font-size: 12px; color: #9ca3af; text-decoration: line-through;">{{ row.old_price | number:'1.2-2' }}</td>
                    <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600; color: #1f2937;">{{ row.new_price | number:'1.2-2' }}</td>
                    <td style="padding: 12px; font-size: 12px; color: #374151;">{{ row.effective_from | date:'mediumDate' }}</td>
                    <td style="padding: 12px; font-size: 12px; color: #9ca3af;">{{ row.remarks || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class SupplierDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private supplierApi = inject(SupplierApiService);
  private notification = inject(NotificationService);

  supplier: Supplier | null = null;
  loading = true;
  activeTab = 'overview';

  products: SupplierProduct[] = [];
  productsLoading = false;

  documents: SupplierDocument[] = [];
  documentsLoading = false;

  contacts: SupplierContact[] = [];
  contactsLoading = false;

  priceHistory: SupplierPriceHistory[] = [];
  priceHistoryLoading = false;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.loadSupplier(uuid);
      this.loadProducts(uuid);
      this.loadDocuments(uuid);
      this.loadContacts(uuid);
      this.loadPriceHistory(uuid);
    }
  }

  setActiveTab(tab: string): void { this.activeTab = tab; }

  loadSupplier(uuid: string): void {
    this.supplierApi.getSupplier(uuid).subscribe({
      next: (res: any) => {
        this.supplier = res.data ?? null;
        this.loading = false;
      },
      error: (_err: any) => { this.notification.error('Failed to load supplier'); this.router.navigate(['/admin/suppliers']); },
    });
  }

  loadProducts(uuid: string): void {
    this.productsLoading = true;
    this.supplierApi.getSupplierProducts(uuid, { per_page: '100' }).subscribe({
      next: (res: any) => { this.products = res.data || []; this.productsLoading = false; },
      error: (_err: any) => { this.productsLoading = false; },
    });
  }

  loadDocuments(uuid: string): void {
    this.documentsLoading = true;
    this.supplierApi.getSupplierDocuments(uuid).subscribe({
      next: (res: any) => { this.documents = res.data || []; this.documentsLoading = false; },
      error: (_err: any) => { this.documentsLoading = false; },
    });
  }

  loadContacts(uuid: string): void {
    this.contactsLoading = true;
    this.supplierApi.getSupplierContacts(uuid).subscribe({
      next: (res: any) => { this.contacts = res.data || []; this.contactsLoading = false; },
      error: (_err: any) => { this.contactsLoading = false; },
    });
  }

  loadPriceHistory(uuid: string): void {
    this.priceHistoryLoading = true;
    this.supplierApi.getSupplierPriceHistory(uuid).subscribe({
      next: (res: any) => { this.priceHistory = res.data || []; this.priceHistoryLoading = false; },
      error: (_err: any) => { this.priceHistoryLoading = false; },
    });
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'active': return '#d1fae5';
      case 'inactive': return '#f3f4f6';
      case 'blocked': return '#fef3c7';
      case 'blacklisted': return '#fef2f2';
      default: return '#f3f4f6';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return '#047857';
      case 'inactive': return '#6b7280';
      case 'blocked': return '#d97706';
      case 'blacklisted': return '#dc2626';
      default: return '#6b7280';
    }
  }

  formatType(type: string): string {
    return SUPPLIER_TYPES.find((t: { value: string; label: string }) => t.value === type)?.label || type;
  }

  formatDocType(type: string): string {
    const labels: Record<string, string> = {
      gst_certificate: 'GST Certificate', pan_card: 'PAN Card', fssai_license: 'FSSAI License',
      drug_license: 'Drug License', insurance: 'Insurance', agreement: 'Agreement',
      quality_certificate: 'Quality Certificate', other: 'Other',
    };
    return labels[type] || type;
  }

  isExpired(date: string): boolean {
    return new Date(date) < new Date();
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'star' : 'star_border');
    }
    return stars;
  }

  editSupplier(): void {
    if (this.supplier) { this.router.navigate(['/admin/suppliers', this.supplier.uuid, 'edit']); }
  }

  changeStatus(status: string): void {
    if (!this.supplier) return;
    if (window.confirm(`Change supplier status to ${status}?`)) {
      this.supplierApi.changeSupplierStatus(this.supplier.uuid, { status }).subscribe({
        next: () => { this.notification.success('Status updated'); this.loadSupplier(this.supplier!.uuid); },
        error: (err: any) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  blacklistSupplier(): void {
    if (!this.supplier) return;
    const remarks = window.prompt('Reason for blacklisting:');
    if (remarks !== null) {
      this.supplierApi.blacklistSupplier(this.supplier.uuid, { remarks }).subscribe({
        next: () => { this.notification.success('Supplier blacklisted'); this.loadSupplier(this.supplier!.uuid); },
        error: (err: any) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  restoreSupplier(): void {
    if (!this.supplier) return;
    if (window.confirm('Restore this supplier?')) {
      this.supplierApi.restoreSupplier(this.supplier.uuid).subscribe({
        next: () => { this.notification.success('Supplier restored'); this.loadSupplier(this.supplier!.uuid); },
        error: (err: any) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}

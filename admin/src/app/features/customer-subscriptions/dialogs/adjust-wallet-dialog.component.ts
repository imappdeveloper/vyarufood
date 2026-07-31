import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-adjust-wallet-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.15s ease-out;" (click)="onCancel()">
      <div style="background: white; border-radius: 16px; width: 90vw; max-width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);" (click)="$event.stopPropagation()">
        <div style="display: flex; align-items: center; gap: 12px; padding: 20px 24px 0;">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 20px; color: #059669;">account_balance_wallet</span>
          </div>
          <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Adjust Wallet</h2>
        </div>
        <div style="padding: 20px 24px;">
          <form [formGroup]="form">
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Amount <span style="color: #dc2626;">*</span></label>
              <input type="number" formControlName="amount" placeholder="Positive to add, negative to subtract"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('amount')?.invalid && form.get('amount')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('amount')?.hasError('required') && form.get('amount')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Amount is required</p>
              <p *ngIf="form.get('amount')?.hasError('min') && form.get('amount')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Minimum value is -10000</p>
              <p *ngIf="form.get('amount')?.hasError('max') && form.get('amount')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Maximum value is 10000</p>
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Reason</label>
              <textarea formControlName="reason" rows="3" placeholder="Reason for adjustment..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
          </form>
        </div>
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 16px 24px 20px; border-top: 1px solid #f3f4f6;">
          <button (click)="onCancel()"
            style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; border: 1.5px solid #e5e7eb; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
            Cancel
          </button>
          <button (click)="submit()" [disabled]="form.invalid"
            style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            [style.opacity]="form.invalid ? '0.5' : '1'"
            [style.cursor]="form.invalid ? 'not-allowed' : 'pointer'"
            onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)'}" onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform=''}">
            Adjust Wallet
          </button>
        </div>
      </div>
    </div>
    <style>
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    </style>
  `,
})
export class AdjustWalletDialogComponent {
  @Input() data: any = null;
  @Output() close = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    amount: [null, [Validators.required, Validators.min(-10000), Validators.max(10000)]],
    reason: [''],
  });

  submit(): void {
    if (this.form.valid) {
      this.close.emit(this.form.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

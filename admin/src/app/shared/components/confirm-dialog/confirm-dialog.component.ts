import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
             [ngClass]="data.type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'">
          <mat-icon [ngClass]="data.type === 'danger' ? 'text-red-600' : 'text-yellow-600'">
            {{ data.type === 'danger' ? 'warning' : 'help_outline' }}
          </mat-icon>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ data.title }}</h2>
          <p class="mt-2 text-sm text-gray-600">{{ data.message }}</p>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-3">
        <button mat-stroked-button (click)="dialogRef.close(false)">{{ data.cancelText || 'Cancel' }}</button>
        <button mat-flat-button [color]="data.type === 'danger' ? 'warn' : 'primary'" (click)="dialogRef.close(true)">{{ data.confirmText || 'Confirm' }}</button>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  dialogRef = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
}

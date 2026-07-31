import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reusable-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div [class]="size === 'large' ? 'w-full max-w-4xl' : size === 'small' ? 'w-full max-w-sm' : 'w-full max-w-lg'">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-semibold">{{ data.title }}</h2>
        <button mat-icon-button (click)="dialogRef.close()"><mat-icon>close</mat-icon></button>
      </div>
      <div class="p-4">
        <ng-content></ng-content>
      </div>
      @if (data.showActions !== false) {
        <div class="flex items-center justify-end gap-2 p-4 border-t">
          <button mat-stroked-button (click)="dialogRef.close()">{{ data.cancelText || 'Cancel' }}</button>
          <button mat-flat-button color="primary" (click)="dialogRef.close(data)">{{ data.confirmText || 'Save' }}</button>
        </div>
      }
    </div>
  `,
})
export class ReusableDialogComponent {
  dialogRef = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  size: string = 'medium';
}

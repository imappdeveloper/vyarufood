import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleApiService } from '../../../core/services/role-api.service';
import { PermissionApiService } from '../../../core/services/permission-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PermissionGroup } from '../../../core/models/auth/permission.model';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatExpansionModule, MatProgressSpinnerModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <mat-card class="p-6">
        <h1 class="text-2xl font-bold mb-6">{{ isEditing ? 'Edit Role' : 'Create Role' }}</h1>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="w-full mb-4">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" />
            <mat-error>Name is required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full mb-4">
            <mat-label>Display Name</mat-label>
            <input matInput formControlName="display_name" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full mb-4">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3"></textarea>
          </mat-form-field>

          @if (permissionGroups.length > 0) {
            <h2 class="text-lg font-semibold mb-3">Permissions</h2>
            <mat-accordion class="mb-4">
              @for (group of permissionGroups; track group.group) {
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>{{ group.group }}</mat-panel-title>
                    <mat-panel-description>
                      {{ getGroupSelectedCount(group) }} / {{ group.permissions.length }} selected
                    </mat-panel-description>
                  </mat-expansion-panel-header>
                  <div class="flex flex-col gap-2">
                    @for (perm of group.permissions; track perm.id) {
                      <mat-checkbox [formControlName]="'perm_' + perm.id" color="primary">
                        {{ perm.display_name || perm.name }}
                      </mat-checkbox>
                    }
                  </div>
                </mat-expansion-panel>
              }
            </mat-accordion>
          }

          <div class="flex gap-3">
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || isLoading">
              @if (isLoading) { <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div> }
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
            <button mat-stroked-button type="button" routerLink="/roles">Cancel</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
})
export class RoleFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roleApi = inject(RoleApiService);
  private permissionApi = inject(PermissionApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  roleId: number | null = null;
  isLoading = false;
  permissionGroups: PermissionGroup[] = [];

  form = this.fb.group({
    name: ['', Validators.required],
    display_name: [''],
    description: [''],
  });

  ngOnInit(): void {
    this.loadPermissions();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.roleId = +id;
      this.loadRole(this.roleId);
    }
  }

  loadPermissions(): void {
    this.permissionApi.getGrouped().subscribe({
      next: (res) => {
        if (res.data) {
          this.permissionGroups = res.data;
          this.permissionGroups.forEach((group) => {
            group.permissions.forEach((perm) => {
              this.form.addControl('perm_' + perm.id, this.fb.control(false));
            });
          });
        }
      },
    });
  }

  loadRole(id: number): void {
    this.roleApi.getById(id).subscribe({
      next: (res) => {
        if (res.data) {
          const role = res.data;
          this.form.patchValue({
            name: role.name,
            display_name: role.display_name || '',
            description: role.description || '',
          });
          if (role.permissions) {
            role.permissions.forEach((p) => {
              const ctrl = this.form.get('perm_' + p.id);
              if (ctrl) ctrl.setValue(true);
            });
          }
        }
      },
    });
  }

  getGroupSelectedCount(group: PermissionGroup): number {
    return group.permissions.filter((p) => this.form.get('perm_' + p.id)?.value).length;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const v = this.form.value;
    const permissionIds = this.permissionGroups
      .flatMap((g) => g.permissions)
      .filter((p) => this.form.get('perm_' + p.id)?.value)
      .map((p) => p.id);

    const payload = {
      name: v.name!,
      display_name: v.display_name || undefined,
      description: v.description || undefined,
      permission_ids: permissionIds,
    };

    const req = this.isEditing
      ? this.roleApi.update(this.roleId!, payload)
      : this.roleApi.create(payload);

    req.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notification.success(res.message || (this.isEditing ? 'Role updated' : 'Role created'));
        this.router.navigate(['/admin/roles']);
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.error(err.error?.message || 'Operation failed');
      },
    });
  }
}

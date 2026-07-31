import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsApiService } from '../../../../core/services/settings-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CreateAppVersion, UpdateAppVersion, PLATFORMS, VERSION_STATUSES } from '../../../../core/models/setting/app-version.model';

@Component({
  selector: 'app-app-version-form',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  styles: [`
    :host { display: block; }
    .form-section { transition: all 0.2s ease; }
    .form-section:hover { box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.06), 0 2px 4px -2px rgba(99, 102, 241, 0.03); }
    .section-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.3s ease-out; }
  `],
  template: `
    <div class="fade-in max-w-5xl mx-auto">
      <a routerLink="/admin/settings/versions" class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6 group">
        <mat-icon class="mr-1 !text-lg group-hover:-translate-x-0.5 transition-transform">arrow_back</mat-icon>
        Back to App Versions
      </a>

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{{ isEditMode ? 'Edit App Version' : 'Add App Version' }}</h1>
        <p class="mt-1 text-gray-500 text-base">{{ isEditMode ? 'Update the version details' : 'Register a new app version release' }}</p>
      </div>

      @if (loading) {
        <div class="flex items-center justify-center py-20">
          <mat-spinner diameter="40" class="!text-indigo-600"></mat-spinner>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-section bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="section-icon bg-indigo-100">
                <mat-icon class="!text-indigo-600">system_update</mat-icon>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Version Details</h2>
                <p class="text-sm text-gray-500">Platform and version information</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Platform</mat-label>
                <mat-select formControlName="platform">
                  @for (p of platforms; track p) {
                    <mat-option [value]="p">{{ p | titlecase }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Version Name</mat-label>
                <input matInput formControlName="version_name" placeholder="e.g. 2.1.0" />
                <mat-hint>Display version string</mat-hint>
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Version Code</mat-label>
                <input matInput type="number" formControlName="version_code" placeholder="e.g. 42" />
                <mat-hint>Incremental numeric version</mat-hint>
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Minimum Supported Version</mat-label>
                <input matInput formControlName="minimum_supported_version" placeholder="e.g. 2.0.0" />
                <mat-hint>Oldest compatible client version</mat-hint>
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  @for (s of statuses; track s) {
                    <mat-option [value]="s">{{ s | titlecase }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <div class="flex items-center h-full pt-2">
                <mat-slide-toggle formControlName="force_update" color="primary" class="!text-sm">
                  Force Update
                </mat-slide-toggle>
              </div>
              <mat-form-field appearance="outline" class="w-full md:col-span-2">
                <mat-label>Release Notes</mat-label>
                <textarea matInput formControlName="release_notes" rows="6" placeholder="What's new in this version..."></textarea>
              </mat-form-field>
            </div>
          </div>

          <div class="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 sticky bottom-4">
            <p class="text-sm text-gray-400">
              @if (feedbackMessage) {
                <span [ngClass]="feedbackType === 'success' ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'">
                  {{ feedbackMessage }}
                </span>
              } @else {
                {{ isEditMode ? 'Update version details and save' : 'Fill in the form to add a new version' }}
              }
            </p>
            <div class="flex items-center gap-3">
              <button mat-stroked-button type="button" routerLink="/admin/settings/versions" class="!border-gray-300 !text-gray-700 !px-5 !rounded-lg">
                Cancel
              </button>
              <button mat-flat-button type="submit" [disabled]="form.invalid || isSaving"
                class="!bg-indigo-600 !text-white hover:!bg-indigo-700 !px-8 !rounded-lg !font-medium !shadow-md hover:!shadow-lg transition-all disabled:!opacity-50 disabled:!cursor-not-allowed">
                @if (isSaving) {
                  <mat-spinner diameter="18" class="inline-block mr-2 !text-white"></mat-spinner>
                }
                {{ isEditMode ? 'Update Version' : 'Add Version' }}
              </button>
            </div>
          </div>
        </form>
      }
    </div>
  `,
})
export class AppVersionFormComponent implements OnInit {
  private settingsApi = inject(SettingsApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  loading = false;
  isSaving = false;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';
  private versionUuid = '';

  platforms = PLATFORMS;
  statuses = VERSION_STATUSES;

  form = new FormGroup({
    platform: new FormControl('', Validators.required),
    version_name: new FormControl('', Validators.required),
    version_code: new FormControl<number | null>(null, Validators.required),
    minimum_supported_version: new FormControl(''),
    force_update: new FormControl(false),
    release_notes: new FormControl(''),
    status: new FormControl('active', Validators.required),
  });

  ngOnInit(): void {
    this.versionUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditMode = !!this.versionUuid;

    if (this.isEditMode) {
      this.loadVersion();
    }
  }

  loadVersion(): void {
    this.loading = true;
    this.settingsApi.getAppVersion(this.versionUuid).subscribe({
      next: (res) => {
        const version = res.data;
        if (version) {
          this.form.patchValue({
            platform: version.platform,
            version_name: version.version_name,
            version_code: version.version_code,
            minimum_supported_version: version.minimum_supported_version || '',
            force_update: version.force_update,
            release_notes: version.release_notes || '',
            status: version.status,
          });
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load version details');
        this.router.navigate(['/admin/settings/versions']);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving = true;

    const formValue = this.form.value;
    const payload: CreateAppVersion | UpdateAppVersion = {
      platform: formValue.platform!,
      version_name: formValue.version_name!,
      version_code: formValue.version_code!,
      minimum_supported_version: formValue.minimum_supported_version || null,
      force_update: formValue.force_update || false,
      release_notes: formValue.release_notes || null,
      status: formValue.status || 'active',
    };

    const request$ = this.isEditMode
      ? this.settingsApi.updateAppVersion(this.versionUuid, payload as UpdateAppVersion)
      : this.settingsApi.createAppVersion(payload as CreateAppVersion);

    request$.subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showFeedback(res.message || `Version ${this.isEditMode ? 'updated' : 'added'} successfully`, 'success');
        if (!this.isEditMode) {
          this.router.navigate(['/admin/settings/versions']);
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.showFeedback(err.error?.message || `Failed to ${this.isEditMode ? 'update' : 'add'} version`, 'error');
      },
    });
  }

  showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => { this.feedbackMessage = ''; }, 4000);
  }
}

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { StarRatingInputComponent } from '../star-rating-input/star-rating-input.component';
import { Review } from '../../../core/models/review/review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StarRatingInputComponent],
  template: `
    <div class="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
      <div class="flex items-center gap-2 mb-5">
        <span class="material-icons text-amber-500">rate_review</span>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ existingReview ? 'Edit Review' : 'Write a Review' }}
        </h3>
      </div>

      @if (error()) {
        <div class="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <span class="material-icons text-red-500 mt-0.5">error</span>
          <div>
            <p class="text-sm text-red-800 font-medium">{{ error() }}</p>
          </div>
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Your Rating <span class="text-red-500">*</span>
            </label>
            <app-star-rating-input formControlName="rating" size="lg" [showLabel]="true" />
            @if (form.get('rating')?.touched && form.get('rating')?.errors?.['required']) {
              <p class="text-xs text-red-500 mt-1">Please select a rating.</p>
            }
          </div>

          <div>
            <label for="review-title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="review-title"
              type="text"
              formControlName="title"
              placeholder="Summarize your experience"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
            />
            @if (form.get('title')?.touched && form.get('title')?.errors?.['maxlength']) {
              <p class="text-xs text-red-500 mt-1">Title must be at most 200 characters.</p>
            }
          </div>

          <div>
            <label for="review-comment" class="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea
              id="review-comment"
              formControlName="comment"
              rows="4"
              placeholder="Tell others about your experience with this meal..."
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors resize-none"
            ></textarea>
            @if (form.get('comment')?.touched && form.get('comment')?.errors?.['maxlength']) {
              <p class="text-xs text-red-500 mt-1">Review must be at most 2000 characters.</p>
            }
            <p class="text-xs text-gray-400 mt-1">{{ (form.get('comment')?.value?.length || 0) }}/2000</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Photo (optional)</label>
            @if (photoPreview()) {
              <div class="relative inline-block mb-3">
                <img [src]="photoPreview()" class="w-24 h-24 object-cover rounded-xl border border-gray-200" alt="Review photo preview" />
                <button
                  type="button"
                  (click)="removePhoto()"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
                  aria-label="Remove photo"
                >
                  <span class="material-icons text-sm">close</span>
                </button>
              </div>
            } @else {
              <label
                class="inline-flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors cursor-pointer"
                for="photo-input"
              >
                <span class="material-icons text-lg">add_a_photo</span>
                Add Photo
              </label>
              <input
                id="photo-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                (change)="onFileSelect($event)"
                class="hidden"
              />
              <p class="text-xs text-gray-400 mt-1">JPEG, PNG or WebP. Max 5MB.</p>
            }
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              [disabled]="form.invalid || submitting"
              class="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-sm"
            >
              @if (submitting) {
                <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              } @else {
                <span class="material-icons text-base">send</span>
              }
              {{ existingReview ? 'Update Review' : 'Submit Review' }}
            </button>
            @if (existingReview) {
              <button
                type="button"
                (click)="cancelEdit.emit()"
                class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            }
          </div>
        </div>
      </form>
    </div>
  `,
})
export class ReviewFormComponent implements OnInit, OnDestroy {
  @Input() existingReview: Review | null = null;
  @Input() submitting = false;
  @Output() submitReview = new EventEmitter<{ formData: FormData }>();
  @Output() cancelEdit = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  photoPreview = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.form = this.fb.group({
      rating: [this.existingReview?.rating || 0, [Validators.required, Validators.min(1), Validators.max(5)]],
      title: [this.existingReview?.title || '', [Validators.maxLength(200)]],
      comment: [this.existingReview?.comment || '', [Validators.maxLength(2000)]],
    });

    if (this.existingReview?.photo) {
      this.photoPreview.set(this.existingReview.photo);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.error.set('Photo must be smaller than 5MB.');
      input.value = '';
      return;
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      this.error.set('Only JPEG, PNG and WebP images are allowed.');
      input.value = '';
      return;
    }

    this.error.set(null);
    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  removePhoto(): void {
    this.selectedFile.set(null);
    this.photoPreview.set(null);
  }

  onSubmit(): void {
    this.error.set(null);

    if (this.form.get('rating')?.value === 0) {
      this.error.set('Please select a rating.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('rating', String(this.form.get('rating')?.value));

    const title = this.form.get('title')?.value?.trim();
    if (title) {
      formData.append('title', title);
    }

    const comment = this.form.get('comment')?.value?.trim();
    if (comment) {
      formData.append('comment', comment);
    }

    if (this.selectedFile()) {
      formData.append('photo', this.selectedFile()!);
    }

    this.submitReview.emit({ formData });
  }
}

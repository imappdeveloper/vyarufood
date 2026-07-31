import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
      const hasMinLength = value.length >= 8;

      const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && hasMinLength;
      return valid ? null : {
        strongPassword: { hasUpperCase, hasLowerCase, hasNumeric, hasSpecial, hasMinLength },
      };
    };
  }

  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.trim() === '') {
        return { whitespace: true };
      }
      return null;
    };
  }

  static matchFields(source: string, target: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const sourceControl = group.get(source);
      const targetControl = group.get(target);
      if (!sourceControl || !targetControl) return null;
      return sourceControl.value === targetControl.value ? null : { fieldMismatch: true };
    };
  }

  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const valid = /^[+]?[0-9]{10,15}$/.test(value);
      return valid ? null : { phone: true };
    };
  }

  static noHtmlTags(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const hasHtml = /<[^>]*>/g.test(value);
      return hasHtml ? { htmlTags: true } : null;
    };
  }
}

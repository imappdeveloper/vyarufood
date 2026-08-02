import { Injectable } from '@angular/core';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  type Auth,
  type ConfirmationResult,
  type User,
} from 'firebase/auth';
import { environment } from '../../../environments/environment';

export interface GoogleSignInResult {
  idToken: string;
  name: string;
  email: string;
  photo: string | null;
}

@Injectable({ providedIn: 'root' })
export class FirebaseOtpService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private confirmation: ConfirmationResult | null = null;

  get enabled(): boolean {
    return !!environment.firebase?.apiKey;
  }

  hasPending(): boolean {
    return !!this.confirmation;
  }

  private ensureAuth(): Auth {
    if (!this.auth) {
      this.app = initializeApp(environment.firebase);
      this.auth = getAuth(this.app);
    }
    return this.auth;
  }

  async sendOtp(phoneE164: string, container: HTMLElement): Promise<void> {
    this.confirmation = null;
    if (!this.enabled) return;
    const auth = this.ensureAuth();
    const verifier = new RecaptchaVerifier(auth, container, { size: 'invisible' });
    try {
      this.confirmation = await signInWithPhoneNumber(auth, phoneE164, verifier);
    } catch (err) {
      console.error('[FirebaseOtpService] signInWithPhoneNumber failed:', err);
      throw err;
    }
  }

  async verifyOtp(code: string): Promise<User> {
    if (!this.confirmation) {
      throw new Error('No pending Firebase verification.');
    }
    const userCredential = await this.confirmation.confirm(code);
    return userCredential.user;
  }

  async signInWithGoogle(): Promise<GoogleSignInResult> {
    if (!this.enabled) {
      throw new Error('Firebase is not configured.');
    }
    const auth = this.ensureAuth();
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const idToken = await credential.user.getIdToken();
    const additional = getAdditionalUserInfo(credential);
    return {
      idToken,
      name: credential.user.displayName ?? (additional?.profile?.['name'] as string | undefined) ?? '',
      email: credential.user.email ?? '',
      photo: credential.user.photoURL ?? null,
    };
  }

  async getIdToken(): Promise<string | null> {
    const auth = this.auth;
    if (!auth?.currentUser) return null;
    return auth.currentUser.getIdToken();
  }

  reset(): void {
    this.confirmation = null;
  }

  friendlyError(error: unknown): string {
    const code = (error as { code?: string })?.code ?? '';
    switch (code) {
      case 'auth/unauthorized-domain':
        return 'SMS sending is not allowed from this domain. Add it in Firebase Console → Authentication → Authorized domains.';
      case 'auth/missing-phone-number':
      case 'auth/invalid-phone-number':
        return 'Please enter a valid phone number with country code.';
      case 'auth/quota-exceeded':
        return 'SMS quota exceeded. Please try again later.';
      case 'auth/expired-action-code':
        return 'This OTP has expired. Please request a new one.';
      case 'auth/invalid-verification-code':
      case 'auth/missing-verification-code':
        return 'Invalid OTP. Please check the code from the SMS and try again.';
      case 'auth/captcha-check-failed':
      case 'auth/recaptcha-not-enabled':
        return 'Verification could not be completed. Make sure Phone Authentication and reCAPTCHA are enabled in Firebase.';
      case 'auth/phone-number-not-found':
        return 'No account is linked to this phone number.';
      case 'auth/operation-not-allowed':
        return 'Phone (SMS) sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method → Phone.';
      case 'auth/billing-not-enabled':
        return 'SMS sending needs a billing-enabled Firebase project. Upgrade to the Blaze plan in Firebase Console → Project settings → Usage and billing → Upgrade.';
      case 'auth/invalid-api-key':
        return 'Firebase API key is invalid. Check the apiKey in the environment config.';
      case 'auth/network-request-failed':
        return 'Network error while contacting Firebase. Check your connection and that the API key has no IP restrictions.';
      case 'auth/internal-error':
      case 'auth/configuration-not-found':
      case 'auth/invalid-app-credential':
      case 'auth/missing-app-credential':
        return 'Firebase is misconfigured for this project. Verify the web app config and that Authentication is enabled.';
      default:
        return `SMS could not be sent (${code || 'unknown error'}). Please check your Firebase setup and try again.`;
    }
  }
}

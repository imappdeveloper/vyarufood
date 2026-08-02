import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocationService {
  detectPincode(): Observable<string> {
    return new Observable<string>((subscriber) => {
      if (!navigator.geolocation) {
        subscriber.error(new Error('unsupported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`)
            .then((r) => r.json())
            .then((data) => {
              const pc = data?.address?.postcode;
              if (pc && /^\d{6}$/.test(pc)) {
                subscriber.next(pc);
              } else {
                subscriber.error(new Error('no-pincode'));
              }
              subscriber.complete();
            })
            .catch(() => subscriber.error(new Error('geocode-failed')));
        },
        (err) => {
          subscriber.error(new Error(err.code === err.PERMISSION_DENIED ? 'permission-denied' : 'position-unavailable'));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  friendlyError(code: string): string {
    switch (code) {
      case 'unsupported':
        return 'Location is not supported in this browser. Please enter your pincode manually.';
      case 'permission-denied':
        return 'Location permission denied. Please allow location access in your browser or app settings to auto-detect your pincode, or enter it manually.';
      case 'no-pincode':
        return 'Could not find a valid pincode for your location. Please enter it manually.';
      case 'geocode-failed':
        return 'Unable to detect your area right now. Please enter your pincode manually.';
      default:
        return 'Unable to detect your location. Please enter your pincode manually.';
    }
  }
}

import { Routes } from '@angular/router';
import { customerAuthGuard } from '../../core/guards/customer-auth.guard';
import { guestGuard } from '../../core/guards/guest.guard';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layouts/layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      // Public pages
      { path: '', loadComponent: () => import('./public/home/home.component').then(m => m.HomeComponent) },
      { path: 'about', loadComponent: () => import('./public/about/about.component').then(m => m.AboutComponent) },
      { path: 'contact', loadComponent: () => import('./public/contact/contact.component').then(m => m.ContactComponent) },
      { path: 'faq', loadComponent: () => import('./public/faq/faq.component').then(m => m.FaqComponent) },
      { path: 'privacy-policy', loadComponent: () => import('./public/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent) },
      { path: 'terms-and-conditions', loadComponent: () => import('./public/terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent) },
      { path: 'refund-policy', loadComponent: () => import('./public/refund-policy/refund-policy.component').then(m => m.RefundPolicyComponent) },
      { path: 'cancellation-policy', loadComponent: () => import('./public/cancellation-policy/cancellation-policy.component').then(m => m.CancellationPolicyComponent) },
      { path: 'delivery-areas', loadComponent: () => import('./public/delivery-areas/delivery-areas.component').then(m => m.DeliveryAreasComponent) },
      { path: 'blog', loadComponent: () => import('./public/blog/blog.component').then(m => m.BlogComponent) },
      { path: 'meals', loadComponent: () => import('./public/meals/meals.component').then(m => m.MealsComponent) },
      { path: 'meals/:slug', loadComponent: () => import('./public/meal-detail/meal-detail.component').then(m => m.MealDetailComponent) },
      { path: 'categories/:slug', loadComponent: () => import('./public/category-detail/category-detail.component').then(m => m.CategoryDetailComponent) },
      { path: 'subscriptions', loadComponent: () => import('./public/subscription-plans/subscription-plans.component').then(m => m.SubscriptionPlansComponent) },
      { path: 'subscriptions/:slug', loadComponent: () => import('./public/subscription-plan-detail/subscription-plan-detail.component').then(m => m.SubscriptionPlanDetailComponent) },
      { path: 'holidays', loadComponent: () => import('./public/holidays/holidays.component').then(m => m.CustomerHolidaysComponent) },
      { path: 'subscriptions/:slug/configure', loadComponent: () => import('./public/subscription-configure/subscription-configure.component').then(m => m.SubscriptionConfigureComponent), canActivate: [customerAuthGuard] },

      // Cart / Checkout (public layout, auth-protected where needed)
      { path: 'cart', loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent) },
      { path: 'checkout', loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [customerAuthGuard] },
      { path: 'order-confirmation', loadComponent: () => import('./order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent), canActivate: [customerAuthGuard] },

      // Auth pages (guest only)
      {
        path: '',
        canActivate: [guestGuard],
        children: [
          { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
          { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
          { path: 'verify-otp', loadComponent: () => import('./auth/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent) },
          { path: 'forgot-password', loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
          { path: 'reset-password', loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
        ],
      },

      // Customer account pages (auth-protected, same layout as public)
      {
        path: 'customer',
        canActivate: [customerAuthGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', loadComponent: () => import('./account/dashboard/dashboard.component').then(m => m.DashboardComponent) },
          { path: 'orders', loadComponent: () => import('./account/orders/orders.component').then(m => m.OrdersComponent) },
          { path: 'orders/:id', loadComponent: () => import('./account/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
          { path: 'orders/:id/track', loadComponent: () => import('./account/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent) },
          { path: 'subscriptions', loadComponent: () => import('./account/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent) },
          { path: 'subscriptions/:id', loadComponent: () => import('./account/subscription-detail/subscription-detail.component').then(m => m.SubscriptionDetailComponent) },
          { path: 'wallet', loadComponent: () => import('./account/wallet/wallet.component').then(m => m.WalletComponent) },
          { path: 'addresses', loadComponent: () => import('./account/addresses/addresses.component').then(m => m.AddressesComponent) },
          { path: 'notifications', loadComponent: () => import('./account/notifications/notifications.component').then(m => m.NotificationsComponent) },
          { path: 'reviews', loadComponent: () => import('./account/reviews/reviews.component').then(m => m.ReviewsComponent) },
          { path: 'support', loadComponent: () => import('./account/support/support.component').then(m => m.SupportComponent) },
          { path: 'profile', loadComponent: () => import('./account/profile/profile.component').then(m => m.ProfileComponent) },
          { path: 'settings', loadComponent: () => import('./account/settings/settings.component').then(m => m.SettingsComponent) },
        ],
      },
    ],
  },
];

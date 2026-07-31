export interface CustomerNotification {
  id: number;
  uuid: string;
  notification_number: string;
  recipient_type: string;
  recipient_id: number;
  template_id: number | null;
  event_name: string | null;
  channel: string;
  title: string;
  message: string;
  payload: Record<string, any> | null;
  priority: string;
  scheduled_at: string | null;
  sent_at: string | null;
  delivery_status: string;
  read_at: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: number;
  uuid: string;
  customer_id: number;
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  marketing_enabled: boolean;
  order_enabled: boolean;
  payment_enabled: boolean;
  subscription_enabled: boolean;
  system_enabled: boolean;
  language: string;
  updated_at: string;
}

export interface NotificationSummary {
  unread_count: number;
}

export type NotificationFilterType = 'all' | 'unread' | 'order' | 'payment' | 'subscription' | 'wallet' | 'promotion' | 'support' | 'system';

export const NOTIFICATION_TYPE_CONFIG: Record<string, { icon: string; color: string; bgColor: string }> = {
  order: { icon: 'receipt_long', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  payment: { icon: 'payment', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  subscription: { icon: 'card_membership', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  wallet: { icon: 'account_balance_wallet', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  promotion: { icon: 'local_offer', color: 'text-pink-600', bgColor: 'bg-pink-100' },
  support: { icon: 'support_agent', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  system: { icon: 'info', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  refund: { icon: 'replay', color: 'text-red-600', bgColor: 'bg-red-100' },
};

export const NOTIFICATION_EVENT_MAP: Record<string, string> = {
  'order.placed': 'order',
  'order.confirmed': 'order',
  'order.preparing': 'order',
  'order.ready': 'order',
  'order.out_for_delivery': 'order',
  'order.delivered': 'order',
  'order.cancelled': 'order',
  'payment.success': 'payment',
  'payment.failed': 'payment',
  'payment.pending': 'payment',
  'payment.cancelled': 'payment',
  'refund.processed': 'refund',
  'subscription.activated': 'subscription',
  'subscription.renewed': 'subscription',
  'subscription.paused': 'subscription',
  'subscription.resumed': 'subscription',
  'subscription.upgraded': 'subscription',
  'subscription.expiring': 'subscription',
  'subscription.expired': 'subscription',
  'subscription.cancelled': 'subscription',
  'wallet.recharge': 'wallet',
  'wallet.payment': 'wallet',
  'wallet.refund': 'wallet',
  'wallet.low_balance': 'wallet',
  'support.ticket': 'support',
  'support.reply': 'support',
  'support.resolved': 'support',
  'promotion.offer': 'promotion',
  'promotion.coupon': 'promotion',
  'system.announcement': 'system',
  'system.maintenance': 'system',
};

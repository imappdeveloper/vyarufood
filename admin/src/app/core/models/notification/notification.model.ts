export interface NotificationTemplate {
  id: number;
  uuid: string;
  template_code: string;
  template_name: string;
  notification_type: string;
  channel: string;
  subject: string | null;
  title: string | null;
  message: string;
  variables: string[] | null;
  language: string;
  status: string;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  uuid: string;
  notification_number: string;
  recipient_type: string;
  recipient_id: number | null;
  template_id: number | null;
  event_name: string | null;
  channel: string;
  title: string;
  message: string;
  payload: any;
  priority: string;
  scheduled_at: string | null;
  sent_at: string | null;
  delivery_status: string;
  read_at: string | null;
  failure_reason: string | null;
  template?: NotificationTemplate;
  logs?: NotificationLog[];
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: number;
  uuid: string;
  notification_id: number;
  provider: string;
  provider_message_id: string | null;
  request_payload: any;
  response_payload: any;
  status: string;
  sent_at: string | null;
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

export interface NotificationDashboardStats {
  total_notifications: number;
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
  read: number;
  today_count: number;
  today_sent: number;
}

export type NotificationType = 'transactional' | 'marketing' | 'system' | 'reminder';
export type NotificationChannel = 'push' | 'email' | 'sms' | 'in_app' | 'whatsapp';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';
export type DeliveryStatus = 'pending' | 'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'cancelled';
export type TemplateStatus = 'active' | 'inactive';

export const NOTIFICATION_TYPES: { value: NotificationType; label: string }[] = [
  { value: 'transactional', label: 'Transactional' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'system', label: 'System' },
  { value: 'reminder', label: 'Reminder' },
];

export const NOTIFICATION_CHANNELS: { value: NotificationChannel; label: string; icon: string }[] = [
  { value: 'push', label: 'Push', icon: 'notifications' },
  { value: 'email', label: 'Email', icon: 'email' },
  { value: 'sms', label: 'SMS', icon: 'sms' },
  { value: 'in_app', label: 'In-App', icon: 'web' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
];

export const NOTIFICATION_PRIORITIES: { value: NotificationPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High', color: 'bg-amber-100 text-amber-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
];

export const DELIVERY_STATUSES: { value: DeliveryStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  { value: 'queued', label: 'Queued', color: 'bg-blue-100 text-blue-800' },
  { value: 'sent', label: 'Sent', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'read', label: 'Read', color: 'bg-purple-100 text-purple-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
];

export const TEMPLATE_STATUSES: { value: TemplateStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
];

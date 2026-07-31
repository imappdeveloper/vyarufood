<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General
            ['setting_group' => 'general', 'setting_key' => 'site_name', 'setting_value' => 'Vyarufood Tiffin', 'data_type' => 'string'],
            ['setting_group' => 'general', 'setting_key' => 'site_tagline', 'setting_value' => 'Fresh Tiffin Service', 'data_type' => 'string'],
            ['setting_group' => 'general', 'setting_key' => 'site_url', 'setting_value' => 'https://vyarufood.com', 'data_type' => 'string'],
            ['setting_group' => 'general', 'setting_key' => 'support_email', 'setting_value' => 'support@vyarufood.com', 'data_type' => 'string'],
            ['setting_group' => 'general', 'setting_key' => 'support_phone', 'setting_value' => '+91-9876543210', 'data_type' => 'string'],

            // Company
            ['setting_group' => 'company', 'setting_key' => 'company_name', 'setting_value' => 'Vyarufood Tiffin Services Pvt Ltd', 'data_type' => 'string'],
            ['setting_group' => 'company', 'setting_key' => 'company_address', 'setting_value' => '123, Food Street, Mumbai, Maharashtra 400001', 'data_type' => 'text'],
            ['setting_group' => 'company', 'setting_key' => 'company_phone', 'setting_value' => '+91-9876543210', 'data_type' => 'string'],
            ['setting_group' => 'company', 'setting_key' => 'company_email', 'setting_value' => 'info@vyarufood.com', 'data_type' => 'string'],
            ['setting_group' => 'company', 'setting_key' => 'company_website', 'setting_value' => 'https://vyarufood.com', 'data_type' => 'string'],
            ['setting_group' => 'company', 'setting_key' => 'gst_number', 'setting_value' => '27AABCV1234H1ZV', 'data_type' => 'string', 'is_encrypted' => true],
            ['setting_group' => 'company', 'setting_key' => 'fssai_number', 'setting_value' => '12345678901234', 'data_type' => 'string', 'is_encrypted' => true],

            // Branding
            ['setting_group' => 'branding', 'setting_key' => 'logo_path', 'setting_value' => null, 'data_type' => 'string'],
            ['setting_group' => 'branding', 'setting_key' => 'favicon_path', 'setting_value' => null, 'data_type' => 'string'],
            ['setting_group' => 'branding', 'setting_key' => 'primary_color', 'setting_value' => '#FF6B00', 'data_type' => 'string'],
            ['setting_group' => 'branding', 'setting_key' => 'secondary_color', 'setting_value' => '#1A1A2E', 'data_type' => 'string'],

            // Localization
            ['setting_group' => 'localization', 'setting_key' => 'default_language', 'setting_value' => 'en', 'data_type' => 'string'],
            ['setting_group' => 'localization', 'setting_key' => 'timezone', 'setting_value' => 'Asia/Kolkata', 'data_type' => 'string'],
            ['setting_group' => 'localization', 'setting_key' => 'currency_code', 'setting_value' => 'INR', 'data_type' => 'string'],
            ['setting_group' => 'localization', 'setting_key' => 'currency_symbol', 'setting_value' => '₹', 'data_type' => 'string'],

            // Email SMTP
            ['setting_group' => 'email', 'setting_key' => 'smtp_host', 'setting_value' => 'smtp.mailtrap.io', 'data_type' => 'string', 'is_encrypted' => true],
            ['setting_group' => 'email', 'setting_key' => 'smtp_port', 'setting_value' => '587', 'data_type' => 'integer'],
            ['setting_group' => 'email', 'setting_key' => 'smtp_username', 'setting_value' => '', 'data_type' => 'string', 'is_encrypted' => true],
            ['setting_group' => 'email', 'setting_key' => 'smtp_password', 'setting_value' => '', 'data_type' => 'string', 'is_encrypted' => true],
            ['setting_group' => 'email', 'setting_key' => 'smtp_encryption', 'setting_value' => 'tls', 'data_type' => 'string'],
            ['setting_group' => 'email', 'setting_key' => 'from_address', 'setting_value' => 'noreply@vyarufood.com', 'data_type' => 'string'],
            ['setting_group' => 'email', 'setting_key' => 'from_name', 'setting_value' => 'Vyarufood Tiffin', 'data_type' => 'string'],

            // SMS
            ['setting_group' => 'sms', 'setting_key' => 'sms_provider', 'setting_value' => 'twilio', 'data_type' => 'string'],
            ['setting_group' => 'sms', 'setting_key' => 'sms_api_key', 'setting_value' => '', 'data_type' => 'string', 'is_encrypted' => true],
            ['setting_group' => 'sms', 'setting_key' => 'sms_api_secret', 'setting_value' => '', 'data_type' => 'string', 'is_encrypted' => true],
            ['setting_group' => 'sms', 'setting_key' => 'sms_sender_id', 'setting_value' => 'VYARUF', 'data_type' => 'string'],

            // Firebase FCM
            ['setting_group' => 'firebase', 'setting_key' => 'fcm_server_key', 'setting_value' => '', 'data_type' => 'string', 'is_encrypted' => true],
            ['setting_group' => 'firebase', 'setting_key' => 'fcm_sender_id', 'setting_value' => '', 'data_type' => 'string'],
            ['setting_group' => 'firebase', 'setting_key' => 'fcm_service_account_json', 'setting_value' => '', 'data_type' => 'json', 'is_encrypted' => true],

            // Payment Gateway
            ['setting_group' => 'payment_gateway', 'setting_key' => 'razorpay_key_id', 'setting_value' => '', 'data_type' => 'string', 'is_encrypted' => true],
            ['setting_group' => 'payment_gateway', 'setting_key' => 'razorpay_key_secret', 'setting_value' => '', 'data_type' => 'string', 'is_encrypted' => true],
            ['setting_group' => 'payment_gateway', 'setting_key' => 'razorpay_webhook_secret', 'setting_value' => '', 'data_type' => 'string', 'is_encrypted' => true],
            ['setting_group' => 'payment_gateway', 'setting_key' => 'payment_sandbox_mode', 'setting_value' => 'true', 'data_type' => 'boolean'],

            // Tax & GST
            ['setting_group' => 'tax', 'setting_key' => 'gst_rate', 'setting_value' => '5', 'data_type' => 'float'],
            ['setting_group' => 'tax', 'setting_key' => 'cgst_rate', 'setting_value' => '2.5', 'data_type' => 'float'],
            ['setting_group' => 'tax', 'setting_key' => 'sgst_rate', 'setting_value' => '2.5', 'data_type' => 'float'],
            ['setting_group' => 'tax', 'setting_key' => 'igst_rate', 'setting_value' => '5', 'data_type' => 'float'],

            // Subscription
            ['setting_group' => 'subscription', 'setting_key' => 'trial_days', 'setting_value' => '7', 'data_type' => 'integer'],
            ['setting_group' => 'subscription', 'setting_key' => 'max_pause_days', 'setting_value' => '30', 'data_type' => 'integer'],

            // Kitchen
            ['setting_group' => 'kitchen', 'setting_key' => 'default_prep_time_minutes', 'setting_value' => '30', 'data_type' => 'integer'],
            ['setting_group' => 'kitchen', 'setting_key' => 'max_orders_per_batch', 'setting_value' => '50', 'data_type' => 'integer'],

            // Delivery
            ['setting_group' => 'delivery', 'setting_key' => 'free_delivery_minimum', 'setting_value' => '200', 'data_type' => 'float'],
            ['setting_group' => 'delivery', 'setting_key' => 'delivery_charge', 'setting_value' => '30', 'data_type' => 'float'],
            ['setting_group' => 'delivery', 'setting_key' => 'max_delivery_radius_km', 'setting_value' => '15', 'data_type' => 'float'],

            // Order
            ['setting_group' => 'order', 'setting_key' => 'cancellation_window_minutes', 'setting_value' => '30', 'data_type' => 'integer'],
            ['setting_group' => 'order', 'setting_key' => 'auto_confirm_orders', 'setting_value' => 'true', 'data_type' => 'boolean'],

            // Wallet
            ['setting_group' => 'wallet', 'setting_key' => 'min_wallet_recharge', 'setting_value' => '100', 'data_type' => 'float'],
            ['setting_group' => 'wallet', 'setting_key' => 'max_wallet_balance', 'setting_value' => '10000', 'data_type' => 'float'],
            ['setting_group' => 'wallet', 'setting_key' => 'wallet_expiry_days', 'setting_value' => '365', 'data_type' => 'integer'],

            // Security
            ['setting_group' => 'security', 'setting_key' => 'max_login_attempts', 'setting_value' => '5', 'data_type' => 'integer'],
            ['setting_group' => 'security', 'setting_key' => 'lockout_duration_minutes', 'setting_value' => '15', 'data_type' => 'integer'],
            ['setting_group' => 'security', 'setting_key' => 'session_timeout_minutes', 'setting_value' => '120', 'data_type' => 'integer'],
            ['setting_group' => 'security', 'setting_key' => 'password_min_length', 'setting_value' => '8', 'data_type' => 'integer'],

            // SEO
            ['setting_group' => 'seo', 'setting_key' => 'meta_title', 'setting_value' => 'Vyarufood Tiffin - Fresh Daily Tiffin Service', 'data_type' => 'string'],
            ['setting_group' => 'seo', 'setting_key' => 'meta_description', 'setting_value' => 'Order fresh, homemade tiffin meals delivered to your doorstep.', 'data_type' => 'text'],
            ['setting_group' => 'seo', 'setting_key' => 'meta_keywords', 'setting_value' => 'tiffin, food delivery, meal service, subscription meals', 'data_type' => 'text'],
            ['setting_group' => 'seo', 'setting_key' => 'google_analytics_id', 'setting_value' => '', 'data_type' => 'string'],
            ['setting_group' => 'seo', 'setting_key' => 'facebook_pixel_id', 'setting_value' => '', 'data_type' => 'string'],
            ['setting_group' => 'seo', 'setting_key' => 'robots_meta', 'setting_value' => 'index, follow', 'data_type' => 'string'],
            ['setting_group' => 'seo', 'setting_key' => 'enable_sitemap', 'setting_value' => 'true', 'data_type' => 'boolean'],

            // API
            ['setting_group' => 'api', 'setting_key' => 'rate_limit_per_minute', 'setting_value' => '60', 'data_type' => 'integer'],
            ['setting_group' => 'api', 'setting_key' => 'api_version', 'setting_value' => 'v1', 'data_type' => 'string'],

            // Maintenance
            ['setting_group' => 'maintenance', 'setting_key' => 'maintenance_mode', 'setting_value' => 'false', 'data_type' => 'boolean', 'autoload' => false],
            ['setting_group' => 'maintenance', 'setting_key' => 'maintenance_message', 'setting_value' => 'We are currently performing maintenance. Please try again later.', 'data_type' => 'text'],

            // Backup
            ['setting_group' => 'backup', 'setting_key' => 'auto_backup_enabled', 'setting_value' => 'true', 'data_type' => 'boolean'],
            ['setting_group' => 'backup', 'setting_key' => 'backup_frequency', 'setting_value' => 'daily', 'data_type' => 'string'],
            ['setting_group' => 'backup', 'setting_key' => 'backup_retention_days', 'setting_value' => '30', 'data_type' => 'integer'],

            // Logging
            ['setting_group' => 'logging', 'setting_key' => 'activity_log_retention_days', 'setting_value' => '90', 'data_type' => 'integer'],
            ['setting_group' => 'logging', 'setting_key' => 'enable_detailed_logging', 'setting_value' => 'true', 'data_type' => 'boolean'],
        ];

        foreach ($settings as $data) {
            $existing = SystemSetting::where('setting_key', $data['setting_key'])->first();

            if (!$existing) {
                $data['uuid'] = Str::uuid();
                SystemSetting::create($data);
            }
        }
    }
}

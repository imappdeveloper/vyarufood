<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\CmsPage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CmsPageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'page_code' => 'about-us',
                'page_title' => 'About Us',
                'slug' => 'about-us',
                'content' => '<h1>About Vyarufood Tiffin</h1><p>We are a premium tiffin service delivering fresh, homemade meals to your doorstep. Our mission is to provide nutritious, delicious food with the warmth of home cooking.</p>',
                'meta_title' => 'About Us - Vyarufood Tiffin',
                'meta_description' => 'Learn about Vyarufood Tiffin, your trusted partner for fresh daily meal delivery.',
                'meta_keywords' => 'about vyarufood, tiffin service, food delivery',
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'page_code' => 'contact-us',
                'page_title' => 'Contact Us',
                'slug' => 'contact-us',
                'content' => '<h1>Contact Us</h1><p>Phone: +91-9876543210</p><p>Email: support@vyarufood.com</p><p>Address: 123, Food Street, Mumbai, Maharashtra 400001</p>',
                'meta_title' => 'Contact Us - Vyarufood Tiffin',
                'meta_description' => 'Get in touch with Vyarufood Tiffin for support and inquiries.',
                'meta_keywords' => 'contact vyarufood, support, phone, email',
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'page_code' => 'privacy-policy',
                'page_title' => 'Privacy Policy',
                'slug' => 'privacy-policy',
                'content' => '<h1>Privacy Policy</h1><p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our tiffin service.</p>',
                'meta_title' => 'Privacy Policy - Vyarufood Tiffin',
                'meta_description' => 'Read our privacy policy to understand how we handle your data.',
                'meta_keywords' => 'privacy policy, data protection, personal information',
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'page_code' => 'terms-conditions',
                'page_title' => 'Terms & Conditions',
                'slug' => 'terms-and-conditions',
                'content' => '<h1>Terms & Conditions</h1><p>By using the Vyarufood Tiffin service, you agree to these terms and conditions. Please read them carefully before placing an order.</p>',
                'meta_title' => 'Terms & Conditions - Vyarufood Tiffin',
                'meta_description' => 'Read the terms and conditions for using Vyarufood Tiffin services.',
                'meta_keywords' => 'terms, conditions, service agreement',
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'page_code' => 'refund-policy',
                'page_title' => 'Refund Policy',
                'slug' => 'refund-policy',
                'content' => '<h1>Refund Policy</h1><p>We offer refunds for cancelled orders as per our cancellation policy. Please refer to this page for detailed refund information.</p>',
                'meta_title' => 'Refund Policy - Vyarufood Tiffin',
                'meta_description' => 'Understand our refund policy for orders and subscriptions.',
                'meta_keywords' => 'refund, money back, cancellation refund',
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'page_code' => 'cancellation-policy',
                'page_title' => 'Cancellation Policy',
                'slug' => 'cancellation-policy',
                'content' => '<h1>Cancellation Policy</h1><p>You can cancel your order up to 30 minutes before the scheduled delivery time. Subscription cancellations require 24 hours notice.</p>',
                'meta_title' => 'Cancellation Policy - Vyarufood Tiffin',
                'meta_description' => 'Learn about our order and subscription cancellation policy.',
                'meta_keywords' => 'cancellation, cancel order, subscription cancellation',
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'page_code' => 'help-center',
                'page_title' => 'Help Center',
                'slug' => 'help-center',
                'content' => '<h1>Help Center</h1><p>Need assistance? Contact our support team at support@vyarufood.com or call +91-9876543210. Our help desk is available Monday to Saturday from 9:00 AM to 8:00 PM.</p>',
                'meta_title' => 'Help Center - Vyarufood Tiffin',
                'meta_description' => 'Get help with your Vyarufood Tiffin orders, subscriptions, and account.',
                'meta_keywords' => 'help, support, assistance, help center',
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'page_code' => 'faq',
                'page_title' => 'FAQs',
                'slug' => 'faq',
                'content' => '<h1>Frequently Asked Questions</h1><p><strong>Q: What are your delivery hours?</strong><br>A: We deliver from 7:00 AM to 9:00 PM.</p><p><strong>Q: How do I pause my subscription?</strong><br>A: You can pause from the app or contact support.</p>',
                'meta_title' => 'FAQs - Vyarufood Tiffin',
                'meta_description' => 'Frequently asked questions about Vyarufood Tiffin service.',
                'meta_keywords' => 'faq, help, support, questions, frequently asked questions',
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'page_code' => 'delivery-areas',
                'page_title' => 'Delivery Areas',
                'slug' => 'delivery-areas',
                'content' => '<h1>Delivery Areas</h1><p>We currently deliver across Mumbai, Pune, and select areas of Thane. Enter your pincode to check if we deliver to your location.</p>',
                'meta_title' => 'Delivery Areas - Vyarufood Tiffin',
                'meta_description' => 'Check if we deliver to your area. See our current delivery coverage zones.',
                'meta_keywords' => 'delivery areas, serviceable pincodes, delivery locations',
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'page_code' => 'report-an-issue',
                'page_title' => 'Report an Issue',
                'slug' => 'report-an-issue',
                'content' => '<h1>Report an Issue</h1><p>Facing a problem with your order or account? Please contact our support team at support@vyarufood.com or call +91-9876543210. We strive to resolve all issues within 24 hours.</p>',
                'meta_title' => 'Report an Issue - Vyarufood Tiffin',
                'meta_description' => 'Report issues with your order, delivery, or account to Vyarufood Tiffin.',
                'meta_keywords' => 'report issue, complaint, problem, support',
                'status' => 'published',
                'published_at' => now(),
            ],
        ];

        foreach ($pages as $data) {
            CmsPage::updateOrCreate(
                ['page_code' => $data['page_code']],
                array_merge($data, [
                    'uuid' => Str::uuid(),
                    'created_by' => null,
                    'updated_by' => null,
                ]),
            );
        }
    }
}

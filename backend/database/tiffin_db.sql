-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 31, 2026 at 03:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tiffin_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `log_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) UNSIGNED DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `causer_type` varchar(255) DEFAULT NULL,
  `causer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `batch_uuid` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `subject_id`, `event`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES
(1, 'supplier', 'Supplier \'Ankit Agrwal\' created', 'App\\Models\\Supplier', 1, 'SupplierCreated', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-26 12:03:05', '2026-07-26 12:03:05'),
(2, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 13:43:22', '2026-07-29 13:43:22'),
(3, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 13:43:54', '2026-07-29 13:43:54'),
(4, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 13:45:56', '2026-07-29 13:45:56'),
(5, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 13:48:07', '2026-07-29 13:48:07'),
(6, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:10:48', '2026-07-29 14:10:48'),
(7, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:16:33', '2026-07-29 14:16:33'),
(8, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:23:05', '2026-07-29 14:23:05'),
(9, 'maintenance', 'Maintenance mode disabled', NULL, NULL, 'disabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:23:22', '2026-07-29 14:23:22'),
(10, 'maintenance', 'Maintenance mode disabled', NULL, NULL, 'disabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:23:30', '2026-07-29 14:23:30'),
(11, 'maintenance', 'Maintenance mode disabled', NULL, NULL, 'disabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:24:18', '2026-07-29 14:24:18'),
(12, 'maintenance', 'Maintenance mode disabled', NULL, NULL, 'disabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:26:13', '2026-07-29 14:26:13'),
(13, 'maintenance', 'Maintenance mode disabled', NULL, NULL, 'disabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:26:32', '2026-07-29 14:26:32'),
(14, 'maintenance', 'Maintenance mode disabled', NULL, NULL, 'disabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:28:13', '2026-07-29 14:28:13'),
(15, 'maintenance', 'Maintenance mode disabled', NULL, NULL, 'disabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:30:02', '2026-07-29 14:30:02'),
(16, 'maintenance', 'Maintenance mode disabled', NULL, NULL, 'disabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:33:54', '2026-07-29 14:33:54'),
(17, 'maintenance', 'Maintenance mode disabled', NULL, NULL, 'disabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:33:57', '2026-07-29 14:33:57'),
(18, 'maintenance', 'Maintenance mode disabled', NULL, NULL, 'disabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:39:49', '2026-07-29 14:39:49'),
(19, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:48:10', '2026-07-29 14:48:10'),
(20, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:48:35', '2026-07-29 14:48:35'),
(21, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:49:13', '2026-07-29 14:49:13'),
(22, 'maintenance', 'Maintenance mode enabled', NULL, NULL, 'enabled', 'App\\Models\\Auth\\Admin', 1, '[]', NULL, '2026-07-29 14:49:39', '2026-07-29 14:49:39');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `profile_photo` varchar(500) DEFAULT NULL,
  `status` enum('active','inactive','pending','suspended') NOT NULL DEFAULT 'active',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `last_login_device` varchar(255) DEFAULT NULL,
  `last_login_browser` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `uuid`, `first_name`, `last_name`, `email`, `mobile`, `password`, `profile_photo`, `status`, `last_login_at`, `last_login_ip`, `last_login_device`, `last_login_browser`, `email_verified_at`, `remember_token`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '175eb3e8-d5d4-48d8-9045-45ddae4340a5', 'Super', 'Admin', 'superadmin@tiffin.local', NULL, '$2y$12$XMvpSb1F8zlJaL3MIdMMvOU0JHG.A84VrCXtk2sECNl4iE8sctZsa', NULL, 'active', '2026-07-31 10:43:44', '::1', 'Unknown', 'Unknown', '2026-07-26 05:22:22', 'xmcRLbq2ZAbOTVgJK2vvToxvmRg2PaAhdbBK2FfjYQNHqrjqgHjUiNoSvJ7M', NULL, NULL, NULL, '2026-07-26 05:22:22', '2026-07-31 10:43:44', NULL),
(2, '016afa39-4218-4245-8f5a-06f5b917ee85', 'Default', 'Admin', 'admin@tiffin.local', NULL, '$2y$12$LxiqOFKw7iFzBKKq7OGlAuEr5bU03TsujPb3N.Y3Cff2SV2mrZasq', NULL, 'active', NULL, NULL, NULL, NULL, '2026-07-26 05:22:22', NULL, NULL, NULL, NULL, '2026-07-26 05:22:22', '2026-07-26 05:22:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `admin_sessions`
--

CREATE TABLE `admin_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `token` varchar(64) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `device` varchar(255) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_activity_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_versions`
--

CREATE TABLE `app_versions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `platform` enum('android','ios','web') NOT NULL,
  `version_name` varchar(50) NOT NULL,
  `version_code` int(11) NOT NULL,
  `minimum_supported_version` varchar(50) DEFAULT NULL,
  `force_update` tinyint(1) NOT NULL DEFAULT 0,
  `release_notes` text DEFAULT NULL,
  `status` enum('active','inactive','deprecated') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `areas`
--

CREATE TABLE `areas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL,
  `state_id` bigint(20) UNSIGNED NOT NULL,
  `city_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `area_code` varchar(20) NOT NULL,
  `postal_zone` varchar(20) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `delivery_radius` decimal(5,2) DEFAULT NULL COMMENT 'Radius in km',
  `minimum_order_amount` decimal(10,2) DEFAULT 0.00,
  `delivery_charge` decimal(10,2) DEFAULT 0.00,
  `estimated_delivery_time` int(11) DEFAULT NULL COMMENT 'Minutes',
  `is_serviceable` tinyint(1) NOT NULL DEFAULT 1,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `areas`
--

INSERT INTO `areas` (`id`, `uuid`, `country_id`, `state_id`, `city_id`, `name`, `area_code`, `postal_zone`, `latitude`, `longitude`, `delivery_radius`, `minimum_order_amount`, `delivery_charge`, `estimated_delivery_time`, `is_serviceable`, `is_default`, `display_order`, `status`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '26b80c57-7179-41b4-a25a-f53f9ee126e4', 1, 1, 1, 'Lashkar Gwalior', 'LASH', '474001', 26.1996600, 78.1532600, 5.00, 150.00, 20.00, 30, 1, 0, 0, 'active', NULL, 1, 1, NULL, '2026-07-30 01:47:20', '2026-07-30 01:47:20', NULL),
(2, 'aeeea294-2753-47db-9ed5-4a7e336b5175', 1, 1, 1, 'Morar Gwalior', 'MOR', '474006', 26.2264000, 78.2248200, 5.00, 150.00, 20.00, 30, 1, 0, 0, 'active', NULL, 1, 1, NULL, '2026-07-30 01:48:58', '2026-07-30 01:48:58', NULL),
(3, 'da5ec22c-cec7-472b-89ae-fd81966151ed', 1, 1, 1, 'Kilagate Gwalior', 'KILA', '474003', 26.2245000, 78.1790000, 5.00, 150.00, 20.00, 30, 1, 0, 0, 'active', NULL, 1, 1, NULL, '2026-07-30 01:50:57', '2026-07-30 01:50:57', NULL),
(4, 'd9aab488-6bd0-424d-81ed-f03c21694ce4', 1, 1, 1, 'Railway Station', 'RAW', '474002', 26.2183000, 78.1828000, 5.00, 150.00, 20.00, 30, 1, 0, 0, 'active', NULL, 1, 1, NULL, '2026-07-30 01:54:34', '2026-07-30 01:54:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bank_accounts`
--

CREATE TABLE `bank_accounts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `account_name` varchar(200) NOT NULL,
  `bank_name` varchar(200) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `branch` varchar(200) DEFAULT NULL,
  `account_type` varchar(30) NOT NULL DEFAULT 'savings',
  `account_id` bigint(20) UNSIGNED DEFAULT NULL,
  `opening_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `current_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bank_book`
--

CREATE TABLE `bank_book` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `bank_account_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_date` date NOT NULL,
  `journal_entry_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` text NOT NULL,
  `cheque_number` varchar(50) DEFAULT NULL,
  `transaction_reference` varchar(100) DEFAULT NULL,
  `debit_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `credit_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `is_reconciled` tinyint(1) NOT NULL DEFAULT 0,
  `reconciled_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bank_reconciliations`
--

CREATE TABLE `bank_reconciliations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `bank_account_id` bigint(20) UNSIGNED NOT NULL,
  `reconciliation_date` date NOT NULL,
  `statement_date` date NOT NULL,
  `opening_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `closing_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_deposits` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_withdrawals` decimal(14,2) NOT NULL DEFAULT 0.00,
  `adjusted_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `difference` decimal(14,2) NOT NULL DEFAULT 0.00,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `reconciled_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reconciled_at` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_charge` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `coupon_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `coupon_code` varchar(50) DEFAULT NULL,
  `wallet_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_percentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `meal_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `special_instructions` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cash_book`
--

CREATE TABLE `cash_book` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `transaction_date` date NOT NULL,
  `journal_entry_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` text NOT NULL,
  `receipt_number` varchar(50) DEFAULT NULL,
  `payment_number` varchar(50) DEFAULT NULL,
  `debit_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `credit_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(30) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chart_of_accounts`
--

CREATE TABLE `chart_of_accounts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `account_code` varchar(20) NOT NULL,
  `account_name` varchar(200) NOT NULL,
  `account_type` varchar(20) NOT NULL,
  `parent_account_id` bigint(20) UNSIGNED DEFAULT NULL,
  `opening_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `current_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(3) NOT NULL DEFAULT 'INR',
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL,
  `state_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `city_code` varchar(20) NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT NULL,
  `population` bigint(20) UNSIGNED DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `area` decimal(12,2) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_metro` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `uuid`, `country_id`, `state_id`, `name`, `city_code`, `latitude`, `longitude`, `timezone`, `population`, `pincode`, `area`, `display_order`, `is_metro`, `status`, `is_default`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '90f452e9-5abf-41e3-8e3f-161dcc178e31', 1, 1, 'Gwalior', 'Gwl', 26.2182870, 78.1828310, 'Asia/Kolkata', 1608000, '474001', 414.00, 0, 0, 'active', 1, NULL, 1, 1, NULL, '2026-07-29 16:17:21', '2026-07-29 16:17:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cms_pages`
--

CREATE TABLE `cms_pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `page_code` varchar(100) NOT NULL,
  `page_title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cms_pages`
--

INSERT INTO `cms_pages` (`id`, `uuid`, `page_code`, `page_title`, `slug`, `content`, `meta_title`, `meta_description`, `meta_keywords`, `status`, `published_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'e7df9dea-6045-40b5-8eb7-bc223658813c', 'about-us', 'About Us', 'about-us', '<h1>About Vyarufood Tiffin</h1><p>We are a premium tiffin service delivering fresh, homemade meals to your doorstep. Our mission is to provide nutritious, delicious food with the warmth of home cooking.</p>', 'About Us - Vyarufood Tiffin', 'Learn about Vyarufood Tiffin, your trusted partner for fresh daily meal delivery.', 'about vyarufood, tiffin service, food delivery', 'published', '2026-07-29 08:53:02', NULL, NULL, '2026-07-29 08:53:02', '2026-07-29 08:53:02', NULL),
(2, '5abd2f43-7b30-4278-a320-abffb2490848', 'contact-us', 'Contact Us', 'contact-us', '<h1>Contact Us</h1><p>Phone: +91-9876543210</p><p>Email: support@vyarufood.com</p><p>Address: 123, Food Street, Mumbai, Maharashtra 400001</p>', 'Contact Us - Vyarufood Tiffin', 'Get in touch with Vyarufood Tiffin for support and inquiries.', 'contact vyarufood, support, phone, email', 'published', '2026-07-29 08:53:02', NULL, NULL, '2026-07-29 08:53:02', '2026-07-29 08:53:02', NULL),
(3, '354e8e9f-41fe-4c21-a536-677f546f93d4', 'privacy-policy', 'Privacy Policy', 'privacy-policy', '<p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our tiffin service.</p>', 'Privacy Policy - Vyarufood Tiffin', 'Read our privacy policy to understand how we handle your data.', 'privacy policy, data protection, personal information', 'published', '2026-07-29 08:53:02', NULL, 1, '2026-07-29 08:53:02', '2026-07-29 09:02:24', NULL),
(4, '47b2c381-efd7-4c5e-abb9-439441e87550', 'terms-conditions', 'Terms & Conditions', 'terms-and-conditions', '<p>By using the Vyarufood Tiffin service, you agree to these terms and conditions. Please read them carefully before placing an order.</p>', 'Terms & Conditions - Vyarufood Tiffin', 'Read the terms and conditions for using Vyarufood Tiffin services.', 'terms, conditions, service agreement', 'published', '2026-07-29 08:53:02', NULL, 1, '2026-07-29 08:53:02', '2026-07-29 09:02:51', NULL),
(5, '56ebecd9-ad0f-4bed-8482-caf38dbf232b', 'refund-policy', 'Refund Policy', 'refund-policy', '<p>We offer refunds for cancelled orders as per our cancellation policy. Please refer to this page for detailed refund information.</p>', 'Refund Policy - Vyarufood Tiffin', 'Understand our refund policy for orders and subscriptions.', 'refund, money back, cancellation refund', 'published', '2026-07-29 08:53:02', NULL, 1, '2026-07-29 08:53:02', '2026-07-29 09:03:36', NULL),
(6, '771e33fc-f673-4009-afbf-3ebd7956217b', 'cancellation-policy', 'Cancellation Policy', 'cancellation-policy', '<p>You can cancel your order up to 30 minutes before the scheduled delivery time. Subscription cancellations require 24 hours notice.</p>', 'Cancellation Policy - Vyarufood Tiffin', 'Learn about our order and subscription cancellation policy.', 'cancellation, cancel order, subscription cancellation', 'published', '2026-07-29 08:53:02', NULL, 1, '2026-07-29 08:53:02', '2026-07-29 09:03:13', NULL),
(7, '75af32ec-af4e-421b-99a3-f9ad10eefd03', 'help-center', 'Help Center', 'help-center', '<h1>Help Center</h1><p>Need assistance? Contact our support team at support@vyarufood.com or call +91-9876543210. Our help desk is available Monday to Saturday from 9:00 AM to 8:00 PM.</p>', 'Help Center - Vyarufood Tiffin', 'Get help with your Vyarufood Tiffin orders, subscriptions, and account.', 'help, support, assistance, help center', 'published', '2026-07-29 08:53:02', NULL, NULL, '2026-07-29 08:53:02', '2026-07-29 08:53:02', NULL),
(8, 'ee6751b6-f201-4f7b-98ff-3a0f9277cc7c', 'faq', 'FAQs', 'faq', '<h1>Frequently Asked Questions</h1><p><strong>Q: What are your delivery hours?</strong><br>A: We deliver from 7:00 AM to 9:00 PM.</p><p><strong>Q: How do I pause my subscription?</strong><br>A: You can pause from the app or contact support.</p>', 'FAQs - Vyarufood Tiffin', 'Frequently asked questions about Vyarufood Tiffin service.', 'faq, help, support, questions, frequently asked questions', 'published', '2026-07-29 08:53:02', NULL, NULL, '2026-07-29 08:53:02', '2026-07-29 08:53:02', NULL),
(9, 'e5872b6f-30bc-4214-9499-87d4ce439597', 'delivery-areas', 'Delivery Areas', 'delivery-areas', '<h1>Delivery Areas</h1><p>We currently deliver across Mumbai, Pune, and select areas of Thane. Enter your pincode to check if we deliver to your location.</p>', 'Delivery Areas - Vyarufood Tiffin', 'Check if we deliver to your area. See our current delivery coverage zones.', 'delivery areas, serviceable pincodes, delivery locations', 'published', '2026-07-29 08:53:02', NULL, NULL, '2026-07-29 08:53:02', '2026-07-29 08:53:02', NULL),
(10, '75f293bd-9ad2-4fd2-91bf-9c53941ee803', 'report-an-issue', 'Report an Issue', 'report-an-issue', '<h1>Report an Issue</h1><p>Facing a problem with your order or account? Please contact our support team at support@vyarufood.com or call +91-9876543210. We strive to resolve all issues within 24 hours.</p>', 'Report an Issue - Vyarufood Tiffin', 'Report issues with your order, delivery, or account to Vyarufood Tiffin.', 'report issue, complaint, problem, support', 'published', '2026-07-29 08:53:02', NULL, NULL, '2026-07-29 08:53:02', '2026-07-29 08:53:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `iso2` varchar(2) NOT NULL,
  `iso3` varchar(3) NOT NULL,
  `numeric_code` varchar(10) DEFAULT NULL,
  `phone_code` varchar(10) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `native_name` varchar(255) DEFAULT NULL,
  `capital` varchar(255) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `currency_symbol` varchar(10) DEFAULT NULL,
  `currency_name` varchar(255) DEFAULT NULL,
  `emoji` varchar(255) DEFAULT NULL,
  `emoji_unicode` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `subregion` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `flag_image` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `uuid`, `iso2`, `iso3`, `numeric_code`, `phone_code`, `name`, `native_name`, `capital`, `currency_code`, `currency_symbol`, `currency_name`, `emoji`, `emoji_unicode`, `latitude`, `longitude`, `region`, `subregion`, `nationality`, `flag_image`, `status`, `sort_order`, `is_default`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '074f64a9-d434-422e-8f5b-625ccdb2c320', 'IN', 'IND', '356', '91', 'India', 'Bharat', 'New Dehli', 'INR', '₹', 'Indian Rupees', NULL, NULL, 20.5937000, 78.9629000, 'Asia', 'Southan Asia', 'Indian', NULL, 'active', 0, 1, NULL, 1, 1, NULL, '2026-07-29 15:54:22', '2026-07-29 15:54:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `country_code` varchar(10) NOT NULL DEFAULT '+91',
  `password` varchar(255) DEFAULT NULL COMMENT 'Optional password for web access',
  `remember_token` varchar(100) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address_line_1` text DEFAULT NULL,
  `address_line_2` text DEFAULT NULL,
  `country_id` bigint(20) UNSIGNED DEFAULT NULL,
  `state_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `area_id` bigint(20) UNSIGNED DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `is_blocked` tinyint(1) NOT NULL DEFAULT 0,
  `block_reason` text DEFAULT NULL,
  `wallet_balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `wallet_currency` varchar(3) NOT NULL DEFAULT 'INR',
  `referral_code` varchar(20) DEFAULT NULL,
  `referred_by` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'Customer ID who referred',
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `phone_verified` tinyint(1) NOT NULL DEFAULT 0,
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `last_login_device` varchar(255) DEFAULT NULL,
  `last_login_browser` varchar(255) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `uuid`, `first_name`, `last_name`, `email`, `phone`, `country_code`, `password`, `remember_token`, `profile_photo`, `gender`, `date_of_birth`, `address_line_1`, `address_line_2`, `country_id`, `state_id`, `city_id`, `area_id`, `pincode`, `latitude`, `longitude`, `status`, `is_blocked`, `block_reason`, `wallet_balance`, `wallet_currency`, `referral_code`, `referred_by`, `email_verified`, `phone_verified`, `otp_code`, `otp_expires_at`, `last_login_at`, `last_login_ip`, `last_login_device`, `last_login_browser`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '0169d5e1-6d97-4c6c-88e3-93cb7e0d4e81', 'Rohit', 'Shrivas', 'imappdeveloper1@gmail.com', '7747982346', '+91', '$2y$12$WdFOJ9w8uLV5MrK0b3ZnX.x/2cgKEWPdYNyzpLn1zCqAOkvKc8jVC', NULL, NULL, NULL, NULL, 'Gwalior', NULL, 1, 1, 1, 1, '474001', NULL, NULL, 'active', 0, NULL, 1885.00, 'INR', NULL, NULL, 0, 1, NULL, NULL, '2026-07-31 07:07:25', '::1', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', NULL, NULL, NULL, '2026-07-30 02:32:54', '2026-07-31 07:07:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_addresses`
--

CREATE TABLE `customer_addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `country_id` bigint(20) UNSIGNED DEFAULT NULL,
  `state_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `area_id` bigint(20) UNSIGNED DEFAULT NULL,
  `delivery_zone_id` bigint(20) UNSIGNED DEFAULT NULL,
  `pincode_id` bigint(20) UNSIGNED DEFAULT NULL,
  `address_type` enum('home','office','hostel','apartment','pg','other') NOT NULL DEFAULT 'home',
  `house_no` varchar(50) DEFAULT NULL,
  `building_name` varchar(255) DEFAULT NULL,
  `floor` varchar(20) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `address_line_1` text DEFAULT NULL,
  `address_line_2` text DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `google_place_id` varchar(255) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_mobile` varchar(20) DEFAULT NULL,
  `delivery_instruction` text DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_addresses`
--

INSERT INTO `customer_addresses` (`id`, `uuid`, `customer_id`, `country_id`, `state_id`, `city_id`, `area_id`, `delivery_zone_id`, `pincode_id`, `address_type`, `house_no`, `building_name`, `floor`, `street`, `landmark`, `address_line_1`, `address_line_2`, `latitude`, `longitude`, `google_place_id`, `contact_person`, `contact_mobile`, `delivery_instruction`, `is_default`, `is_verified`, `status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '0cdbc81f-8dca-4615-9397-d64b4db04e32', 1, 1, 1, 1, 1, NULL, 1, 'home', '110', 'Gargaj wale Baba Ka makan', '3rd', 'Near Puja saree center', 'Kushwa Market', '12 bigha ,Shikander Kampoo ,Gwalior', NULL, NULL, NULL, NULL, 'Rohit', '7747982346', 'Indise the Gali', 1, 0, 'active', NULL, NULL, 1, '2026-07-30 02:36:09', '2026-07-30 02:46:19', '2026-07-30 02:46:19'),
(2, '4328eaa4-e069-4179-bc59-a5af7757b5e4', 1, 1, 1, 1, 1, NULL, 1, 'home', '101', 'Kankamni', '2nd', 'Mg Roal NearCity lake', 'Near Hospital', '12 Bigha ,Shikander Kampoo', 'Gwalior', NULL, NULL, NULL, 'Rohit', '7747982346', 'Ring the Bell', 1, 1, 'active', NULL, 1, 1, '2026-07-30 02:48:35', '2026-07-30 03:03:22', '2026-07-30 03:03:22'),
(3, 'eb1275a7-5fcf-4e90-bf1d-3df1801ce2f2', 1, 1, 1, 1, 1, NULL, 1, 'home', '101', 'Kankamni', '2nd', 'Mg, Road Gwalior', 'Near Puja Saree Center', 'Gwalior', NULL, NULL, NULL, NULL, 'Rohit Shrivas', '7747982346', 'Ring The bell', 1, 0, 'active', NULL, NULL, 1, '2026-07-30 03:05:05', '2026-07-30 03:09:28', '2026-07-30 03:09:28'),
(4, '3f6fd4a3-2306-439c-8e41-9c90ccdd9a44', 1, 1, 1, 1, 1, 1, 1, 'home', '101', 'kanKamni Apartment', '2nd', 'Mg Road , Gwalior', 'Near Hospital Road', 'Gwalior', NULL, NULL, NULL, NULL, 'Rohit Shrivas', '7747982346', 'Ring The Bell', 1, 1, 'active', NULL, 1, NULL, '2026-07-30 03:10:53', '2026-07-30 03:14:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_ledger`
--

CREATE TABLE `customer_ledger` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `journal_entry_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `transaction_date` date NOT NULL,
  `description` text NOT NULL,
  `debit_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `credit_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(30) DEFAULT NULL,
  `transaction_reference` varchar(100) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_meal_selections`
--

CREATE TABLE `customer_meal_selections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `subscription_id` bigint(20) UNSIGNED DEFAULT NULL,
  `weekly_menu_item_id` bigint(20) UNSIGNED NOT NULL,
  `weekly_menu_id` bigint(20) UNSIGNED NOT NULL,
  `menu_date` date NOT NULL,
  `meal_id` bigint(20) UNSIGNED NOT NULL,
  `meal_category_id` bigint(20) UNSIGNED NOT NULL,
  `selection_status` varchar(20) NOT NULL DEFAULT 'selected',
  `selected_at` timestamp NULL DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_subscriptions`
--

CREATE TABLE `customer_subscriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `subscription_number` varchar(255) NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `subscription_plan_id` bigint(20) UNSIGNED NOT NULL,
  `kitchen_id` bigint(20) UNSIGNED DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `activation_date` date DEFAULT NULL,
  `billing_cycle` varchar(30) NOT NULL DEFAULT 'monthly',
  `meal_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `subscription_status` varchar(30) NOT NULL DEFAULT 'pending',
  `payment_status` varchar(30) NOT NULL DEFAULT 'pending',
  `wallet_adjustment` decimal(12,2) NOT NULL DEFAULT 0.00,
  `remaining_meals` int(11) NOT NULL DEFAULT 0,
  `consumed_meals` int(11) NOT NULL DEFAULT 0,
  `skipped_meals` int(11) NOT NULL DEFAULT 0,
  `paused_days` int(11) NOT NULL DEFAULT 0,
  `pause_start` date DEFAULT NULL,
  `pause_end` date DEFAULT NULL,
  `next_delivery_date` date DEFAULT NULL,
  `delivery_slot` varchar(30) DEFAULT NULL,
  `auto_renew` tinyint(1) NOT NULL DEFAULT 0,
  `renewal_date` date DEFAULT NULL,
  `cancellation_date` date DEFAULT NULL,
  `cancellation_reason` varchar(255) DEFAULT NULL,
  `refund_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_subscriptions`
--

INSERT INTO `customer_subscriptions` (`id`, `uuid`, `subscription_number`, `customer_id`, `subscription_plan_id`, `kitchen_id`, `start_date`, `end_date`, `activation_date`, `billing_cycle`, `meal_category_id`, `subscription_status`, `payment_status`, `wallet_adjustment`, `remaining_meals`, `consumed_meals`, `skipped_meals`, `paused_days`, `pause_start`, `pause_end`, `next_delivery_date`, `delivery_slot`, `auto_renew`, `renewal_date`, `cancellation_date`, `cancellation_reason`, `refund_amount`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'f82059db-e40c-4a47-9eed-ba6c224646a9', 'SUB-000001', 1, 2, 1, '2026-08-01', '2026-08-07', '2026-07-31', 'weekly', 2, 'active', 'paid', 550.00, 7, 0, 0, 0, NULL, NULL, '2026-08-01', 'evening', 0, NULL, NULL, NULL, 0.00, NULL, NULL, 1, NULL, '2026-07-31 08:15:48', '2026-07-31 08:18:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `delivery_slots`
--

CREATE TABLE `delivery_slots` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `delivery_zone_id` bigint(20) UNSIGNED NOT NULL,
  `slot_name` varchar(255) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `maximum_orders` int(11) NOT NULL DEFAULT 50,
  `cutoff_time` time DEFAULT NULL COMMENT 'Order must be placed before this time',
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_zones`
--

CREATE TABLE `delivery_zones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL,
  `state_id` bigint(20) UNSIGNED NOT NULL,
  `city_id` bigint(20) UNSIGNED NOT NULL,
  `area_id` bigint(20) UNSIGNED DEFAULT NULL,
  `zone_name` varchar(255) NOT NULL,
  `zone_code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `delivery_radius` decimal(5,2) DEFAULT NULL COMMENT 'Radius in km',
  `minimum_order_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_charge` decimal(10,2) NOT NULL DEFAULT 0.00,
  `free_delivery_above` decimal(10,2) DEFAULT NULL COMMENT 'Free delivery above this amount',
  `estimated_delivery_time` int(11) DEFAULT NULL COMMENT 'Minutes',
  `maximum_orders_per_slot` int(11) DEFAULT NULL,
  `priority` int(11) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `delivery_zones`
--

INSERT INTO `delivery_zones` (`id`, `uuid`, `country_id`, `state_id`, `city_id`, `area_id`, `zone_name`, `zone_code`, `description`, `delivery_radius`, `minimum_order_amount`, `delivery_charge`, `free_delivery_above`, `estimated_delivery_time`, `maximum_orders_per_slot`, `priority`, `status`, `is_default`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'acb8b1b4-e994-43d7-b097-c6e24e8ef985', 1, 1, 1, 1, 'Shikander Kampu', 'Shi', NULL, 5.00, 150.00, 5.00, 500.00, 30, 50, 0, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 02:05:40', '2026-07-30 02:05:40', NULL),
(2, 'b55599d9-5fd3-4aa3-b7f4-a0264636381b', 1, 1, 1, 1, 'Kampoo', 'KMP', NULL, 5.00, 150.00, 20.00, 500.00, 30, 50, 0, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 02:09:45', '2026-07-30 02:09:45', NULL),
(3, '1e453d99-b9d1-46a4-9754-cb741b0a45d1', 1, 1, 1, 1, 'Mharaj Bada', 'BADA', NULL, 5.00, 150.00, 20.00, 500.00, 30, 50, 0, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 02:13:41', '2026-07-30 02:13:41', NULL),
(4, 'bc13405d-fe5c-412d-b886-15a121c3e1b3', 1, 1, 1, 1, 'Shinde Ki Chawani', 'CCHW', NULL, 5.00, 150.00, 20.00, 500.00, 30, 50, 0, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 02:16:59', '2026-07-30 02:16:59', NULL),
(5, '7384633b-ef63-412f-8772-d3c58cb89df7', 1, 1, 1, 1, 'Phool Bag', 'PHL', NULL, 5.00, 150.00, 20.00, 500.00, 30, 50, 0, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 02:17:44', '2026-07-30 02:17:44', NULL),
(6, '33ea54f0-dc6d-4a49-8a85-2c68bdce3391', 1, 1, 1, 1, 'Guda Gudi Ka Naka', 'GUDa', NULL, 5.00, 150.00, 20.00, 500.00, 30, 50, 0, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 02:19:03', '2026-07-30 02:19:03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `expense_number` varchar(50) NOT NULL,
  `expense_category_id` bigint(20) UNSIGNED NOT NULL,
  `expense_date` date NOT NULL,
  `expense_title` varchar(300) NOT NULL,
  `expense_description` text DEFAULT NULL,
  `vendor_name` varchar(200) DEFAULT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(30) NOT NULL DEFAULT 'cash',
  `payment_account` varchar(100) DEFAULT NULL,
  `transaction_reference` varchar(100) DEFAULT NULL,
  `invoice_number` varchar(100) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `bill_attachment` varchar(500) DEFAULT NULL,
  `is_recurring` tinyint(1) NOT NULL DEFAULT 0,
  `recurring_frequency` varchar(30) DEFAULT NULL,
  `next_due_date` date DEFAULT NULL,
  `approval_status` varchar(30) NOT NULL DEFAULT 'draft',
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `expense_status` varchar(30) NOT NULL DEFAULT 'draft',
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_approvals`
--

CREATE TABLE `expense_approvals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `expense_id` bigint(20) UNSIGNED NOT NULL,
  `approval_level` int(11) NOT NULL DEFAULT 1,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approval_status` varchar(30) NOT NULL DEFAULT 'pending',
  `approval_date` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_attachments`
--

CREATE TABLE `expense_attachments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `expense_id` bigint(20) UNSIGNED NOT NULL,
  `file_name` varchar(300) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `mime_type` varchar(100) NOT NULL,
  `uploaded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE `expense_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `category_code` varchar(50) NOT NULL,
  `category_name` varchar(200) NOT NULL,
  `parent_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `is_recurring` tinyint(1) NOT NULL DEFAULT 0,
  `is_taxable` tinyint(1) NOT NULL DEFAULT 1,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `display_order` int(11) NOT NULL DEFAULT 0,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_login_attempts`
--

CREATE TABLE `failed_login_attempts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `financial_years`
--

CREATE TABLE `financial_years` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `year_name` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT 0,
  `is_closed` tinyint(1) NOT NULL DEFAULT 0,
  `closed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `closing_remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `goods_receipts`
--

CREATE TABLE `goods_receipts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `grn_number` varchar(50) NOT NULL,
  `purchase_order_id` bigint(20) UNSIGNED NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `received_date` date NOT NULL,
  `status` enum('pending','accepted','rejected','partial') NOT NULL DEFAULT 'pending',
  `remarks` text DEFAULT NULL,
  `received_by` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `goods_receipt_items`
--

CREATE TABLE `goods_receipt_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `goods_receipt_id` bigint(20) UNSIGNED NOT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `received_quantity` decimal(12,2) NOT NULL,
  `accepted_quantity` decimal(12,2) NOT NULL DEFAULT 0.00,
  `rejected_quantity` decimal(12,2) NOT NULL DEFAULT 0.00,
  `unit_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gst_transactions`
--

CREATE TABLE `gst_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `reference_type` varchar(100) NOT NULL,
  `reference_id` bigint(20) UNSIGNED NOT NULL,
  `journal_entry_id` bigint(20) UNSIGNED DEFAULT NULL,
  `transaction_date` date NOT NULL,
  `gst_type` varchar(20) NOT NULL,
  `gst_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `taxable_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `cgst_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `sgst_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `igst_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `cess_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_tax` decimal(14,2) NOT NULL DEFAULT 0.00,
  `invoice_number` varchar(100) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `supplier_gstin` varchar(20) DEFAULT NULL,
  `place_of_supply` varchar(5) DEFAULT NULL,
  `is_reconciled` tinyint(1) NOT NULL DEFAULT 0,
  `reconciled_at` timestamp NULL DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_adjustments`
--

CREATE TABLE `inventory_adjustments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `adjustment_number` varchar(50) NOT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `adjustment_type` enum('addition','subtraction') NOT NULL,
  `adjustment_quantity` decimal(12,2) NOT NULL,
  `reason` text NOT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_batches`
--

CREATE TABLE `inventory_batches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `batch_number` varchar(50) NOT NULL,
  `lot_number` varchar(50) DEFAULT NULL,
  `manufacturing_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `received_date` date DEFAULT NULL,
  `available_quantity` decimal(12,2) NOT NULL DEFAULT 0.00,
  `reserved_quantity` decimal(12,2) NOT NULL DEFAULT 0.00,
  `unit_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `purchase_order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `goods_receipt_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('active','expired','consumed','damaged') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_consumption_logs`
--

CREATE TABLE `inventory_consumption_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `production_batch_id` bigint(20) UNSIGNED NOT NULL,
  `recipe_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meal_id` bigint(20) UNSIGNED DEFAULT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `consumed_quantity` decimal(12,4) NOT NULL,
  `unit_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `consumption_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_items`
--

CREATE TABLE `inventory_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `item_code` varchar(50) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `hsn_code` varchar(20) DEFAULT NULL,
  `item_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `category_name` varchar(100) DEFAULT NULL,
  `unit_id` bigint(20) UNSIGNED NOT NULL,
  `current_stock` decimal(12,2) NOT NULL DEFAULT 0.00,
  `reserved_stock` decimal(12,2) NOT NULL DEFAULT 0.00,
  `available_stock` decimal(12,2) NOT NULL DEFAULT 0.00,
  `minimum_stock` decimal(12,2) NOT NULL DEFAULT 0.00,
  `maximum_stock` decimal(12,2) NOT NULL DEFAULT 0.00,
  `reorder_level` decimal(12,2) NOT NULL DEFAULT 0.00,
  `reorder_quantity` decimal(12,2) NOT NULL DEFAULT 0.00,
  `cost_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `average_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `last_purchase_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stock_valuation_method` varchar(20) NOT NULL DEFAULT 'weighted_average',
  `expiry_tracking` tinyint(1) NOT NULL DEFAULT 0,
  `batch_tracking` tinyint(1) NOT NULL DEFAULT 0,
  `serial_tracking` tinyint(1) NOT NULL DEFAULT 0,
  `storage_location` varchar(100) DEFAULT NULL,
  `shelf_number` varchar(20) DEFAULT NULL,
  `rack_number` varchar(20) DEFAULT NULL,
  `bin_number` varchar(20) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('active','inactive','low_stock') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transactions`
--

CREATE TABLE `inventory_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `transaction_number` varchar(50) NOT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_type` enum('opening_stock','purchase_receipt','purchase_return','production_consumption','manual_adjustment','stock_transfer','stock_audit','expired_stock','damaged_stock') NOT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `batch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` decimal(12,2) NOT NULL,
  `unit_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stock_before` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stock_after` decimal(12,2) NOT NULL DEFAULT 0.00,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `journal_entries`
--

CREATE TABLE `journal_entries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `journal_number` varchar(50) NOT NULL,
  `journal_date` date NOT NULL,
  `entry_type` varchar(50) NOT NULL DEFAULT 'general',
  `financial_year_id` bigint(20) UNSIGNED NOT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` text NOT NULL,
  `total_debit` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_credit` decimal(14,2) NOT NULL DEFAULT 0.00,
  `posting_status` varchar(20) NOT NULL DEFAULT 'draft',
  `posted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `posted_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `journal_entry_lines`
--

CREATE TABLE `journal_entry_lines` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `journal_entry_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` bigint(20) UNSIGNED NOT NULL,
  `line_number` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `description` text DEFAULT NULL,
  `cost_center` varchar(50) DEFAULT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `debit_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `credit_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kitchens`
--

CREATE TABLE `kitchens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `kitchen_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `kitchen_type` enum('main_kitchen','central_kitchen','cloud_kitchen','branch_kitchen','future_kitchen') NOT NULL DEFAULT 'main_kitchen',
  `manager_name` varchar(100) DEFAULT NULL,
  `manager_mobile` varchar(20) DEFAULT NULL,
  `manager_email` varchar(255) DEFAULT NULL,
  `country_id` bigint(20) UNSIGNED DEFAULT NULL,
  `state_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `area_id` bigint(20) UNSIGNED DEFAULT NULL,
  `delivery_zone_id` bigint(20) UNSIGNED DEFAULT NULL,
  `address_line_1` text DEFAULT NULL,
  `address_line_2` text DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `preparation_start_time` time DEFAULT NULL,
  `accept_order_start_time` time DEFAULT NULL,
  `accept_order_end_time` time DEFAULT NULL,
  `daily_capacity` int(10) UNSIGNED DEFAULT NULL,
  `maximum_orders` int(10) UNSIGNED DEFAULT NULL,
  `emergency_contact` varchar(20) DEFAULT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `fssai_number` varchar(50) DEFAULT NULL,
  `gst_number` varchar(20) DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kitchens`
--

INSERT INTO `kitchens` (`id`, `uuid`, `kitchen_code`, `name`, `description`, `kitchen_type`, `manager_name`, `manager_mobile`, `manager_email`, `country_id`, `state_id`, `city_id`, `area_id`, `delivery_zone_id`, `address_line_1`, `address_line_2`, `landmark`, `latitude`, `longitude`, `opening_time`, `closing_time`, `preparation_start_time`, `accept_order_start_time`, `accept_order_end_time`, `daily_capacity`, `maximum_orders`, `emergency_contact`, `license_number`, `fssai_number`, `gst_number`, `logo`, `status`, `is_default`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '082016ff-bed9-49d8-82e2-11b0b712b520', 'VyaruFood01', 'VyaruFood', NULL, 'main_kitchen', 'Rohit Shrivas', '8962279063', 'imappdeveloper1@gmail.com', 1, 1, 1, 1, 1, 'Gwalior', 'Gwalior', 'Gwalior', NULL, NULL, '09:00:00', '22:30:00', '10:00:00', '10:00:00', '21:00:00', 200, NULL, '8962279063', 'HIHGUE5658896', 'FASSA87578578HIUNKJ', 'GSTRSDC45666', NULL, 'active', 1, NULL, 1, 1, NULL, '2026-07-30 04:37:38', '2026-07-30 04:37:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kitchen_capacity`
--

CREATE TABLE `kitchen_capacity` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `kitchen_id` bigint(20) UNSIGNED DEFAULT NULL,
  `capacity_date` date NOT NULL,
  `breakfast_capacity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `lunch_capacity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `dinner_capacity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `healthy_meal_capacity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `snack_capacity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `maximum_orders` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `reserved_orders` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `available_orders` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kitchen_capacity`
--

INSERT INTO `kitchen_capacity` (`id`, `uuid`, `kitchen_id`, `capacity_date`, `breakfast_capacity`, `lunch_capacity`, `dinner_capacity`, `healthy_meal_capacity`, `snack_capacity`, `maximum_orders`, `reserved_orders`, `available_orders`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'a547aac8-7fa9-40b2-8742-e16402d7ec15', 1, '2026-07-30', 0, 500, 500, 0, 0, 500, 200, 300, 'active', 1, 1, '2026-07-30 05:18:51', '2026-07-30 05:18:51');

-- --------------------------------------------------------

--
-- Table structure for table `kitchen_holidays`
--

CREATE TABLE `kitchen_holidays` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `kitchen_id` bigint(20) UNSIGNED DEFAULT NULL,
  `holiday_name` varchar(255) NOT NULL,
  `holiday_type` enum('weekly_off','public_holiday','festival','maintenance','emergency','custom') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kitchen_holidays`
--

INSERT INTO `kitchen_holidays` (`id`, `uuid`, `kitchen_id`, `holiday_name`, `holiday_type`, `start_date`, `end_date`, `reason`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'aa71c36b-0557-4ea1-ab15-fc926391bdf3', 1, 'Raskha Bandhan', 'festival', '2026-08-28', '2026-08-29', NULL, 'active', 1, 1, '2026-07-30 04:55:08', '2026-07-30 04:55:08');

-- --------------------------------------------------------

--
-- Table structure for table `kitchen_working_days`
--

CREATE TABLE `kitchen_working_days` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `kitchen_id` bigint(20) UNSIGNED DEFAULT NULL,
  `day_of_week` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  `is_working` tinyint(1) NOT NULL DEFAULT 1,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `preparation_start_time` time DEFAULT NULL,
  `accept_order_start` time DEFAULT NULL,
  `accept_order_end` time DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kitchen_working_days`
--

INSERT INTO `kitchen_working_days` (`id`, `uuid`, `kitchen_id`, `day_of_week`, `is_working`, `opening_time`, `closing_time`, `preparation_start_time`, `accept_order_start`, `accept_order_end`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'a6f7ef5d-8beb-48f5-ba87-d0fe2a8c60bd', 1, 'monday', 1, '10:00:00', '22:30:00', '10:00:00', '10:00:00', '22:00:00', 1, 1, '2026-07-30 04:44:54', '2026-07-30 04:44:54'),
(2, '0a1f5f72-2c29-4bca-bc88-f9ed84b335dc', 1, 'tuesday', 1, '10:00:00', '22:00:00', '10:00:00', '10:00:00', '22:00:00', 1, 1, '2026-07-30 04:46:14', '2026-07-30 04:46:14'),
(3, 'd13378de-7a54-4dfc-9cbc-7d73893ed9ee', 1, 'wednesday', 1, '10:00:00', '22:00:00', '10:00:00', '10:00:00', '22:00:00', 1, 1, '2026-07-30 04:47:13', '2026-07-30 04:47:13'),
(4, '0f66126d-5a60-4842-8749-7ec8aa9e1820', 1, 'thursday', 1, '10:00:00', '22:00:00', '10:00:00', '11:59:00', '22:00:00', 1, 1, '2026-07-30 04:47:59', '2026-07-30 06:09:10'),
(5, 'a682b948-749b-4925-a298-f6c49f216a51', 1, 'friday', 1, '10:00:00', '22:00:00', '10:00:00', '10:00:00', '22:00:00', 1, 1, '2026-07-30 04:48:37', '2026-07-30 04:48:37'),
(6, '9ff76b73-78a5-496c-94d2-a0d3fb9f42f1', 1, 'saturday', 1, '10:00:00', '22:00:00', '10:00:00', '10:00:00', '22:00:00', 1, 1, '2026-07-30 04:49:13', '2026-07-30 04:49:13'),
(7, 'aaa7fd1e-871d-455e-af76-b225f251a424', 1, 'sunday', 0, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-07-30 04:49:49', '2026-07-30 04:49:49');

-- --------------------------------------------------------

--
-- Table structure for table `login_histories`
--

CREATE TABLE `login_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `admin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `device` varchar(255) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `is_successful` tinyint(1) NOT NULL DEFAULT 1,
  `failure_reason` varchar(255) DEFAULT NULL,
  `login_at` timestamp NULL DEFAULT NULL,
  `logout_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `login_histories`
--

INSERT INTO `login_histories` (`id`, `uuid`, `admin_id`, `email`, `ip_address`, `user_agent`, `device`, `browser`, `os`, `location`, `is_successful`, `failure_reason`, `login_at`, `logout_at`, `created_at`, `updated_at`) VALUES
(1, '839459ca-9631-44ed-a985-0072c3909ae0', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-26 05:22:34', NULL, '2026-07-26 05:22:34', '2026-07-26 05:22:34'),
(2, '5345634e-ea13-486f-b55d-a4213ee2c666', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-26 16:42:52', NULL, '2026-07-26 16:42:54', '2026-07-26 16:42:54'),
(3, 'bb4e32f7-9c1e-496f-8251-37eff54b7853', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-27 03:25:36', NULL, '2026-07-27 03:25:38', '2026-07-27 03:25:38'),
(4, '59d75c2a-185b-4eaa-8ec8-e4a0a879ce63', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-27 04:10:46', NULL, '2026-07-27 04:10:46', '2026-07-27 04:10:46'),
(5, '27cd1e6a-ad28-4137-95ad-75a502114967', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-27 04:12:02', NULL, '2026-07-27 04:12:02', '2026-07-27 04:12:02'),
(6, '20dbe10c-0155-4381-973f-f7d06ab97b11', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-27 05:05:27', NULL, '2026-07-27 05:05:27', '2026-07-27 05:05:27'),
(7, 'f476c1b5-1b6c-4929-b3ac-cf289ea24e82', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-27 05:07:19', NULL, '2026-07-27 05:07:19', '2026-07-27 05:07:19'),
(8, '2ea83c06-6eff-447e-8312-8e2ceb44a286', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-27 05:13:43', NULL, '2026-07-27 05:13:43', '2026-07-27 05:13:43'),
(9, 'b7896bf7-e372-4313-828a-7b2cf04f453a', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-07-27 06:51:03', '2026-07-27 06:51:03'),
(10, 'd1df8fc9-8003-45bd-bd95-41743ea2e23c', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-27 06:51:16', NULL, '2026-07-27 06:51:16', '2026-07-27 06:51:16'),
(11, 'a52b2b54-f7c5-45c0-bc16-f31d991215fd', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-07-28 05:51:25', '2026-07-28 05:51:25'),
(12, '19285553-8143-41bf-a802-dbf75e245570', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-28 05:51:32', NULL, '2026-07-28 05:51:33', '2026-07-28 05:51:33'),
(13, 'b3b06386-5c68-4da7-9db0-b5470d639c42', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-28 06:02:59', NULL, '2026-07-28 06:02:59', '2026-07-28 06:02:59'),
(14, '1370f786-a034-4bac-8406-f05fdbaf7ba8', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-28 06:32:07', NULL, '2026-07-28 06:32:07', '2026-07-28 06:32:07'),
(15, 'f4201406-4e10-4381-bc55-b63ff40d22f4', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-28 06:37:13', NULL, '2026-07-28 06:37:13', '2026-07-28 06:37:13'),
(16, 'd51c3b35-0daa-41f7-9ec2-e3028ccff5a8', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-28 09:37:58', NULL, '2026-07-28 09:37:58', '2026-07-28 09:37:58'),
(17, '94939f02-993a-47ab-976f-353463db236a', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-28 15:55:32', NULL, '2026-07-28 15:55:35', '2026-07-28 15:55:35'),
(18, '82217c11-0a12-4747-8758-ff5fb7e48a77', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-28 16:19:08', NULL, '2026-07-28 16:19:08', '2026-07-28 16:19:08'),
(19, 'dde3fd0a-83e7-443e-b29e-15edce882819', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 04:39:04', NULL, '2026-07-29 04:39:04', '2026-07-29 04:39:04'),
(20, '732dd6b5-7b09-48cb-a938-18aa957b888b', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 04:39:37', NULL, '2026-07-29 04:39:37', '2026-07-29 04:39:37'),
(21, 'd269be6a-f066-4088-8f08-4912bedad71b', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 04:55:34', NULL, '2026-07-29 04:55:36', '2026-07-29 04:55:36'),
(22, 'a4d84615-0802-404e-a224-e8af5ac32cf6', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-07-29 05:09:01', '2026-07-29 05:09:01'),
(23, '6606058c-f7dc-4158-b272-d6b129b06897', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 05:09:51', NULL, '2026-07-29 05:09:51', '2026-07-29 05:09:51'),
(24, '5e07106d-bb78-4846-b3c4-a03fb7456486', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 05:12:05', NULL, '2026-07-29 05:12:05', '2026-07-29 05:12:05'),
(25, '74b5698c-3d41-4e23-a588-7c52771ac54e', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 05:16:13', NULL, '2026-07-29 05:16:13', '2026-07-29 05:16:13'),
(26, '702e877b-09f7-466b-ba68-9327a8949b2f', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 05:17:09', NULL, '2026-07-29 05:17:09', '2026-07-29 05:17:09'),
(27, '5a4870e0-0dfa-43b4-978a-abf512bf2f96', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 05:18:53', NULL, '2026-07-29 05:18:53', '2026-07-29 05:18:53'),
(28, 'cf27762e-52a1-4393-86cc-2b071bb8a5e3', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 05:20:55', NULL, '2026-07-29 05:20:55', '2026-07-29 05:20:55'),
(29, 'a266cad2-0a9d-40cb-81ed-d85f37327273', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 05:26:48', NULL, '2026-07-29 05:26:48', '2026-07-29 05:26:48'),
(30, '460c8278-f9b7-417b-a83f-260481eabbc7', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 07:07:43', NULL, '2026-07-29 07:07:46', '2026-07-29 07:07:46'),
(31, '72067f36-e346-49ee-b7fe-4144b76ae219', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 07:14:44', NULL, '2026-07-29 07:14:44', '2026-07-29 07:14:44'),
(32, 'be1c4b04-caff-4697-a2ab-34f88d6afd44', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-29 13:42:45', NULL, '2026-07-29 13:42:45', '2026-07-29 13:42:45'),
(33, '028c2b15-1023-4dff-962d-626fba7f2e27', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-29 14:13:53', NULL, '2026-07-29 14:13:53', '2026-07-29 14:13:53'),
(34, '2beddc52-156c-45cf-a7f8-5ec1a110e3fe', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-29 14:14:32', NULL, '2026-07-29 14:14:32', '2026-07-29 14:14:32'),
(35, 'aa1a4f28-cd92-4134-8cf4-12ba7cdb377a', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-29 14:14:43', NULL, '2026-07-29 14:14:43', '2026-07-29 14:14:43'),
(36, '40dc646a-19df-4b4d-a44f-70072653689e', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-29 14:16:29', NULL, '2026-07-29 14:16:29', '2026-07-29 14:16:29'),
(37, 'a64d5ba1-bac9-43b5-bfd2-e6a512457550', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-29 14:21:18', NULL, '2026-07-29 14:21:18', '2026-07-29 14:21:18'),
(38, '083f4f1c-256d-48eb-9ef9-40649f92867a', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-29 14:33:05', NULL, '2026-07-29 14:33:05', '2026-07-29 14:33:05'),
(39, 'd2cd0dc3-55f6-4326-8dc2-21317f637533', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-29 14:42:50', NULL, '2026-07-29 14:42:50', '2026-07-29 14:42:50'),
(40, '1cb1c77c-0fbe-49e4-aa15-058b05ab330a', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-29 14:44:18', NULL, '2026-07-29 14:44:18', '2026-07-29 14:44:18'),
(41, '0ce93a64-935e-47ae-9cb7-3acb552d32cb', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-30 05:08:07', NULL, '2026-07-30 05:08:07', '2026-07-30 05:08:07'),
(42, '603bb36e-57dc-46c1-be20-da21cd2d6cfd', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-30 05:09:06', NULL, '2026-07-30 05:09:06', '2026-07-30 05:09:06'),
(43, 'a4d22cba-043f-4b93-b010-efd4900d2531', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-30 05:09:36', NULL, '2026-07-30 05:09:36', '2026-07-30 05:09:36'),
(44, 'b94ea83c-bc2a-4dd4-ab36-e47c802780b7', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-30 05:10:07', NULL, '2026-07-30 05:10:07', '2026-07-30 05:10:07'),
(45, 'adda564e-36aa-45d1-a376-7d3e6f56d646', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-30 05:11:10', NULL, '2026-07-30 05:11:10', '2026-07-30 05:11:10'),
(46, '467c8b7c-08f2-4eb8-b0b4-69b182dcf0a6', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-30 05:12:48', NULL, '2026-07-30 05:12:48', '2026-07-30 05:12:48'),
(47, '264210b6-f41f-403e-baff-222910484e2d', 1, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-30 05:14:28', NULL, '2026-07-30 05:14:28', '2026-07-30 05:14:28'),
(48, '906cbe34-58dd-40bf-8cf8-62d15d3e3820', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-30 07:06:43', NULL, '2026-07-30 07:06:46', '2026-07-30 07:06:46'),
(49, '03f2a93e-42d0-461a-863f-dcdd9af259da', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-31 03:48:25', NULL, '2026-07-31 03:48:28', '2026-07-31 03:48:28'),
(50, '2df4845f-2287-447a-ae28-3f5b62b4befa', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'Windows', NULL, 'Windows', NULL, 1, NULL, '2026-07-31 04:12:55', NULL, '2026-07-31 04:12:55', '2026-07-31 04:12:55'),
(51, 'fce2e950-53ac-4d85-a950-a358aa738043', 1, NULL, '::1', 'curl/8.13.0', NULL, NULL, NULL, NULL, 1, NULL, '2026-07-31 04:16:07', NULL, '2026-07-31 04:16:07', '2026-07-31 04:16:07'),
(52, '412ac3f9-4b21-40ee-9ee2-7304e0b71f81', 1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Windows', 'Chrome', 'Windows', NULL, 1, NULL, '2026-07-31 07:06:43', NULL, '2026-07-31 07:06:46', '2026-07-31 07:06:46'),
(53, '77d77f88-8a14-4596-a070-deb9ac57ecad', 1, NULL, '::1', 'curl/8.13.0', NULL, NULL, NULL, NULL, 1, NULL, '2026-07-31 07:08:05', NULL, '2026-07-31 07:08:05', '2026-07-31 07:08:05'),
(54, 'f7b1b9e3-89f3-4edb-954f-694dab96b08c', 1, NULL, '::1', 'curl/8.13.0', NULL, NULL, NULL, NULL, 1, NULL, '2026-07-31 10:43:44', NULL, '2026-07-31 10:43:44', '2026-07-31 10:43:44');

-- --------------------------------------------------------

--
-- Table structure for table `meals`
--

CREATE TABLE `meals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `meal_code` varchar(50) NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meal_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `kitchen_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `allergens` text DEFAULT NULL,
  `spice_level` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `serving_size` varchar(50) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `meal_image` varchar(500) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery`)),
  `barcode` varchar(100) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `hsn_code` varchar(20) DEFAULT NULL,
  `preparation_time` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `calories` decimal(8,2) NOT NULL DEFAULT 0.00,
  `protein` decimal(8,2) NOT NULL DEFAULT 0.00,
  `carbohydrates` decimal(8,2) NOT NULL DEFAULT 0.00,
  `fat` decimal(8,2) NOT NULL DEFAULT 0.00,
  `fiber` decimal(8,2) NOT NULL DEFAULT 0.00,
  `sugar` decimal(8,2) NOT NULL DEFAULT 0.00,
  `sodium` decimal(8,2) NOT NULL DEFAULT 0.00,
  `price` decimal(10,2) NOT NULL,
  `offer_price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `tax_percentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `availability_type` varchar(50) NOT NULL DEFAULT 'all_day',
  `availability_slots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`availability_slots`)),
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_recommended` tinyint(1) NOT NULL DEFAULT 0,
  `is_new` tinyint(1) NOT NULL DEFAULT 0,
  `is_bestseller` tinyint(1) NOT NULL DEFAULT 0,
  `average_rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `reviews_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_customizable` tinyint(1) NOT NULL DEFAULT 0,
  `requires_preparation` tinyint(1) NOT NULL DEFAULT 1,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`id`, `uuid`, `meal_code`, `category_id`, `meal_type_id`, `kitchen_id`, `name`, `slug`, `short_description`, `description`, `ingredients`, `allergens`, `spice_level`, `serving_size`, `unit`, `meal_image`, `thumbnail`, `gallery`, `barcode`, `sku`, `hsn_code`, `preparation_time`, `calories`, `protein`, `carbohydrates`, `fat`, `fiber`, `sugar`, `sodium`, `price`, `offer_price`, `cost_price`, `tax_percentage`, `display_order`, `availability_type`, `availability_slots`, `is_featured`, `is_recommended`, `is_new`, `is_bestseller`, `average_rating`, `reviews_count`, `is_customizable`, `requires_preparation`, `status`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '550f2deb-eece-4622-863d-6cc8c632f796', 'ML01', 1, 1, 1, 'Aloo Paratha + Chole Bature +Rice', 'aloo-paratha-chole-bature-rice', '2 Aloo Paratha and Spicey Chole Bature With jeera Rice', '2 Aloo Paratha and Spicey Chole Bature With jeera Rice Mint Souce .', '[\"Aloo\",\"Chole\",\"Rice\",\"Jeera\",\"oil\"]', '[]', 2, '100', 'plate', 'meals/550f2deb-eece-4622-863d-6cc8c632f796/main.jpg', 'meals/550f2deb-eece-4622-863d-6cc8c632f796/main.jpg', '[\"meals\\/550f2deb-eece-4622-863d-6cc8c632f796\\/gallery\\/6a6c22bb123cd.jfif\"]', 'BR1', 'ML-BR', '01', 30, 1600.00, 57.00, 250.00, 50.00, 40.00, 30.00, 2700.00, 100.00, 0.00, 50.00, 10.00, 0, 'all_day', '[]', 0, 0, 1, 1, 0.00, 0, 0, 0, 'active', NULL, 1, 1, NULL, '2026-07-31 04:00:12', '2026-07-31 04:21:15', NULL),
(2, '56cc0db6-febf-4465-bd10-e35b6763a5c4', 'ML2', 1, 1, 1, 'Dal Makhni + Paratha + Rice', 'dal-makhni-paratha-rice', 'Butter Dal Makhni with 4 paratha and Jerra rice .', 'Butter Dal Makhni with 4 paratha and Jerra rice .', '[\"udad dal\",\"rice\",\"rajma\"]', '[]', 3, '100', 'plate', 'meals/56cc0db6-febf-4465-bd10-e35b6763a5c4/main.jpg', 'meals/56cc0db6-febf-4465-bd10-e35b6763a5c4/main.jpg', '[\"meals\\/56cc0db6-febf-4465-bd10-e35b6763a5c4\\/gallery\\/6a6c24e26a2e3.jpg\"]', 'BR2', 'ML-BL-2', '02', 30, 795.00, 23.30, 110.00, 28.40, 12.60, 7.10, 1052.00, 150.00, 0.00, 50.00, 10.00, 0, 'all_day', '[]', 1, 1, 1, 1, 5.00, 1, 0, 0, 'active', NULL, 1, 1, NULL, '2026-07-31 04:30:22', '2026-07-31 05:52:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `meal_categories`
--

CREATE TABLE `meal_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `category_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `color_code` varchar(20) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meal_categories`
--

INSERT INTO `meal_categories` (`id`, `uuid`, `category_code`, `name`, `slug`, `description`, `display_order`, `icon`, `image`, `color_code`, `status`, `is_default`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '38eac421-8ddf-4acb-ab6c-a5314f89860b', 'CAT01', 'Lunch', 'lunch', NULL, 0, NULL, 'https://cdn-icons-png.flaticon.com/512/3967/3967369.png', NULL, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 07:26:51', '2026-07-30 07:26:51', NULL),
(2, '9ee3c9b7-98c6-4512-a5d5-0e7b83d2903f', 'CAT02', 'Dinner', 'dinner', NULL, 0, NULL, 'https://cdn-icons-png.flaticon.com/512/3967/3967369.png', NULL, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 07:29:12', '2026-07-30 07:29:12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `meal_packing_lists`
--

CREATE TABLE `meal_packing_lists` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `production_batch_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `meal_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `packing_status` enum('pending','packed','verified','loaded') NOT NULL DEFAULT 'pending',
  `packed_at` datetime DEFAULT NULL,
  `packed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meal_types`
--

CREATE TABLE `meal_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `type_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `color_code` varchar(20) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meal_types`
--

INSERT INTO `meal_types` (`id`, `uuid`, `type_code`, `name`, `slug`, `description`, `display_order`, `icon`, `image`, `color_code`, `status`, `is_default`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'f9b29738-75c9-4503-9bfc-ed143980b862', '001', 'Veg', 'veg', NULL, 0, NULL, NULL, NULL, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 08:28:53', '2026-07-30 08:28:53', NULL),
(2, 'e4799321-cfdd-4830-b4f1-e27b0043116e', '002', 'Non-Veg', 'non-veg', NULL, 0, NULL, NULL, NULL, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 08:29:52', '2026-07-30 08:29:52', NULL),
(3, 'eb88d23a-47bf-4b57-9f60-2931232c485d', '003', 'Fast', 'fast', NULL, 0, NULL, NULL, NULL, 'active', 0, NULL, 1, 1, NULL, '2026-07-30 08:31:37', '2026-07-30 08:31:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `menu_templates`
--

CREATE TABLE `menu_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `template_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `kitchen_id` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menu_template_items`
--

CREATE TABLE `menu_template_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `menu_template_id` bigint(20) UNSIGNED NOT NULL,
  `day_name` varchar(20) NOT NULL,
  `meal_category_id` bigint(20) UNSIGNED NOT NULL,
  `meal_id` bigint(20) UNSIGNED NOT NULL,
  `meal_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_01_01_000001_create_admins_table', 1),
(2, '2026_01_01_000002_create_password_reset_tokens_table', 1),
(3, '2026_01_01_000003_create_personal_access_tokens_table', 1),
(4, '2026_01_01_000004_create_login_histories_table', 1),
(5, '2026_01_01_000005_create_failed_login_attempts_table', 1),
(6, '2026_01_01_000006_create_spatie_permission_tables', 1),
(7, '2026_01_01_000007_create_activity_log_table', 1),
(8, '2026_01_01_000008_create_admin_sessions_table', 1),
(9, '2026_07_23_100000_create_countries_table', 1),
(10, '2026_07_24_100000_create_states_table', 1),
(11, '2026_07_24_100001_create_suppliers_table', 1),
(12, '2026_07_24_200000_create_cities_table', 1),
(13, '2026_07_24_210000_create_areas_table', 1),
(14, '2026_07_24_220000_create_delivery_zones_table', 1),
(15, '2026_07_24_220001_create_pincodes_table', 1),
(16, '2026_07_24_220002_create_delivery_slots_table', 1),
(17, '2026_07_24_230000_create_customers_table', 1),
(18, '2026_07_25_000000_create_customer_addresses_table', 1),
(19, '2026_07_25_000001_alter_suppliers_add_extended_fields', 1),
(20, '2026_07_25_000002_create_supplier_products_table', 1),
(21, '2026_07_25_000003_create_supplier_documents_table', 1),
(22, '2026_07_25_000004_create_supplier_contacts_table', 1),
(23, '2026_07_25_000005_create_supplier_price_history_table', 1),
(24, '2026_07_25_000006_create_supplier_ledger_table', 1),
(25, '2026_07_26_000000_create_kitchens_table', 1),
(26, '2026_07_27_000001_create_kitchen_working_days_table', 1),
(27, '2026_07_27_000002_create_kitchen_holidays_table', 1),
(28, '2026_07_27_000003_create_kitchen_capacity_table', 1),
(29, '2026_07_27_000004_create_production_schedules_table', 1),
(30, '2026_07_28_000001_create_meal_categories_table', 1),
(31, '2026_07_28_000002_create_meal_types_table', 1),
(32, '2026_07_28_000003_create_meals_table', 1),
(33, '2026_07_29_000001_create_weekly_menus_table', 1),
(34, '2026_07_29_000002_create_weekly_menu_items_table', 1),
(35, '2026_07_29_000003_create_customer_meal_selections_table', 1),
(36, '2026_07_30_000000_create_menu_templates_table', 1),
(37, '2026_07_30_000001_create_monthly_menus_table', 1),
(38, '2026_07_30_000002_create_monthly_menu_items_table', 1),
(39, '2026_07_30_000010_create_menu_template_items_table', 1),
(40, '2026_07_31_000000_add_soft_deletes_to_module_018_tables', 1),
(41, '2026_08_01_000000_create_subscription_plans_table', 1),
(42, '2026_08_02_000000_create_customer_subscriptions_table', 1),
(43, '2026_08_02_000001_create_subscription_pause_history_table', 1),
(44, '2026_08_02_000002_create_subscription_skip_history_table', 1),
(45, '2026_08_02_000003_create_subscription_upgrade_history_table', 1),
(46, '2026_08_02_000004_create_subscription_renew_history_table', 1),
(47, '2026_08_02_000005_create_subscription_status_history_table', 1),
(48, '2026_08_03_000000_create_orders_table', 1),
(49, '2026_08_03_000001_create_order_items_table', 1),
(50, '2026_08_03_000002_create_order_status_history_table', 1),
(51, '2026_08_03_000003_create_order_cancellations_table', 1),
(52, '2026_08_03_000004_create_order_refunds_table', 1),
(53, '2026_08_04_000000_create_production_batches_table', 1),
(54, '2026_08_04_000001_create_production_batch_items_table', 1),
(55, '2026_08_04_000002_create_meal_packing_lists_table', 1),
(56, '2026_08_04_000003_create_production_status_history_table', 1),
(57, '2026_08_05_000000_create_units_table', 1),
(58, '2026_08_05_000001_create_inventory_items_table', 1),
(59, '2026_08_05_000002_create_recipes_table', 1),
(60, '2026_08_05_000003_create_recipe_items_table', 1),
(61, '2026_08_05_000004_create_inventory_consumption_logs_table', 1),
(62, '2026_08_05_000005_create_recipe_versions_table', 1),
(63, '2026_08_06_000001_create_purchase_requests_table', 1),
(64, '2026_08_06_000002_create_purchase_request_items_table', 1),
(65, '2026_08_06_000003_create_purchase_orders_table', 1),
(66, '2026_08_06_000004_create_purchase_order_items_table', 1),
(67, '2026_08_06_000005_create_goods_receipts_table', 1),
(68, '2026_08_06_000006_create_goods_receipt_items_table', 1),
(69, '2026_08_26_000001_alter_inventory_items_add_extended_fields', 1),
(70, '2026_08_26_000002_create_inventory_batches_table', 1),
(71, '2026_08_26_000003_create_inventory_transactions_table', 1),
(72, '2026_08_26_000004_create_inventory_adjustments_table', 1),
(73, '2026_08_26_000005_create_stock_audits_table', 1),
(74, '2026_08_27_000001_create_expense_categories_table', 1),
(75, '2026_08_27_000002_create_expenses_table', 1),
(76, '2026_08_27_000003_create_expense_attachments_table', 1),
(77, '2026_08_27_000004_create_expense_approvals_table', 1),
(78, '2026_08_28_000001_create_chart_of_accounts_table', 1),
(79, '2026_08_28_000002_create_financial_years_table', 1),
(80, '2026_08_28_000003_create_journal_entries_table', 1),
(81, '2026_08_28_000004_create_journal_entry_lines_table', 1),
(82, '2026_08_28_000005_add_missing_columns_to_journal_entry_lines', 1),
(83, '2026_08_28_000005_create_bank_accounts_table', 1),
(84, '2026_08_28_000006_add_entry_type_to_journal_entries', 1),
(85, '2026_08_28_000006_create_bank_reconciliations_table', 1),
(86, '2026_08_28_000007_create_customer_ledger_table', 1),
(87, '2026_08_28_000009_create_cash_book_table', 1),
(88, '2026_08_28_000010_create_bank_book_table', 1),
(89, '2026_08_28_000011_create_gst_transactions_table', 1),
(90, '2026_08_29_000001_create_wallets_table', 1),
(91, '2026_08_29_000002_create_wallet_transactions_table', 1),
(92, '2026_08_29_000003_create_payment_transactions_table', 1),
(93, '2026_08_29_000004_create_payment_refunds_table', 1),
(94, '2026_08_29_000005_create_payment_webhook_logs_table', 1),
(95, '2026_08_30_000001_create_notification_templates_table', 1),
(96, '2026_08_30_000002_create_notifications_table', 1),
(97, '2026_08_30_000003_create_notification_logs_table', 1),
(98, '2026_08_30_000004_create_notification_preferences_table', 1),
(99, '2026_08_31_000001_create_saved_reports_table', 1),
(100, '2026_08_31_000002_create_scheduled_reports_table', 1),
(101, '2026_08_31_000003_create_report_exports_table', 1),
(102, '2026_09_01_000001_create_system_settings_table', 1),
(103, '2026_09_01_000002_create_cms_pages_table', 1),
(104, '2026_09_01_000003_create_app_versions_table', 1),
(105, '2026_09_01_000004_create_system_backups_table', 1),
(106, '2026_09_01_000005_add_soft_deletes_to_module_032_tables', 1),
(107, '2026_09_01_000006_add_otp_columns_to_customers_table', 2),
(108, '2026_07_26_000001_create_carts_table', 3),
(109, '2026_07_27_000000_add_remember_token_to_customers_table', 4),
(110, '2026_08_05_000000_create_reviews_table', 5),
(111, '2026_08_05_000001_add_rating_columns_to_meals_table', 5),
(112, '2026_07_28_153015_create_pincode_requests_table', 6),
(113, '2026_07_31_133354_add_delivery_slot_to_customer_subscriptions_table', 7);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\Auth\\Admin', 1),
(2, 'App\\Models\\Auth\\Admin', 2);

-- --------------------------------------------------------

--
-- Table structure for table `monthly_menus`
--

CREATE TABLE `monthly_menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `month` int(10) UNSIGNED NOT NULL,
  `year` int(10) UNSIGNED NOT NULL,
  `kitchen_id` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `menu_template_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `published_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monthly_menu_items`
--

CREATE TABLE `monthly_menu_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `monthly_menu_id` bigint(20) UNSIGNED NOT NULL,
  `menu_date` date NOT NULL,
  `day_name` varchar(20) NOT NULL,
  `meal_category_id` bigint(20) UNSIGNED NOT NULL,
  `meal_id` bigint(20) UNSIGNED NOT NULL,
  `meal_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `meal_limit` int(10) UNSIGNED NOT NULL DEFAULT 50,
  `remaining_quantity` int(10) UNSIGNED NOT NULL DEFAULT 50,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `is_optional` tinyint(1) NOT NULL DEFAULT 0,
  `is_special` tinyint(1) NOT NULL DEFAULT 0,
  `is_festival` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) DEFAULT NULL,
  `notification_number` varchar(255) NOT NULL,
  `recipient_type` varchar(255) NOT NULL COMMENT 'Customer, Admin, etc.',
  `recipient_id` bigint(20) UNSIGNED NOT NULL,
  `template_id` bigint(20) UNSIGNED DEFAULT NULL,
  `event_name` varchar(255) DEFAULT NULL COMMENT 'e.g. order.placed, payment.success',
  `channel` enum('push','email','sms','in_app','whatsapp') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `priority` enum('low','normal','high','critical') NOT NULL DEFAULT 'normal',
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `delivery_status` enum('pending','queued','sent','delivered','read','failed','cancelled') NOT NULL DEFAULT 'pending',
  `read_at` timestamp NULL DEFAULT NULL,
  `failure_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_logs`
--

CREATE TABLE `notification_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) DEFAULT NULL,
  `notification_id` bigint(20) UNSIGNED NOT NULL,
  `provider` varchar(255) NOT NULL COMMENT 'fcm, twilio, smtp, etc.',
  `provider_message_id` varchar(255) DEFAULT NULL,
  `request_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`request_payload`)),
  `response_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`response_payload`)),
  `status` enum('success','failed','pending') NOT NULL DEFAULT 'pending',
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_preferences`
--

CREATE TABLE `notification_preferences` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) DEFAULT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `push_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `email_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `sms_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `marketing_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `order_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `payment_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `subscription_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `system_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `language` varchar(255) NOT NULL DEFAULT 'en',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_templates`
--

CREATE TABLE `notification_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) DEFAULT NULL,
  `template_code` varchar(255) NOT NULL,
  `template_name` varchar(255) NOT NULL,
  `notification_type` enum('transactional','marketing','system','reminder') NOT NULL,
  `channel` enum('push','email','sms','in_app','whatsapp') NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of variable placeholders' CHECK (json_valid(`variables`)),
  `language` varchar(255) NOT NULL DEFAULT 'en',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `order_type` varchar(255) NOT NULL DEFAULT 'subscription',
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `subscription_id` bigint(20) UNSIGNED DEFAULT NULL,
  `kitchen_id` bigint(20) UNSIGNED DEFAULT NULL,
  `address_id` bigint(20) UNSIGNED DEFAULT NULL,
  `delivery_zone_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_date` date NOT NULL,
  `delivery_date` date NOT NULL,
  `meal_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meal_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meal_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `coupon_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `delivery_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `order_status` varchar(255) NOT NULL DEFAULT 'pending',
  `delivery_slot` varchar(255) DEFAULT NULL,
  `delivery_instruction` text DEFAULT NULL,
  `wallet_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `reward_points_used` int(11) NOT NULL DEFAULT 0,
  `reward_points_earned` int(11) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `cancelled_by` bigint(20) UNSIGNED DEFAULT NULL,
  `cancellation_reason` varchar(255) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `uuid`, `order_number`, `order_type`, `customer_id`, `subscription_id`, `kitchen_id`, `address_id`, `delivery_zone_id`, `order_date`, `delivery_date`, `meal_category_id`, `meal_type_id`, `meal_id`, `quantity`, `unit_price`, `subtotal`, `discount_amount`, `coupon_amount`, `tax_amount`, `delivery_charge`, `total_amount`, `payment_status`, `payment_method`, `order_status`, `delivery_slot`, `delivery_instruction`, `wallet_amount`, `reward_points_used`, `reward_points_earned`, `notes`, `cancelled_at`, `cancelled_by`, `cancellation_reason`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'a5a564c7-f9f9-4163-94b2-ef59006b5639', 'ORD-000001', 'single', 1, NULL, NULL, 4, 1, '2026-07-31', '2026-08-01', NULL, NULL, NULL, 1, 150.00, 150.00, 0.00, 0.00, 15.00, 5.00, 170.00, 'paid', 'upi', 'delivered', NULL, NULL, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-07-31 05:30:52', '2026-07-31 05:49:05', NULL),
(2, '4460c0d7-8696-4574-b06a-d4d0096e8942', 'ORD-000002', 'single', 1, NULL, NULL, 4, 1, '2026-07-31', '2026-08-01', NULL, NULL, NULL, 1, 100.00, 100.00, 0.00, 0.00, 10.00, 5.00, 115.00, 'paid', 'wallet', 'delivered', 'morning', NULL, 115.00, 0, 0, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-07-31 05:54:31', '2026-07-31 07:28:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_cancellations`
--

CREATE TABLE `order_cancellations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `cancellation_reason` varchar(255) NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `refund_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `refund_processed` tinyint(1) NOT NULL DEFAULT 0,
  `cancelled_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `meal_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meal_name` varchar(255) NOT NULL,
  `meal_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meal_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `uuid`, `order_id`, `meal_id`, `meal_name`, `meal_category_id`, `meal_type_id`, `quantity`, `unit_price`, `tax`, `discount`, `total`, `remarks`, `created_at`, `updated_at`) VALUES
(1, '56a66e3c-be3b-45ce-a1a2-6a668c2c9e5d', 1, 2, 'Dal Makhni + Paratha + Rice', NULL, 1, 1, 150.00, 15.00, 0.00, 150.00, NULL, '2026-07-31 05:30:52', '2026-07-31 05:30:52'),
(2, '727cef8c-1858-4437-ba3b-66bd90bc3ba3', 2, 1, 'Aloo Paratha + Chole Bature +Rice', NULL, 1, 1, 100.00, 10.00, 0.00, 100.00, NULL, '2026-07-31 05:54:31', '2026-07-31 05:54:31');

-- --------------------------------------------------------

--
-- Table structure for table `order_refunds`
--

CREATE TABLE `order_refunds` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `refund_number` varchar(255) NOT NULL,
  `refund_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `refund_method` varchar(255) NOT NULL DEFAULT 'wallet',
  `refund_status` varchar(255) NOT NULL DEFAULT 'pending',
  `refund_reason` text DEFAULT NULL,
  `processed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `from_status` varchar(255) NOT NULL,
  `to_status` varchar(255) NOT NULL,
  `reason` text DEFAULT NULL,
  `changed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_status_history`
--

INSERT INTO `order_status_history` (`id`, `uuid`, `order_id`, `from_status`, `to_status`, `reason`, `changed_by`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 'bcd04d06-1c3e-4506-abd8-da1383c5999b', 1, 'new', 'pending', 'Order placed by customer', NULL, NULL, '2026-07-31 05:30:52', '2026-07-31 05:30:52'),
(2, '45651264-edef-4fac-8f75-609bfa88bbdc', 1, 'pending', 'confirmed', 'Order confirmed', 1, NULL, '2026-07-31 05:45:43', '2026-07-31 05:45:43'),
(3, '37ec0473-1453-45c6-805b-e0590d55b377', 1, 'confirmed', 'preparing', 'Order preparation started', 1, NULL, '2026-07-31 05:46:30', '2026-07-31 05:46:30'),
(4, '6edb14b7-31e4-4782-9bcc-669c622fec31', 1, 'preparing', 'ready', 'Order ready for dispatch', 1, NULL, '2026-07-31 05:47:50', '2026-07-31 05:47:50'),
(5, 'b9a21719-5fa5-432e-ada9-f2805c6d71a5', 1, 'ready', 'out_for_delivery', 'Order dispatched for delivery', 1, NULL, '2026-07-31 05:48:37', '2026-07-31 05:48:37'),
(6, '483b4b8b-0731-46d6-b8a9-59197abd92f1', 1, 'out_for_delivery', 'delivered', 'Order delivered', 1, NULL, '2026-07-31 05:49:05', '2026-07-31 05:49:05'),
(7, '67b79ee6-ef3d-4829-9b2b-16555d2656da', 2, 'new', 'pending', 'Order placed by customer', NULL, NULL, '2026-07-31 05:54:31', '2026-07-31 05:54:31'),
(8, '25eec29a-a83a-4b55-87bf-00f5e8a23035', 2, 'pending', 'confirmed', 'Order confirmed', 1, NULL, '2026-07-31 05:55:11', '2026-07-31 05:55:11'),
(9, '778be750-8a46-43c6-b6be-0127b23060d3', 2, 'confirmed', 'preparing', 'Order preparation started', 1, NULL, '2026-07-31 07:27:56', '2026-07-31 07:27:56'),
(10, '20723e31-231c-474c-b0d3-cf92d423b148', 2, 'preparing', 'ready', 'Order ready for dispatch', 1, NULL, '2026-07-31 07:28:03', '2026-07-31 07:28:03'),
(11, 'b9beb181-c88b-4d20-83f1-b9d143fa789d', 2, 'ready', 'out_for_delivery', 'Order dispatched for delivery', 1, NULL, '2026-07-31 07:28:17', '2026-07-31 07:28:17'),
(12, '089c9504-92ac-475c-a6a3-0e87f1e2d1db', 2, 'out_for_delivery', 'delivered', 'Order delivered', 1, NULL, '2026-07-31 07:28:22', '2026-07-31 07:28:22');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_refunds`
--

CREATE TABLE `payment_refunds` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `refund_number` varchar(50) NOT NULL,
  `payment_transaction_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `refund_amount` decimal(14,2) NOT NULL,
  `refund_reason` text DEFAULT NULL,
  `gateway_refund_id` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `processed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `transaction_number` varchar(50) NOT NULL,
  `gateway_name` varchar(50) NOT NULL,
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `gateway_order_id` varchar(255) DEFAULT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `subscription_id` bigint(20) UNSIGNED DEFAULT NULL,
  `payment_type` varchar(50) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'INR',
  `gateway_fee` decimal(14,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `payment_date` timestamp NULL DEFAULT NULL,
  `failure_reason` text DEFAULT NULL,
  `webhook_verified` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_webhook_logs`
--

CREATE TABLE `payment_webhook_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `gateway_name` varchar(50) NOT NULL,
  `event_name` varchar(100) NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `signature` text DEFAULT NULL,
  `verification_status` varchar(20) NOT NULL DEFAULT 'pending',
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL DEFAULT 'admin',
  `display_name` varchar(255) DEFAULT NULL,
  `group` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `display_name`, `group`, `description`, `created_at`, `updated_at`) VALUES
(1, 'view_dashboard', 'admin', 'View Dashboard', 'Dashboard', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(2, 'view_admin_users', 'admin', 'View Admin Users', 'Admin Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(3, 'create_admin_users', 'admin', 'Create Admin Users', 'Admin Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(4, 'update_admin_users', 'admin', 'Update Admin Users', 'Admin Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(5, 'delete_admin_users', 'admin', 'Delete Admin Users', 'Admin Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(6, 'activate_admin_users', 'admin', 'Activate Admin Users', 'Admin Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(7, 'deactivate_admin_users', 'admin', 'Deactivate Admin Users', 'Admin Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(8, 'reset_admin_password', 'admin', 'Reset Admin Password', 'Admin Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(9, 'view_roles', 'admin', 'View Roles', 'Role Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(10, 'create_roles', 'admin', 'Create Roles', 'Role Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(11, 'update_roles', 'admin', 'Update Roles', 'Role Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(12, 'delete_roles', 'admin', 'Delete Roles', 'Role Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(13, 'assign_permissions', 'admin', 'Assign Permissions', 'Role Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(14, 'view_permissions', 'admin', 'View Permissions', 'Permission Management', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(15, 'view_profile', 'admin', 'View Profile', 'Profile', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(16, 'update_profile', 'admin', 'Update Profile', 'Profile', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(17, 'change_password', 'admin', 'Change Password', 'Profile', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(18, 'view_settings', 'admin', 'View Settings', 'Settings', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(19, 'update_settings', 'admin', 'Update Settings', 'Settings', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(20, 'view_login_history', 'admin', 'View Login History', 'Login History', NULL, '2026-07-26 05:22:21', '2026-07-26 05:22:21');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pincodes`
--

CREATE TABLE `pincodes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `delivery_zone_id` bigint(20) UNSIGNED NOT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL,
  `state_id` bigint(20) UNSIGNED NOT NULL,
  `city_id` bigint(20) UNSIGNED NOT NULL,
  `area_id` bigint(20) UNSIGNED DEFAULT NULL,
  `pincode` varchar(10) NOT NULL,
  `office_name` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `is_serviceable` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pincodes`
--

INSERT INTO `pincodes` (`id`, `uuid`, `delivery_zone_id`, `country_id`, `state_id`, `city_id`, `area_id`, `pincode`, `office_name`, `district`, `latitude`, `longitude`, `status`, `is_serviceable`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '589ea729-687a-440d-bfe4-8bf8a59a1416', 1, 1, 1, 1, 1, '474001', 'Main Branch', 'Gwalior', 26.1698000, 78.1244000, 'active', 1, 1, 1, NULL, '2026-07-30 02:24:19', '2026-07-30 02:24:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pincode_requests`
--

CREATE TABLE `pincode_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `pincode` varchar(10) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `production_batches`
--

CREATE TABLE `production_batches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `batch_number` varchar(50) NOT NULL,
  `production_date` date NOT NULL,
  `kitchen_id` bigint(20) UNSIGNED NOT NULL,
  `batch_name` varchar(150) NOT NULL,
  `batch_type` enum('regular','special','bulk','emergency') NOT NULL DEFAULT 'regular',
  `total_orders` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total_meals` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `planned_start_time` time DEFAULT NULL,
  `planned_end_time` time DEFAULT NULL,
  `actual_start_time` datetime DEFAULT NULL,
  `actual_end_time` datetime DEFAULT NULL,
  `production_status` enum('draft','planned','cooking','prepared','packing','packed','completed','cancelled') NOT NULL DEFAULT 'draft',
  `prepared_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `production_batch_items`
--

CREATE TABLE `production_batch_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `production_batch_id` bigint(20) UNSIGNED NOT NULL,
  `meal_id` bigint(20) UNSIGNED NOT NULL,
  `meal_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meal_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `planned_quantity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `prepared_quantity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `packed_quantity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `wastage_quantity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `remaining_quantity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` enum('pending','cooking','prepared','packing','packed','cancelled') NOT NULL DEFAULT 'pending',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `production_schedules`
--

CREATE TABLE `production_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `kitchen_id` bigint(20) UNSIGNED DEFAULT NULL,
  `production_date` date NOT NULL,
  `meal_type` enum('breakfast','lunch','dinner','healthy_meal','snack') NOT NULL,
  `planned_quantity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `produced_quantity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `remaining_quantity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `production_start` datetime DEFAULT NULL,
  `production_end` datetime DEFAULT NULL,
  `status` enum('planned','in_progress','completed','cancelled') NOT NULL DEFAULT 'planned',
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `production_schedules`
--

INSERT INTO `production_schedules` (`id`, `uuid`, `kitchen_id`, `production_date`, `meal_type`, `planned_quantity`, `produced_quantity`, `remaining_quantity`, `production_start`, `production_end`, `status`, `remarks`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(4, '52c3a2b3-af97-4896-ae87-e4e9dcbfe3d1', 1, '2026-07-30', 'breakfast', 0, 0, 0, NULL, NULL, 'planned', NULL, 1, 1, '2026-07-30 05:33:02', '2026-07-30 05:33:02'),
(5, '541dd0de-ce1a-43f6-b9ee-4840eb2c68cd', 1, '2026-07-29', 'lunch', 50, 2, 48, NULL, NULL, 'planned', NULL, 1, 1, '2026-07-30 05:33:02', '2026-07-30 05:34:02'),
(6, 'e0eff247-6a9f-4332-b6c5-a5d19346eaf1', 1, '2026-07-30', 'dinner', 0, 0, 0, NULL, NULL, 'planned', NULL, 1, 1, '2026-07-30 05:33:02', '2026-07-30 05:33:02');

-- --------------------------------------------------------

--
-- Table structure for table `production_status_history`
--

CREATE TABLE `production_status_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `production_batch_id` bigint(20) UNSIGNED NOT NULL,
  `from_status` varchar(50) DEFAULT NULL,
  `to_status` varchar(50) NOT NULL,
  `reason` text DEFAULT NULL,
  `changed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `po_number` varchar(50) NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `purchase_request_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_date` date NOT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `shipping_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `other_charges` decimal(12,2) NOT NULL DEFAULT 0.00,
  `grand_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_terms` varchar(100) DEFAULT 'Net 30',
  `payment_status` enum('pending','partial','paid','overdue','cancelled') NOT NULL DEFAULT 'pending',
  `order_status` enum('draft','approved','sent','partially_received','received','closed','cancelled') NOT NULL DEFAULT 'draft',
  `remarks` text DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `purchase_order_id` bigint(20) UNSIGNED NOT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `ordered_quantity` decimal(12,2) NOT NULL,
  `received_quantity` decimal(12,2) NOT NULL DEFAULT 0.00,
  `pending_quantity` decimal(12,2) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `tax_percentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `line_total` decimal(12,2) NOT NULL,
  `unit_id` bigint(20) UNSIGNED NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_requests`
--

CREATE TABLE `purchase_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `request_number` varchar(50) NOT NULL,
  `request_date` date NOT NULL,
  `request_type` enum('manual','auto_reorder','auto_forecast','auto_production') NOT NULL DEFAULT 'manual',
  `requested_by` varchar(150) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `status` enum('draft','pending_approval','approved','rejected','converted_to_po','cancelled') NOT NULL DEFAULT 'draft',
  `expected_date` date DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_request_items`
--

CREATE TABLE `purchase_request_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `purchase_request_id` bigint(20) UNSIGNED NOT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `requested_quantity` decimal(12,2) NOT NULL,
  `approved_quantity` decimal(12,2) DEFAULT NULL,
  `unit_id` bigint(20) UNSIGNED NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `recipe_code` varchar(50) NOT NULL,
  `meal_id` bigint(20) UNSIGNED NOT NULL,
  `recipe_name` varchar(200) NOT NULL,
  `version` int(11) NOT NULL DEFAULT 1,
  `yield_quantity` decimal(10,2) NOT NULL DEFAULT 1.00,
  `yield_unit` varchar(50) NOT NULL,
  `preparation_time` int(11) DEFAULT 0,
  `cooking_time` int(11) DEFAULT 0,
  `serving_size` int(11) NOT NULL DEFAULT 1,
  `recipe_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `food_cost_percentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `status` enum('draft','active','inactive','archived') NOT NULL DEFAULT 'draft',
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recipe_items`
--

CREATE TABLE `recipe_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `recipe_id` bigint(20) UNSIGNED NOT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `unit_id` bigint(20) UNSIGNED NOT NULL,
  `required_quantity` decimal(12,4) NOT NULL,
  `wastage_percentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `actual_quantity` decimal(12,4) DEFAULT NULL,
  `cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recipe_versions`
--

CREATE TABLE `recipe_versions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `recipe_id` bigint(20) UNSIGNED NOT NULL,
  `version` int(11) NOT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `change_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report_exports`
--

CREATE TABLE `report_exports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) DEFAULT NULL,
  `report_name` varchar(255) NOT NULL,
  `export_format` enum('pdf','excel','csv') NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `generated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `generated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `meal_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `title` text DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'approved',
  `is_verified_purchase` tinyint(1) NOT NULL DEFAULT 0,
  `admin_response` text DEFAULT NULL,
  `admin_responded_at` datetime DEFAULT NULL,
  `admin_responded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `uuid`, `customer_id`, `meal_id`, `order_id`, `rating`, `title`, `comment`, `photo`, `status`, `is_verified_purchase`, `admin_response`, `admin_responded_at`, `admin_responded_by`, `reviewed_by`, `rejection_reason`, `is_featured`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '986ff049-0bb4-44f4-b85f-92532f22c6d9', 1, 2, 1, 5, 'Good', 'Nice Test', NULL, 'approved', 1, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-07-31 05:52:48', '2026-07-31 05:52:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL DEFAULT 'admin',
  `display_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `display_name`, `description`, `is_default`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'super_admin', 'admin', 'Super Admin', 'Full system access', 0, 1, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(2, 'admin', 'admin', 'Admin', 'Administrative access', 0, 2, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(3, 'manager', 'admin', 'Manager', 'Management access', 0, 3, '2026-07-26 05:22:21', '2026-07-26 05:22:21'),
(4, 'staff', 'admin', 'Staff', 'Basic access', 1, 4, '2026-07-26 05:22:21', '2026-07-26 05:22:21');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(3, 1),
(3, 2),
(3, 9),
(3, 14),
(3, 15),
(3, 16),
(3, 17),
(3, 18),
(3, 20),
(4, 1),
(4, 15),
(4, 16),
(4, 17);

-- --------------------------------------------------------

--
-- Table structure for table `saved_reports`
--

CREATE TABLE `saved_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) DEFAULT NULL,
  `report_code` varchar(255) NOT NULL,
  `report_name` varchar(255) NOT NULL,
  `report_type` enum('executive','sales','revenue','order','subscription','customer','kitchen','meal','inventory','purchase','supplier','expense','finance','payment','gst','notification') NOT NULL,
  `filters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`filters`)),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scheduled_reports`
--

CREATE TABLE `scheduled_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) DEFAULT NULL,
  `report_name` varchar(255) NOT NULL,
  `report_type` enum('executive','sales','revenue','order','subscription','customer','kitchen','meal','inventory','purchase','supplier','expense','finance','payment','gst','notification') NOT NULL,
  `frequency` enum('daily','weekly','monthly','quarterly','yearly') NOT NULL,
  `export_format` enum('pdf','excel','csv') NOT NULL DEFAULT 'pdf',
  `email_recipients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`email_recipients`)),
  `next_run` timestamp NULL DEFAULT NULL,
  `status` enum('active','paused') NOT NULL DEFAULT 'active',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `state_code` varchar(255) DEFAULT NULL,
  `abbreviation` varchar(10) DEFAULT NULL,
  `gst_code` varchar(10) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `uuid`, `country_id`, `name`, `state_code`, `abbreviation`, `gst_code`, `latitude`, `longitude`, `status`, `sort_order`, `is_default`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '5bf080e1-5d5e-4cd8-99cc-bc759419d915', 1, 'Madhya Pradesh', 'MP', 'MP', '23', 21.6000000, 74.9000000, 'active', 0, 1, NULL, 1, 1, NULL, '2026-07-29 16:05:20', '2026-07-29 16:05:20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stock_audits`
--

CREATE TABLE `stock_audits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `audit_number` varchar(50) NOT NULL,
  `audit_date` date NOT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `system_quantity` decimal(12,2) NOT NULL,
  `physical_quantity` decimal(12,2) NOT NULL,
  `difference_quantity` decimal(12,2) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_pause_history`
--

CREATE TABLE `subscription_pause_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `customer_subscription_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(30) NOT NULL,
  `pause_start` date DEFAULT NULL,
  `pause_end` date DEFAULT NULL,
  `pause_days` int(11) NOT NULL DEFAULT 0,
  `new_end_date` date DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'approved',
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `plan_code` varchar(50) NOT NULL,
  `plan_name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `plan_type` varchar(30) NOT NULL DEFAULT 'monthly',
  `billing_cycle` varchar(30) NOT NULL DEFAULT 'monthly',
  `duration_days` int(10) UNSIGNED NOT NULL DEFAULT 30,
  `meal_category_id` bigint(20) UNSIGNED NOT NULL,
  `kitchen_id` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `offer_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `security_deposit` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_percentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `delivery_charge` decimal(10,2) NOT NULL DEFAULT 0.00,
  `joining_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `minimum_order_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `maximum_skip_days` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `maximum_pause_days` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `maximum_active_subscriptions` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `meal_selection_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `custom_meal_selection` tinyint(1) NOT NULL DEFAULT 0,
  `default_meal_assignment` tinyint(1) NOT NULL DEFAULT 1,
  `carry_forward_skipped_meals` tinyint(1) NOT NULL DEFAULT 0,
  `weekend_delivery` tinyint(1) NOT NULL DEFAULT 1,
  `holiday_delivery` tinyint(1) NOT NULL DEFAULT 0,
  `allow_upgrade` tinyint(1) NOT NULL DEFAULT 1,
  `allow_downgrade` tinyint(1) NOT NULL DEFAULT 0,
  `allow_pause` tinyint(1) NOT NULL DEFAULT 1,
  `allow_resume` tinyint(1) NOT NULL DEFAULT 1,
  `allow_skip` tinyint(1) NOT NULL DEFAULT 1,
  `allow_cancel` tinyint(1) NOT NULL DEFAULT 1,
  `auto_renew` tinyint(1) NOT NULL DEFAULT 0,
  `renewal_discount` decimal(5,2) NOT NULL DEFAULT 0.00,
  `trial_days` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_popular` tinyint(1) NOT NULL DEFAULT 0,
  `is_recommended` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscription_plans`
--

INSERT INTO `subscription_plans` (`id`, `uuid`, `plan_code`, `plan_name`, `slug`, `description`, `plan_type`, `billing_cycle`, `duration_days`, `meal_category_id`, `kitchen_id`, `display_order`, `price`, `offer_price`, `security_deposit`, `tax_percentage`, `delivery_charge`, `joining_fee`, `minimum_order_amount`, `maximum_skip_days`, `maximum_pause_days`, `maximum_active_subscriptions`, `meal_selection_enabled`, `custom_meal_selection`, `default_meal_assignment`, `carry_forward_skipped_meals`, `weekend_delivery`, `holiday_delivery`, `allow_upgrade`, `allow_downgrade`, `allow_pause`, `allow_resume`, `allow_skip`, `allow_cancel`, `auto_renew`, `renewal_discount`, `trial_days`, `is_popular`, `is_recommended`, `status`, `starts_at`, `ends_at`, `remarks`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 'a551d428-f1eb-4774-b387-b6ba05d77376', 'PLan01', 'Weekly Dinner', 'weekly-dinner', 'Weekly Dinner Provide a 7 day dalily dinner for you at your dorestep.', 'weekly', 'weekly', 7, 2, 1, 0, 550.00, 0.00, 550.00, 10.00, 20.00, 0.00, 80.00, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0.00, 0, 1, 1, 'active', NULL, NULL, NULL, 1, 1, NULL, '2026-07-31 07:53:44', '2026-07-31 07:53:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plan_meals`
--

CREATE TABLE `subscription_plan_meals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `subscription_plan_id` bigint(20) UNSIGNED NOT NULL,
  `meal_category_id` bigint(20) UNSIGNED NOT NULL,
  `meal_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meal_id` bigint(20) UNSIGNED NOT NULL,
  `day_of_week` varchar(20) DEFAULT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `is_optional` tinyint(1) NOT NULL DEFAULT 0,
  `is_default` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_renew_history`
--

CREATE TABLE `subscription_renew_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `customer_subscription_id` bigint(20) UNSIGNED NOT NULL,
  `from_plan_id` bigint(20) UNSIGNED NOT NULL,
  `to_plan_id` bigint(20) UNSIGNED NOT NULL,
  `old_end_date` date NOT NULL,
  `new_end_date` date NOT NULL,
  `old_remaining_meals` int(11) NOT NULL DEFAULT 0,
  `new_remaining_meals` int(11) NOT NULL DEFAULT 0,
  `renewal_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `final_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `renewal_type` varchar(30) NOT NULL DEFAULT 'manual',
  `reason` text DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_skip_history`
--

CREATE TABLE `subscription_skip_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `customer_subscription_id` bigint(20) UNSIGNED NOT NULL,
  `skip_type` varchar(30) NOT NULL,
  `skip_date` date NOT NULL,
  `meal_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meals_credited` int(11) NOT NULL DEFAULT 0,
  `credit_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `reason` text DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'approved',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_status_history`
--

CREATE TABLE `subscription_status_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `customer_subscription_id` bigint(20) UNSIGNED NOT NULL,
  `from_status` varchar(30) NOT NULL,
  `to_status` varchar(30) NOT NULL,
  `reason` text DEFAULT NULL,
  `changed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscription_status_history`
--

INSERT INTO `subscription_status_history` (`id`, `uuid`, `customer_subscription_id`, `from_status`, `to_status`, `reason`, `changed_by`, `metadata`, `created_at`, `updated_at`) VALUES
(1, '7df956c1-5eb8-4fba-ac1a-c0bcc6c0c5a2', 1, 'new', 'pending', 'Subscription purchased', NULL, NULL, '2026-07-31 08:15:48', '2026-07-31 08:15:48'),
(2, 'b8aeb97e-c557-485f-bba6-d71cee77a541', 1, 'pending', 'active', 'Subscription activated', 1, NULL, '2026-07-31 08:18:04', '2026-07-31 08:18:04');

-- --------------------------------------------------------

--
-- Table structure for table `subscription_upgrade_history`
--

CREATE TABLE `subscription_upgrade_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `customer_subscription_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(30) NOT NULL,
  `from_plan_id` bigint(20) UNSIGNED NOT NULL,
  `to_plan_id` bigint(20) UNSIGNED NOT NULL,
  `price_difference` decimal(12,2) NOT NULL DEFAULT 0.00,
  `remaining_meals_before` int(11) NOT NULL DEFAULT 0,
  `remaining_meals_after` int(11) NOT NULL DEFAULT 0,
  `reason` text DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `refund_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `additional_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `supplier_code` varchar(50) NOT NULL,
  `supplier_name` varchar(200) DEFAULT NULL,
  `supplier_type` enum('raw_material','packaging','gas','cleaning','equipment','general') NOT NULL DEFAULT 'general',
  `company_name` varchar(200) NOT NULL,
  `contact_person` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `alternate_mobile` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gst_number` varchar(20) DEFAULT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `fssai_license` varchar(50) DEFAULT NULL,
  `drug_license` varchar(50) DEFAULT NULL,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `country_id` bigint(20) UNSIGNED DEFAULT NULL,
  `state_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `payment_terms` varchar(100) DEFAULT 'Net 30',
  `credit_limit` decimal(12,2) NOT NULL DEFAULT 0.00,
  `credit_days` decimal(5,0) NOT NULL DEFAULT 0,
  `opening_balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `current_balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_preferred` tinyint(1) NOT NULL DEFAULT 0,
  `outstanding_balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `rating` tinyint(4) NOT NULL DEFAULT 0,
  `status` enum('active','inactive','blocked') NOT NULL DEFAULT 'active',
  `remarks` text DEFAULT NULL,
  `bank_name` varchar(150) DEFAULT NULL,
  `account_holder_name` varchar(150) DEFAULT NULL,
  `account_number` varchar(30) DEFAULT NULL,
  `ifsc_code` varchar(15) DEFAULT NULL,
  `branch_name` varchar(150) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_contacts`
--

CREATE TABLE `supplier_contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_documents`
--

CREATE TABLE `supplier_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `document_type` enum('gst_certificate','pan_card','fssai_license','drug_license','insurance','agreement','quality_certificate','other') NOT NULL,
  `document_name` varchar(200) NOT NULL,
  `document_path` varchar(500) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` enum('active','expired','revoked') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_ledger`
--

CREATE TABLE `supplier_ledger` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `journal_entry_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `transaction_date` date NOT NULL,
  `description` text NOT NULL,
  `debit_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `credit_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(30) DEFAULT NULL,
  `transaction_reference` varchar(100) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_price_history`
--

CREATE TABLE `supplier_price_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `old_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `new_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `effective_from` date NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_products`
--

CREATE TABLE `supplier_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `inventory_item_id` bigint(20) UNSIGNED NOT NULL,
  `supplier_product_code` varchar(50) DEFAULT NULL,
  `supplier_product_name` varchar(200) DEFAULT NULL,
  `purchase_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `minimum_order_quantity` decimal(12,2) NOT NULL DEFAULT 1.00,
  `maximum_order_quantity` decimal(12,2) DEFAULT NULL,
  `lead_time_days` int(11) NOT NULL DEFAULT 0,
  `unit_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_primary_supplier` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_backups`
--

CREATE TABLE `system_backups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `backup_name` varchar(255) NOT NULL,
  `backup_type` enum('database','storage','full') NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `status` enum('pending','in_progress','completed','failed') NOT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `setting_group` varchar(100) NOT NULL,
  `setting_key` varchar(150) NOT NULL,
  `setting_value` longtext DEFAULT NULL,
  `data_type` enum('string','integer','float','boolean','json','text') NOT NULL DEFAULT 'string',
  `is_encrypted` tinyint(1) NOT NULL DEFAULT 0,
  `autoload` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `remarks` varchar(500) DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `uuid`, `setting_group`, `setting_key`, `setting_value`, `data_type`, `is_encrypted`, `autoload`, `status`, `remarks`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '8937b71f-da4e-4e63-80d1-0b63a1b8b007', 'general', 'site_name', 'Vyarufood Tiffin', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(2, 'f6cbc77b-e204-4e4c-9ab3-e9786d45a030', 'general', 'site_tagline', 'Fresh Tiffin Service', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(3, '3cf201a2-d1b1-45c7-a549-dac40cdba225', 'general', 'site_url', 'https://vyarufood.com', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(4, 'ea89dcb6-120f-4a79-93bb-260b1ba41058', 'general', 'support_email', 'support@vyarufood.com', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(5, 'cd725106-2358-4e27-aa68-23fca1b28960', 'general', 'support_phone', '+91-9876543210', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(6, 'ed59bf06-febe-4bbc-8433-0aa45bc1929e', 'company', 'company_name', 'Vyarufood Tiffin Services Pvt Ltd', 'string', 0, 1, 'active', NULL, 1, '2026-07-29 07:35:00', '2026-07-29 07:41:01', NULL),
(7, '7b1f72de-7cdb-4b50-badd-a6232e465ec1', 'company', 'company_address', '12 Bigha , Shikander Kampo, Lashkar Gwalior.', 'text', 0, 1, 'active', NULL, 1, '2026-07-29 07:35:00', '2026-07-29 07:40:35', NULL),
(8, '5ecf6947-0b18-41c6-8e74-a2d261c1b958', 'company', 'company_phone', '+91-9039688839', 'string', 0, 1, 'active', NULL, 1, '2026-07-29 07:35:00', '2026-07-29 08:28:52', NULL),
(9, 'edd9f213-d7a4-4717-8b73-b350c2197321', 'company', 'company_email', 'help@vyarufood.com', 'string', 0, 1, 'active', NULL, 1, '2026-07-29 07:35:00', '2026-07-29 07:40:52', NULL),
(10, 'c5471ca7-8595-44c1-b946-a539aef4b2e4', 'company', 'company_website', 'https://vyarufood.com', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(11, '65895c25-51d8-4773-bf06-d233f3c55e4c', 'company', 'gst_number', '27AABCV1234H1ZV', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(12, 'cb9418e8-d861-4be7-92c1-fd55b26c73b7', 'company', 'fssai_number', '12345678901234', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(13, '7cce5839-c9d5-40e2-be25-2d590a3d6572', 'branding', 'logo_path', NULL, 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(14, '9733705a-678d-4b1c-bb1b-5f95a7aa1c8b', 'branding', 'favicon_path', NULL, 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(15, 'cd3e62c9-e8ca-40a3-b0af-b802183435cb', 'branding', 'primary_color', '#FF6B00', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(16, '767d00c7-838f-4cdb-aead-ccde205b8df8', 'branding', 'secondary_color', '#1A1A2E', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(17, '5d525973-b2a3-4747-979e-cf17fb1ffe99', 'localization', 'default_language', 'en', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(18, 'ece04b57-5be5-4016-8192-05796d249a64', 'localization', 'timezone', 'Asia/Kolkata', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(19, 'dbd581bb-b078-4e6c-b66f-fa28e200e478', 'localization', 'currency_code', 'INR', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(20, 'a1b807e1-d5a8-47f7-874a-aaa02e1e5973', 'localization', 'currency_symbol', '₹', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(21, '0c55c1ac-3cb5-4b1a-b38b-5d8cd379b305', 'email', 'smtp_host', 'smtp.mailtrap.io', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(22, 'a932b35d-aca8-4159-a03a-889ff46ffa58', 'email', 'smtp_port', '587', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(23, '4be955a3-8b5f-454c-8bdf-840e683a47bb', 'email', 'smtp_username', '', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(24, '1c4ed21b-c804-4442-b83b-4017dab5f8fd', 'email', 'smtp_password', '', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(25, '1b9b46a2-ddfc-4a29-8a98-29776601d840', 'email', 'smtp_encryption', 'tls', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(26, '7707807f-e99f-4460-87ff-b732c7044886', 'email', 'from_address', 'noreply@vyarufood.com', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(27, '96c55663-a5dc-4936-af57-3ad116e6c3d0', 'email', 'from_name', 'Vyarufood Tiffin', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(28, '3631ff1f-fe67-4716-99b3-719b014b8bff', 'sms', 'sms_provider', 'twilio', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(29, '6510e2b9-759a-46bf-a73a-95a4ac7ee2fe', 'sms', 'sms_api_key', '', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(30, '5093adbb-4ce2-4fe9-b808-52fd6b162964', 'sms', 'sms_api_secret', '', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(31, '92e643cc-2d71-465a-835d-a6877b73e534', 'sms', 'sms_sender_id', 'VYARUF', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(32, '4d21d342-6dec-4475-97b2-c106e64c2ae1', 'firebase', 'fcm_server_key', '', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(33, '122c7024-d8c1-4b28-8334-613b600347a1', 'firebase', 'fcm_sender_id', '', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(34, '52482b1c-ab7a-4634-9ee6-c066f98097d4', 'firebase', 'fcm_service_account_json', '', 'json', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(35, 'c921b447-7125-4c71-90f6-3dce26e40aaf', 'payment_gateway', 'razorpay_key_id', '', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(36, 'eb90f979-ecb7-4eae-94bc-f04d18ce4da5', 'payment_gateway', 'razorpay_key_secret', '', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(37, '8d136107-7aaf-49ea-b5fc-8c69a1b687dd', 'payment_gateway', 'razorpay_webhook_secret', '', 'string', 1, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(38, 'c6d0c954-b862-4df2-aa0c-767e918e6d70', 'payment_gateway', 'payment_sandbox_mode', 'true', 'boolean', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(39, 'cbf08a85-2a7a-4e74-8e68-d74ab0ed95a3', 'tax', 'gst_rate', '5', 'float', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(40, '8354f1b8-4a3f-4c08-8cbb-b585e73553b4', 'tax', 'cgst_rate', '2.5', 'float', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(41, '2c46b1c5-6b2c-4088-9f10-dd0f9fa50b74', 'tax', 'sgst_rate', '2.5', 'float', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(42, '97ace28f-1862-48b4-886b-6ff523a03b1b', 'tax', 'igst_rate', '5', 'float', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(43, '99b16b51-d8dc-4257-84e3-d8634f13d258', 'subscription', 'trial_days', '7', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(44, '237dda05-f392-410b-b216-716acc91787c', 'subscription', 'max_pause_days', '30', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(45, 'db423a84-5edd-42c8-a569-2af064b3e6f7', 'kitchen', 'default_prep_time_minutes', '30', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(46, '24bea52a-d667-4e8d-aa29-c1c8dbac0076', 'kitchen', 'max_orders_per_batch', '50', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(47, 'a63b28f4-b889-4aff-b854-c7dff8cc7629', 'delivery', 'free_delivery_minimum', '200', 'float', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(48, '5e91e295-c614-486f-83f2-91d4d1a4418e', 'delivery', 'delivery_charge', '30', 'float', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(49, '647ebd9d-3601-49b7-baab-df40f4d36133', 'delivery', 'max_delivery_radius_km', '15', 'float', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(50, 'e0710ee6-e08d-46b2-9df8-690f830a59c4', 'order', 'cancellation_window_minutes', '30', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(51, '7b63e53c-1a68-40c6-9d6d-1fb5cabe110c', 'order', 'auto_confirm_orders', 'true', 'boolean', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(52, '41e29356-0745-4f72-942b-15121f8598d7', 'wallet', 'min_wallet_recharge', '100', 'float', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(53, '269eecfb-3cd7-464a-b226-e932ac25cca5', 'wallet', 'max_wallet_balance', '10000', 'float', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(54, 'e0cb2e5e-7e3f-471e-aa71-7f9fb4b77d2f', 'wallet', 'wallet_expiry_days', '365', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(55, 'e6d55042-c66c-407c-b307-499907015894', 'security', 'max_login_attempts', '5', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(56, '0ed321f7-51c4-4f77-9ea6-70d1aa63d10f', 'security', 'lockout_duration_minutes', '15', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(57, 'a9132a68-510b-4248-be81-13171989dac5', 'security', 'session_timeout_minutes', '120', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(58, '493aa5db-94e7-4c1f-a551-c86ee376f172', 'security', 'password_min_length', '8', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(59, '31fab791-1ee7-4c20-b9cf-87725e9dc6b7', 'seo', 'meta_title', 'Vyarufood Tiffin - Fresh Daily Tiffin Service', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(60, '6bcaa287-2897-406e-a19d-e3788eebef45', 'seo', 'meta_description', 'Order fresh, homemade tiffin meals delivered to your doorstep.', 'text', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(61, '55d900cd-78a5-4f75-99ec-18223a660cd1', 'seo', 'meta_keywords', 'tiffin, food delivery, meal service, subscription meals', 'text', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(62, 'f2a57d66-2821-481b-afb6-e9e27cfdc6fd', 'seo', 'google_analytics_id', '', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(63, '4b87a3d0-4e6a-4701-90e1-54313e827f89', 'seo', 'facebook_pixel_id', '', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(64, '6f10527b-0e11-4f95-aee3-d11a9c3aa7e1', 'seo', 'robots_meta', 'index, follow', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(65, '94ed9d4f-9e7a-4fe7-8d26-b085cf5d4fce', 'seo', 'enable_sitemap', 'true', 'boolean', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(66, '0f0e89eb-0887-4a05-8142-5ade60d33fe8', 'api', 'rate_limit_per_minute', '60', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(67, '1618ecd8-9e29-4bd7-8246-227bfd6cb89a', 'api', 'api_version', 'v1', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(68, '589cca57-80d0-4ea8-8bbd-7bd0ec5fd847', 'maintenance', 'maintenance_mode', 'true', 'boolean', 0, 0, 'inactive', NULL, 1, '2026-07-29 07:35:00', '2026-07-29 15:02:14', NULL),
(69, '1adadb9c-97aa-425d-a2d0-5eafbbe38cf6', 'maintenance', 'maintenance_message', 'We are currently performing maintenance. Please try again later.', 'text', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(70, 'd205dd81-4b02-44a0-bb6d-5aa4a7dc86c9', 'backup', 'auto_backup_enabled', 'true', 'boolean', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(71, '708e641a-a703-442e-9737-e5cfa26242ab', 'backup', 'backup_frequency', 'daily', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(72, '4138da9d-3cec-4b42-a282-696099ac05b7', 'backup', 'backup_retention_days', '30', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(73, '310519b5-dca1-41cd-9c53-10fff18a79c5', 'logging', 'activity_log_retention_days', '90', 'integer', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(74, '8a1b8d1a-bed9-49d9-980b-bd17e262389f', 'logging', 'enable_detailed_logging', 'true', 'boolean', 0, 1, 'active', NULL, NULL, '2026-07-29 07:35:00', '2026-07-29 07:35:00', NULL),
(75, 'a0ba9a10-fcdd-4e92-afc0-e42a16d73203', 'general', 'maintenance_mode_enabled_at', '2026-07-29T20:19:39+05:30', 'string', 0, 1, 'active', NULL, NULL, '2026-07-29 13:43:22', '2026-07-29 14:49:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `symbol` varchar(20) NOT NULL,
  `type` enum('weight','volume','count','custom') NOT NULL DEFAULT 'count',
  `base_unit_id` bigint(20) UNSIGNED DEFAULT NULL,
  `conversion_factor` decimal(10,4) NOT NULL DEFAULT 1.0000,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `wallet_number` varchar(50) NOT NULL,
  `current_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `blocked_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_credit` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_debit` decimal(14,2) NOT NULL DEFAULT 0.00,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `uuid`, `customer_id`, `wallet_number`, `current_balance`, `blocked_balance`, `total_credit`, `total_debit`, `status`, `created_at`, `updated_at`) VALUES
(1, 'b60c4dea-b285-4aaf-b68f-61c7c912cd43', 1, 'WAL-IB5ECQYS', 2000.00, 0.00, 4000.00, 2000.00, 'active', '2026-07-30 03:45:07', '2026-07-30 03:56:56');

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `wallet_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_number` varchar(50) NOT NULL,
  `transaction_type` varchar(50) NOT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `opening_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `amount` decimal(14,2) NOT NULL,
  `closing_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `remarks` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`id`, `uuid`, `wallet_id`, `transaction_number`, `transaction_type`, `reference_type`, `reference_id`, `opening_balance`, `amount`, `closing_balance`, `remarks`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'e280bb84-a15d-445c-91fc-3a0ae2a62987', 1, 'WLT-ADJ-RNQKPBZN', 'credit', 'admin_adjustment', NULL, 0.00, 2000.00, 2000.00, 'Admin adjustment', 1, '2026-07-30 03:45:07', '2026-07-30 03:45:07'),
(2, '1942d757-b43a-4187-97d6-cfc1bf232cb9', 1, 'WLT-ADJ-HKO7LD1Y', 'debit', 'admin_adjustment', NULL, 2000.00, 2000.00, 0.00, 'Admin adjustment', 1, '2026-07-30 03:56:23', '2026-07-30 03:56:23'),
(3, '1ae42369-db9b-4481-a948-dbcb13817fb6', 1, 'WLT-ADJ-PKSCXOGD', 'credit', 'admin_adjustment', NULL, 0.00, 2000.00, 2000.00, 'Admin adjustment', 1, '2026-07-30 03:56:56', '2026-07-30 03:56:56');

-- --------------------------------------------------------

--
-- Table structure for table `weekly_menus`
--

CREATE TABLE `weekly_menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `kitchen_id` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `week_start_date` date NOT NULL,
  `week_end_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `published_by` bigint(20) UNSIGNED DEFAULT NULL,
  `cut_off_hours` int(10) UNSIGNED NOT NULL DEFAULT 12,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `weekly_menus`
--

INSERT INTO `weekly_menus` (`id`, `uuid`, `kitchen_id`, `title`, `description`, `week_start_date`, `week_end_date`, `status`, `published_at`, `published_by`, `cut_off_hours`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '92122c60-fc39-4904-8cfd-969c749d92fc', 1, 'Weeky Menu', NULL, '2026-08-01', '2026-08-07', 'published', '2026-07-31 12:00:16', 1, 12, 1, 1, NULL, '2026-07-31 08:31:02', '2026-07-31 12:00:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `weekly_menu_items`
--

CREATE TABLE `weekly_menu_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `weekly_menu_id` bigint(20) UNSIGNED NOT NULL,
  `menu_date` date NOT NULL,
  `meal_category_id` bigint(20) UNSIGNED NOT NULL,
  `meal_id` bigint(20) UNSIGNED NOT NULL,
  `meal_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `meal_limit` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `remaining_quantity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `is_optional` tinyint(1) NOT NULL DEFAULT 0,
  `is_recommended` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `weekly_menu_items`
--

INSERT INTO `weekly_menu_items` (`id`, `uuid`, `weekly_menu_id`, `menu_date`, `meal_category_id`, `meal_id`, `meal_type_id`, `display_order`, `meal_limit`, `remaining_quantity`, `is_default`, `is_optional`, `is_recommended`, `is_active`, `status`, `created_at`, `updated_at`) VALUES
(7, 'fdc8c439-6902-4bbc-870c-cab9bc63f343', 1, '2026-08-01', 1, 2, NULL, 0, 10, 10, 1, 1, 1, 1, 'active', '2026-07-31 11:59:57', '2026-07-31 11:59:57'),
(8, '62d73180-74ea-4ec1-9bb0-fb7144679ced', 1, '2026-08-02', 1, 1, NULL, 0, 10, 10, 1, 1, 1, 1, 'active', '2026-07-31 12:00:09', '2026-07-31 12:00:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject` (`subject_type`,`subject_id`),
  ADD KEY `causer` (`causer_type`,`causer_id`),
  ADD KEY `activity_log_log_name_index` (`log_name`),
  ADD KEY `activity_log_created_at_index` (`created_at`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `admins_email_unique` (`email`),
  ADD UNIQUE KEY `admins_mobile_unique` (`mobile`),
  ADD KEY `admins_status_index` (`status`),
  ADD KEY `admins_created_at_index` (`created_at`),
  ADD KEY `admins_created_by_foreign` (`created_by`),
  ADD KEY `admins_updated_by_foreign` (`updated_by`),
  ADD KEY `admins_deleted_by_foreign` (`deleted_by`);

--
-- Indexes for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_sessions_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `admin_sessions_token_unique` (`token`),
  ADD KEY `admin_sessions_admin_id_index` (`admin_id`),
  ADD KEY `admin_sessions_is_active_index` (`is_active`);

--
-- Indexes for table `app_versions`
--
ALTER TABLE `app_versions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `app_versions_platform_version_code_unique` (`platform`,`version_code`),
  ADD UNIQUE KEY `app_versions_uuid_unique` (`uuid`),
  ADD KEY `app_versions_platform_index` (`platform`),
  ADD KEY `app_versions_status_index` (`status`);

--
-- Indexes for table `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `areas_city_id_name_unique` (`city_id`,`name`),
  ADD UNIQUE KEY `areas_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `areas_area_code_unique` (`area_code`),
  ADD KEY `areas_name_index` (`name`),
  ADD KEY `areas_status_index` (`status`),
  ADD KEY `areas_is_default_index` (`is_default`),
  ADD KEY `areas_is_serviceable_index` (`is_serviceable`),
  ADD KEY `areas_display_order_index` (`display_order`),
  ADD KEY `areas_area_code_index` (`area_code`),
  ADD KEY `areas_country_id_index` (`country_id`),
  ADD KEY `areas_state_id_index` (`state_id`),
  ADD KEY `areas_city_id_index` (`city_id`);

--
-- Indexes for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank_accounts_account_id_foreign` (`account_id`),
  ADD KEY `bank_accounts_created_by_foreign` (`created_by`),
  ADD KEY `bank_accounts_updated_by_foreign` (`updated_by`),
  ADD KEY `bank_accounts_deleted_by_foreign` (`deleted_by`),
  ADD KEY `bank_accounts_account_name_index` (`account_name`),
  ADD KEY `bank_accounts_bank_name_index` (`bank_name`),
  ADD KEY `bank_accounts_is_default_index` (`is_default`),
  ADD KEY `bank_accounts_status_index` (`status`);

--
-- Indexes for table `bank_book`
--
ALTER TABLE `bank_book`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank_book_created_by_foreign` (`created_by`),
  ADD KEY `bank_book_bank_account_id_index` (`bank_account_id`),
  ADD KEY `bank_book_journal_entry_id_index` (`journal_entry_id`),
  ADD KEY `bank_book_transaction_date_index` (`transaction_date`),
  ADD KEY `bank_book_is_reconciled_index` (`is_reconciled`);

--
-- Indexes for table `bank_reconciliations`
--
ALTER TABLE `bank_reconciliations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank_reconciliations_reconciled_by_foreign` (`reconciled_by`),
  ADD KEY `bank_reconciliations_created_by_foreign` (`created_by`),
  ADD KEY `bank_reconciliations_updated_by_foreign` (`updated_by`),
  ADD KEY `bank_reconciliations_bank_account_id_index` (`bank_account_id`),
  ADD KEY `bank_reconciliations_reconciliation_date_index` (`reconciliation_date`),
  ADD KEY `bank_reconciliations_status_index` (`status`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cart_items_cart_id_meal_id_unique` (`cart_id`,`meal_id`),
  ADD KEY `cart_items_meal_id_foreign` (`meal_id`);

--
-- Indexes for table `cash_book`
--
ALTER TABLE `cash_book`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cash_book_created_by_foreign` (`created_by`),
  ADD KEY `cash_book_journal_entry_id_index` (`journal_entry_id`),
  ADD KEY `cash_book_transaction_date_index` (`transaction_date`),
  ADD KEY `cash_book_reference_type_reference_id_index` (`reference_type`,`reference_id`);

--
-- Indexes for table `chart_of_accounts`
--
ALTER TABLE `chart_of_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chart_of_accounts_account_code_unique` (`account_code`),
  ADD KEY `chart_of_accounts_created_by_foreign` (`created_by`),
  ADD KEY `chart_of_accounts_updated_by_foreign` (`updated_by`),
  ADD KEY `chart_of_accounts_deleted_by_foreign` (`deleted_by`),
  ADD KEY `chart_of_accounts_account_type_index` (`account_type`),
  ADD KEY `chart_of_accounts_parent_account_id_index` (`parent_account_id`),
  ADD KEY `chart_of_accounts_status_index` (`status`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cities_state_id_name_unique` (`state_id`,`name`),
  ADD UNIQUE KEY `cities_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `cities_city_code_unique` (`city_code`),
  ADD KEY `cities_name_index` (`name`),
  ADD KEY `cities_status_index` (`status`),
  ADD KEY `cities_is_default_index` (`is_default`),
  ADD KEY `cities_is_metro_index` (`is_metro`),
  ADD KEY `cities_display_order_index` (`display_order`),
  ADD KEY `cities_city_code_index` (`city_code`),
  ADD KEY `cities_country_id_index` (`country_id`),
  ADD KEY `cities_state_id_index` (`state_id`);

--
-- Indexes for table `cms_pages`
--
ALTER TABLE `cms_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cms_pages_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `cms_pages_page_code_unique` (`page_code`),
  ADD UNIQUE KEY `cms_pages_slug_unique` (`slug`),
  ADD KEY `cms_pages_page_code_index` (`page_code`),
  ADD KEY `cms_pages_slug_index` (`slug`),
  ADD KEY `cms_pages_status_index` (`status`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `countries_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `countries_iso2_unique` (`iso2`),
  ADD UNIQUE KEY `countries_iso3_unique` (`iso3`),
  ADD UNIQUE KEY `countries_name_unique` (`name`),
  ADD KEY `countries_name_index` (`name`),
  ADD KEY `countries_status_index` (`status`),
  ADD KEY `countries_is_default_index` (`is_default`),
  ADD KEY `countries_sort_order_index` (`sort_order`),
  ADD KEY `countries_region_index` (`region`),
  ADD KEY `countries_subregion_index` (`subregion`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customers_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `customers_email_unique` (`email`),
  ADD UNIQUE KEY `customers_referral_code_unique` (`referral_code`),
  ADD KEY `customers_first_name_index` (`first_name`),
  ADD KEY `customers_last_name_index` (`last_name`),
  ADD KEY `customers_phone_index` (`phone`),
  ADD KEY `customers_status_index` (`status`),
  ADD KEY `customers_is_blocked_index` (`is_blocked`),
  ADD KEY `customers_referral_code_index` (`referral_code`),
  ADD KEY `customers_referred_by_index` (`referred_by`),
  ADD KEY `customers_country_id_index` (`country_id`),
  ADD KEY `customers_state_id_index` (`state_id`),
  ADD KEY `customers_city_id_index` (`city_id`),
  ADD KEY `customers_area_id_index` (`area_id`),
  ADD KEY `customers_created_at_index` (`created_at`);

--
-- Indexes for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_addresses_uuid_unique` (`uuid`),
  ADD KEY `customer_addresses_customer_id_index` (`customer_id`),
  ADD KEY `customer_addresses_address_type_index` (`address_type`),
  ADD KEY `customer_addresses_status_index` (`status`),
  ADD KEY `customer_addresses_is_default_index` (`is_default`),
  ADD KEY `customer_addresses_is_verified_index` (`is_verified`),
  ADD KEY `customer_addresses_country_id_index` (`country_id`),
  ADD KEY `customer_addresses_state_id_index` (`state_id`),
  ADD KEY `customer_addresses_city_id_index` (`city_id`),
  ADD KEY `customer_addresses_area_id_index` (`area_id`),
  ADD KEY `customer_addresses_delivery_zone_id_index` (`delivery_zone_id`),
  ADD KEY `customer_addresses_pincode_id_index` (`pincode_id`),
  ADD KEY `customer_addresses_customer_id_is_default_index` (`customer_id`,`is_default`),
  ADD KEY `customer_addresses_customer_id_status_index` (`customer_id`,`status`),
  ADD KEY `customer_addresses_city_id_status_index` (`city_id`,`status`),
  ADD KEY `customer_addresses_created_at_index` (`created_at`);

--
-- Indexes for table `customer_ledger`
--
ALTER TABLE `customer_ledger`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_ledger_created_by_foreign` (`created_by`),
  ADD KEY `customer_ledger_customer_id_index` (`customer_id`),
  ADD KEY `customer_ledger_journal_entry_id_index` (`journal_entry_id`),
  ADD KEY `customer_ledger_transaction_date_index` (`transaction_date`),
  ADD KEY `customer_ledger_reference_type_reference_id_index` (`reference_type`,`reference_id`);

--
-- Indexes for table `customer_meal_selections`
--
ALTER TABLE `customer_meal_selections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_meal_selections_customer_id_menu_date_unique` (`customer_id`,`menu_date`),
  ADD UNIQUE KEY `customer_meal_selections_uuid_unique` (`uuid`),
  ADD KEY `customer_meal_selections_meal_id_foreign` (`meal_id`),
  ADD KEY `customer_meal_selections_meal_category_id_foreign` (`meal_category_id`),
  ADD KEY `customer_meal_selections_customer_id_index` (`customer_id`),
  ADD KEY `customer_meal_selections_weekly_menu_item_id_index` (`weekly_menu_item_id`),
  ADD KEY `customer_meal_selections_weekly_menu_id_index` (`weekly_menu_id`),
  ADD KEY `customer_meal_selections_menu_date_index` (`menu_date`);

--
-- Indexes for table `customer_subscriptions`
--
ALTER TABLE `customer_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_subscriptions_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `customer_subscriptions_subscription_number_unique` (`subscription_number`),
  ADD KEY `customer_subscriptions_kitchen_id_foreign` (`kitchen_id`),
  ADD KEY `customer_subscriptions_meal_category_id_foreign` (`meal_category_id`),
  ADD KEY `customer_subscriptions_created_by_foreign` (`created_by`),
  ADD KEY `customer_subscriptions_updated_by_foreign` (`updated_by`),
  ADD KEY `customer_subscriptions_deleted_by_foreign` (`deleted_by`),
  ADD KEY `customer_subscriptions_customer_id_index` (`customer_id`),
  ADD KEY `customer_subscriptions_subscription_plan_id_index` (`subscription_plan_id`),
  ADD KEY `customer_subscriptions_subscription_status_index` (`subscription_status`),
  ADD KEY `customer_subscriptions_payment_status_index` (`payment_status`),
  ADD KEY `customer_subscriptions_next_delivery_date_index` (`next_delivery_date`),
  ADD KEY `customer_subscriptions_customer_id_subscription_status_index` (`customer_id`,`subscription_status`);

--
-- Indexes for table `delivery_slots`
--
ALTER TABLE `delivery_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `delivery_slots_delivery_zone_id_slot_name_unique` (`delivery_zone_id`,`slot_name`),
  ADD UNIQUE KEY `delivery_slots_uuid_unique` (`uuid`),
  ADD KEY `delivery_slots_status_index` (`status`),
  ADD KEY `delivery_slots_delivery_zone_id_index` (`delivery_zone_id`);

--
-- Indexes for table `delivery_zones`
--
ALTER TABLE `delivery_zones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `delivery_zones_city_id_zone_name_unique` (`city_id`,`zone_name`),
  ADD UNIQUE KEY `delivery_zones_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `delivery_zones_zone_code_unique` (`zone_code`),
  ADD KEY `delivery_zones_zone_name_index` (`zone_name`),
  ADD KEY `delivery_zones_zone_code_index` (`zone_code`),
  ADD KEY `delivery_zones_status_index` (`status`),
  ADD KEY `delivery_zones_is_default_index` (`is_default`),
  ADD KEY `delivery_zones_priority_index` (`priority`),
  ADD KEY `delivery_zones_country_id_index` (`country_id`),
  ADD KEY `delivery_zones_state_id_index` (`state_id`),
  ADD KEY `delivery_zones_city_id_index` (`city_id`),
  ADD KEY `delivery_zones_area_id_index` (`area_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `expenses_expense_number_unique` (`expense_number`),
  ADD KEY `expenses_expense_category_id_foreign` (`expense_category_id`),
  ADD KEY `expenses_supplier_id_foreign` (`supplier_id`),
  ADD KEY `expenses_expense_date_index` (`expense_date`),
  ADD KEY `expenses_approval_status_index` (`approval_status`),
  ADD KEY `expenses_expense_status_index` (`expense_status`),
  ADD KEY `expenses_payment_method_index` (`payment_method`);

--
-- Indexes for table `expense_approvals`
--
ALTER TABLE `expense_approvals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_approvals_expense_id_approval_status_index` (`expense_id`,`approval_status`);

--
-- Indexes for table `expense_attachments`
--
ALTER TABLE `expense_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_attachments_expense_id_foreign` (`expense_id`);

--
-- Indexes for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `expense_categories_category_code_unique` (`category_code`),
  ADD KEY `expense_categories_parent_category_id_foreign` (`parent_category_id`);

--
-- Indexes for table `failed_login_attempts`
--
ALTER TABLE `failed_login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `failed_login_attempts_email_index` (`email`),
  ADD KEY `failed_login_attempts_ip_address_index` (`ip_address`),
  ADD KEY `failed_login_attempts_attempted_at_index` (`attempted_at`);

--
-- Indexes for table `financial_years`
--
ALTER TABLE `financial_years`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `financial_years_year_name_unique` (`year_name`),
  ADD KEY `financial_years_closed_by_foreign` (`closed_by`),
  ADD KEY `financial_years_created_by_foreign` (`created_by`),
  ADD KEY `financial_years_updated_by_foreign` (`updated_by`),
  ADD KEY `financial_years_deleted_by_foreign` (`deleted_by`),
  ADD KEY `financial_years_is_current_index` (`is_current`),
  ADD KEY `financial_years_is_closed_index` (`is_closed`),
  ADD KEY `financial_years_start_date_index` (`start_date`),
  ADD KEY `financial_years_end_date_index` (`end_date`);

--
-- Indexes for table `goods_receipts`
--
ALTER TABLE `goods_receipts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `goods_receipts_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `goods_receipts_grn_number_unique` (`grn_number`),
  ADD KEY `goods_receipts_purchase_order_id_foreign` (`purchase_order_id`),
  ADD KEY `goods_receipts_supplier_id_foreign` (`supplier_id`),
  ADD KEY `goods_receipts_status_index` (`status`);

--
-- Indexes for table `goods_receipt_items`
--
ALTER TABLE `goods_receipt_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `goods_receipt_items_uuid_unique` (`uuid`),
  ADD KEY `goods_receipt_items_goods_receipt_id_foreign` (`goods_receipt_id`),
  ADD KEY `goods_receipt_items_inventory_item_id_foreign` (`inventory_item_id`);

--
-- Indexes for table `gst_transactions`
--
ALTER TABLE `gst_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gst_transactions_created_by_foreign` (`created_by`),
  ADD KEY `gst_transactions_reference_type_reference_id_index` (`reference_type`,`reference_id`),
  ADD KEY `gst_transactions_journal_entry_id_index` (`journal_entry_id`),
  ADD KEY `gst_transactions_transaction_date_index` (`transaction_date`),
  ADD KEY `gst_transactions_gst_type_index` (`gst_type`),
  ADD KEY `gst_transactions_gst_rate_index` (`gst_rate`),
  ADD KEY `gst_transactions_is_reconciled_index` (`is_reconciled`);

--
-- Indexes for table `inventory_adjustments`
--
ALTER TABLE `inventory_adjustments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inventory_adjustments_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `inventory_adjustments_adjustment_number_unique` (`adjustment_number`),
  ADD KEY `inventory_adjustments_inventory_item_id_adjustment_type_index` (`inventory_item_id`,`adjustment_type`),
  ADD KEY `inventory_adjustments_adjustment_number_index` (`adjustment_number`);

--
-- Indexes for table `inventory_batches`
--
ALTER TABLE `inventory_batches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inventory_batches_uuid_unique` (`uuid`),
  ADD KEY `inventory_batches_inventory_item_id_status_index` (`inventory_item_id`,`status`),
  ADD KEY `inventory_batches_expiry_date_index` (`expiry_date`),
  ADD KEY `inventory_batches_batch_number_index` (`batch_number`);

--
-- Indexes for table `inventory_consumption_logs`
--
ALTER TABLE `inventory_consumption_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inventory_consumption_logs_uuid_unique` (`uuid`),
  ADD KEY `inventory_consumption_logs_recipe_id_foreign` (`recipe_id`),
  ADD KEY `inventory_consumption_logs_meal_id_foreign` (`meal_id`),
  ADD KEY `inventory_consumption_logs_inventory_item_id_foreign` (`inventory_item_id`),
  ADD KEY `inventory_consumption_logs_production_batch_id_index` (`production_batch_id`),
  ADD KEY `inventory_consumption_logs_consumption_date_index` (`consumption_date`);

--
-- Indexes for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inventory_items_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `inventory_items_item_code_unique` (`item_code`),
  ADD UNIQUE KEY `inventory_items_sku_unique` (`sku`),
  ADD UNIQUE KEY `inventory_items_barcode_unique` (`barcode`),
  ADD KEY `inventory_items_unit_id_foreign` (`unit_id`),
  ADD KEY `inventory_items_status_index` (`status`),
  ADD KEY `inventory_items_category_index` (`category_name`);

--
-- Indexes for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inventory_transactions_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `inventory_transactions_transaction_number_unique` (`transaction_number`),
  ADD KEY `inventory_transactions_inventory_item_id_transaction_type_index` (`inventory_item_id`,`transaction_type`),
  ADD KEY `inventory_transactions_transaction_number_index` (`transaction_number`),
  ADD KEY `reference_id` (`reference_type`);

--
-- Indexes for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `journal_entries_journal_number_unique` (`journal_number`),
  ADD KEY `journal_entries_posted_by_foreign` (`posted_by`),
  ADD KEY `journal_entries_created_by_foreign` (`created_by`),
  ADD KEY `journal_entries_updated_by_foreign` (`updated_by`),
  ADD KEY `journal_entries_journal_date_index` (`journal_date`),
  ADD KEY `journal_entries_financial_year_id_index` (`financial_year_id`),
  ADD KEY `journal_entries_reference_type_reference_id_index` (`reference_type`,`reference_id`),
  ADD KEY `journal_entries_posting_status_index` (`posting_status`),
  ADD KEY `journal_entries_entry_type_index` (`entry_type`);

--
-- Indexes for table `journal_entry_lines`
--
ALTER TABLE `journal_entry_lines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `journal_entry_lines_journal_entry_id_index` (`journal_entry_id`),
  ADD KEY `journal_entry_lines_account_id_index` (`account_id`);

--
-- Indexes for table `kitchens`
--
ALTER TABLE `kitchens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kitchens_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `kitchens_kitchen_code_unique` (`kitchen_code`),
  ADD UNIQUE KEY `kitchens_name_unique` (`name`),
  ADD KEY `kitchens_country_id_index` (`country_id`),
  ADD KEY `kitchens_state_id_index` (`state_id`),
  ADD KEY `kitchens_city_id_index` (`city_id`),
  ADD KEY `kitchens_area_id_index` (`area_id`),
  ADD KEY `kitchens_delivery_zone_id_index` (`delivery_zone_id`),
  ADD KEY `kitchens_status_index` (`status`),
  ADD KEY `kitchens_is_default_index` (`is_default`),
  ADD KEY `kitchens_kitchen_type_index` (`kitchen_type`),
  ADD KEY `kitchens_kitchen_code_index` (`kitchen_code`),
  ADD KEY `kitchens_name_index` (`name`),
  ADD KEY `kitchens_is_default_status_index` (`is_default`,`status`),
  ADD KEY `kitchens_created_at_index` (`created_at`);

--
-- Indexes for table `kitchen_capacity`
--
ALTER TABLE `kitchen_capacity`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kitchen_capacity_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `kitchen_capacity_kitchen_id_capacity_date_unique` (`kitchen_id`,`capacity_date`),
  ADD KEY `kitchen_capacity_kitchen_id_index` (`kitchen_id`),
  ADD KEY `kitchen_capacity_capacity_date_index` (`capacity_date`),
  ADD KEY `kitchen_capacity_status_index` (`status`),
  ADD KEY `kitchen_capacity_kitchen_id_status_index` (`kitchen_id`,`status`);

--
-- Indexes for table `kitchen_holidays`
--
ALTER TABLE `kitchen_holidays`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kitchen_holidays_uuid_unique` (`uuid`),
  ADD KEY `kitchen_holidays_kitchen_id_index` (`kitchen_id`),
  ADD KEY `kitchen_holidays_holiday_type_index` (`holiday_type`),
  ADD KEY `kitchen_holidays_status_index` (`status`),
  ADD KEY `kitchen_holidays_start_date_index` (`start_date`),
  ADD KEY `kitchen_holidays_end_date_index` (`end_date`),
  ADD KEY `kitchen_holidays_kitchen_id_start_date_end_date_index` (`kitchen_id`,`start_date`,`end_date`);

--
-- Indexes for table `kitchen_working_days`
--
ALTER TABLE `kitchen_working_days`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kitchen_working_days_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `kitchen_working_days_kitchen_id_day_of_week_unique` (`kitchen_id`,`day_of_week`),
  ADD KEY `kitchen_working_days_kitchen_id_index` (`kitchen_id`),
  ADD KEY `kitchen_working_days_day_of_week_index` (`day_of_week`),
  ADD KEY `kitchen_working_days_is_working_index` (`is_working`);

--
-- Indexes for table `login_histories`
--
ALTER TABLE `login_histories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login_histories_uuid_unique` (`uuid`),
  ADD KEY `login_histories_admin_id_index` (`admin_id`),
  ADD KEY `login_histories_login_at_index` (`login_at`),
  ADD KEY `login_histories_is_successful_index` (`is_successful`);

--
-- Indexes for table `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `meals_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `meals_meal_code_unique` (`meal_code`),
  ADD UNIQUE KEY `meals_name_unique` (`name`),
  ADD UNIQUE KEY `meals_slug_unique` (`slug`),
  ADD UNIQUE KEY `meals_sku_unique` (`sku`),
  ADD KEY `meals_category_id_index` (`category_id`),
  ADD KEY `meals_meal_type_id_index` (`meal_type_id`),
  ADD KEY `meals_kitchen_id_index` (`kitchen_id`),
  ADD KEY `meals_status_index` (`status`),
  ADD KEY `meals_is_featured_index` (`is_featured`),
  ADD KEY `meals_is_recommended_index` (`is_recommended`),
  ADD KEY `meals_is_new_index` (`is_new`),
  ADD KEY `meals_is_bestseller_index` (`is_bestseller`),
  ADD KEY `meals_price_index` (`price`),
  ADD KEY `meals_display_order_index` (`display_order`),
  ADD KEY `meals_availability_type_index` (`availability_type`),
  ADD KEY `meals_barcode_index` (`barcode`),
  ADD KEY `meals_created_at_index` (`created_at`);

--
-- Indexes for table `meal_categories`
--
ALTER TABLE `meal_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `meal_categories_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `meal_categories_category_code_unique` (`category_code`),
  ADD UNIQUE KEY `meal_categories_name_unique` (`name`),
  ADD UNIQUE KEY `meal_categories_slug_unique` (`slug`),
  ADD KEY `meal_categories_status_index` (`status`),
  ADD KEY `meal_categories_is_default_index` (`is_default`),
  ADD KEY `meal_categories_display_order_index` (`display_order`),
  ADD KEY `meal_categories_category_code_index` (`category_code`),
  ADD KEY `meal_categories_name_index` (`name`),
  ADD KEY `meal_categories_created_at_index` (`created_at`);

--
-- Indexes for table `meal_packing_lists`
--
ALTER TABLE `meal_packing_lists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `meal_packing_lists_uuid_unique` (`uuid`),
  ADD KEY `meal_packing_lists_meal_id_foreign` (`meal_id`),
  ADD KEY `meal_packing_lists_production_batch_id_index` (`production_batch_id`),
  ADD KEY `meal_packing_lists_order_id_index` (`order_id`),
  ADD KEY `meal_packing_lists_customer_id_index` (`customer_id`),
  ADD KEY `meal_packing_lists_packing_status_index` (`packing_status`),
  ADD KEY `meal_packing_lists_production_batch_id_packing_status_index` (`production_batch_id`,`packing_status`);

--
-- Indexes for table `meal_types`
--
ALTER TABLE `meal_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `meal_types_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `meal_types_type_code_unique` (`type_code`),
  ADD UNIQUE KEY `meal_types_name_unique` (`name`),
  ADD UNIQUE KEY `meal_types_slug_unique` (`slug`),
  ADD KEY `meal_types_status_index` (`status`),
  ADD KEY `meal_types_is_default_index` (`is_default`),
  ADD KEY `meal_types_display_order_index` (`display_order`),
  ADD KEY `meal_types_type_code_index` (`type_code`),
  ADD KEY `meal_types_name_index` (`name`),
  ADD KEY `meal_types_created_at_index` (`created_at`);

--
-- Indexes for table `menu_templates`
--
ALTER TABLE `menu_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `menu_templates_uuid_unique` (`uuid`),
  ADD KEY `menu_templates_kitchen_id_index` (`kitchen_id`),
  ADD KEY `menu_templates_status_index` (`status`);

--
-- Indexes for table `menu_template_items`
--
ALTER TABLE `menu_template_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `menu_template_items_uuid_unique` (`uuid`),
  ADD KEY `menu_template_items_meal_category_id_foreign` (`meal_category_id`),
  ADD KEY `menu_template_items_meal_id_foreign` (`meal_id`),
  ADD KEY `menu_template_items_meal_type_id_foreign` (`meal_type_id`),
  ADD KEY `menu_template_items_menu_template_id_index` (`menu_template_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_type`,`model_id`),
  ADD KEY `model_has_permissions_model_type_model_id_index` (`model_type`,`model_id`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_type`,`model_id`),
  ADD KEY `model_has_roles_model_type_model_id_index` (`model_type`,`model_id`);

--
-- Indexes for table `monthly_menus`
--
ALTER TABLE `monthly_menus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `monthly_menus_kitchen_id_month_year_unique` (`kitchen_id`,`month`,`year`),
  ADD UNIQUE KEY `monthly_menus_uuid_unique` (`uuid`),
  ADD KEY `monthly_menus_menu_template_id_foreign` (`menu_template_id`),
  ADD KEY `monthly_menus_published_by_foreign` (`published_by`),
  ADD KEY `monthly_menus_approved_by_foreign` (`approved_by`),
  ADD KEY `monthly_menus_created_by_foreign` (`created_by`),
  ADD KEY `monthly_menus_updated_by_foreign` (`updated_by`),
  ADD KEY `monthly_menus_deleted_by_foreign` (`deleted_by`),
  ADD KEY `monthly_menus_kitchen_id_index` (`kitchen_id`),
  ADD KEY `monthly_menus_status_index` (`status`),
  ADD KEY `monthly_menus_month_year_index` (`month`,`year`);

--
-- Indexes for table `monthly_menu_items`
--
ALTER TABLE `monthly_menu_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mmi_menu_date_cat_order_uniq` (`monthly_menu_id`,`menu_date`,`meal_category_id`,`display_order`),
  ADD UNIQUE KEY `monthly_menu_items_uuid_unique` (`uuid`),
  ADD KEY `monthly_menu_items_meal_id_foreign` (`meal_id`),
  ADD KEY `monthly_menu_items_meal_type_id_foreign` (`meal_type_id`),
  ADD KEY `monthly_menu_items_monthly_menu_id_index` (`monthly_menu_id`),
  ADD KEY `monthly_menu_items_menu_date_index` (`menu_date`),
  ADD KEY `monthly_menu_items_meal_category_id_index` (`meal_category_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notifications_notification_number_unique` (`notification_number`),
  ADD KEY `notifications_recipient_type_recipient_id_index` (`recipient_type`,`recipient_id`),
  ADD KEY `notifications_event_name_index` (`event_name`),
  ADD KEY `notifications_delivery_status_index` (`delivery_status`),
  ADD KEY `notifications_channel_index` (`channel`),
  ADD KEY `notifications_priority_index` (`priority`),
  ADD KEY `notifications_scheduled_at_index` (`scheduled_at`),
  ADD KEY `notifications_created_at_index` (`created_at`),
  ADD KEY `notifications_template_id_foreign` (`template_id`),
  ADD KEY `notifications_uuid_index` (`uuid`);

--
-- Indexes for table `notification_logs`
--
ALTER TABLE `notification_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_logs_notification_id_index` (`notification_id`),
  ADD KEY `notification_logs_status_index` (`status`),
  ADD KEY `notification_logs_provider_index` (`provider`),
  ADD KEY `notification_logs_uuid_index` (`uuid`);

--
-- Indexes for table `notification_preferences`
--
ALTER TABLE `notification_preferences`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notification_preferences_customer_id_unique` (`customer_id`),
  ADD KEY `notification_preferences_uuid_index` (`uuid`);

--
-- Indexes for table `notification_templates`
--
ALTER TABLE `notification_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notification_templates_template_code_unique` (`template_code`),
  ADD KEY `notification_templates_notification_type_index` (`notification_type`),
  ADD KEY `notification_templates_channel_index` (`channel`),
  ADD KEY `notification_templates_status_index` (`status`),
  ADD KEY `notification_templates_created_by_foreign` (`created_by`),
  ADD KEY `notification_templates_updated_by_foreign` (`updated_by`),
  ADD KEY `notification_templates_uuid_index` (`uuid`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD KEY `orders_address_id_foreign` (`address_id`),
  ADD KEY `orders_delivery_zone_id_foreign` (`delivery_zone_id`),
  ADD KEY `orders_meal_category_id_foreign` (`meal_category_id`),
  ADD KEY `orders_meal_type_id_foreign` (`meal_type_id`),
  ADD KEY `orders_meal_id_foreign` (`meal_id`),
  ADD KEY `orders_cancelled_by_foreign` (`cancelled_by`),
  ADD KEY `orders_created_by_foreign` (`created_by`),
  ADD KEY `orders_updated_by_foreign` (`updated_by`),
  ADD KEY `orders_deleted_by_foreign` (`deleted_by`),
  ADD KEY `orders_customer_id_index` (`customer_id`),
  ADD KEY `orders_subscription_id_index` (`subscription_id`),
  ADD KEY `orders_kitchen_id_index` (`kitchen_id`),
  ADD KEY `orders_order_date_index` (`order_date`),
  ADD KEY `orders_delivery_date_index` (`delivery_date`),
  ADD KEY `orders_order_status_index` (`order_status`),
  ADD KEY `orders_payment_status_index` (`payment_status`),
  ADD KEY `orders_order_type_index` (`order_type`),
  ADD KEY `orders_customer_id_order_status_index` (`customer_id`,`order_status`),
  ADD KEY `orders_kitchen_id_order_date_index` (`kitchen_id`,`order_date`),
  ADD KEY `orders_order_status_delivery_date_index` (`order_status`,`delivery_date`);

--
-- Indexes for table `order_cancellations`
--
ALTER TABLE `order_cancellations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_cancellations_uuid_unique` (`uuid`),
  ADD KEY `order_cancellations_cancelled_by_foreign` (`cancelled_by`),
  ADD KEY `order_cancellations_order_id_index` (`order_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_items_uuid_unique` (`uuid`),
  ADD KEY `order_items_meal_category_id_foreign` (`meal_category_id`),
  ADD KEY `order_items_meal_type_id_foreign` (`meal_type_id`),
  ADD KEY `order_items_order_id_index` (`order_id`),
  ADD KEY `order_items_meal_id_index` (`meal_id`);

--
-- Indexes for table `order_refunds`
--
ALTER TABLE `order_refunds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_refunds_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `order_refunds_refund_number_unique` (`refund_number`),
  ADD KEY `order_refunds_processed_by_foreign` (`processed_by`),
  ADD KEY `order_refunds_order_id_index` (`order_id`),
  ADD KEY `order_refunds_refund_status_index` (`refund_status`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_status_history_uuid_unique` (`uuid`),
  ADD KEY `order_status_history_changed_by_foreign` (`changed_by`),
  ADD KEY `order_status_history_order_id_index` (`order_id`),
  ADD KEY `order_status_history_to_status_index` (`to_status`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment_refunds`
--
ALTER TABLE `payment_refunds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_refunds_refund_number_unique` (`refund_number`),
  ADD KEY `payment_refunds_payment_transaction_id_index` (`payment_transaction_id`),
  ADD KEY `payment_refunds_customer_id_index` (`customer_id`),
  ADD KEY `payment_refunds_status_index` (`status`),
  ADD KEY `payment_refunds_processed_by_foreign` (`processed_by`);

--
-- Indexes for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_transactions_transaction_number_unique` (`transaction_number`),
  ADD KEY `payment_transactions_customer_id_index` (`customer_id`),
  ADD KEY `payment_transactions_order_id_index` (`order_id`),
  ADD KEY `payment_transactions_subscription_id_index` (`subscription_id`),
  ADD KEY `payment_transactions_gateway_name_index` (`gateway_name`),
  ADD KEY `payment_transactions_status_index` (`status`),
  ADD KEY `payment_transactions_payment_type_index` (`payment_type`),
  ADD KEY `payment_transactions_created_at_index` (`created_at`);

--
-- Indexes for table `payment_webhook_logs`
--
ALTER TABLE `payment_webhook_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_webhook_logs_gateway_name_index` (`gateway_name`),
  ADD KEY `payment_webhook_logs_event_name_index` (`event_name`),
  ADD KEY `payment_webhook_logs_verification_status_index` (`verification_status`),
  ADD KEY `payment_webhook_logs_created_at_index` (`created_at`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_unique` (`name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `pincodes`
--
ALTER TABLE `pincodes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pincodes_pincode_unique` (`pincode`),
  ADD UNIQUE KEY `pincodes_uuid_unique` (`uuid`),
  ADD KEY `pincodes_area_id_foreign` (`area_id`),
  ADD KEY `pincodes_pincode_index` (`pincode`),
  ADD KEY `pincodes_status_index` (`status`),
  ADD KEY `pincodes_is_serviceable_index` (`is_serviceable`),
  ADD KEY `pincodes_delivery_zone_id_index` (`delivery_zone_id`),
  ADD KEY `pincodes_country_id_index` (`country_id`),
  ADD KEY `pincodes_state_id_index` (`state_id`),
  ADD KEY `pincodes_city_id_index` (`city_id`),
  ADD KEY `pincodes_district_index` (`district`);

--
-- Indexes for table `pincode_requests`
--
ALTER TABLE `pincode_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pincode_requests_customer_id_foreign` (`customer_id`),
  ADD KEY `pincode_requests_pincode_index` (`pincode`),
  ADD KEY `pincode_requests_status_index` (`status`);

--
-- Indexes for table `production_batches`
--
ALTER TABLE `production_batches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `production_batches_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `production_batches_batch_number_unique` (`batch_number`),
  ADD KEY `production_batches_production_date_index` (`production_date`),
  ADD KEY `production_batches_production_status_index` (`production_status`),
  ADD KEY `production_batches_kitchen_id_production_date_index` (`kitchen_id`,`production_date`),
  ADD KEY `production_batches_production_status_production_date_index` (`production_status`,`production_date`);

--
-- Indexes for table `production_batch_items`
--
ALTER TABLE `production_batch_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `production_batch_items_uuid_unique` (`uuid`),
  ADD KEY `production_batch_items_meal_category_id_foreign` (`meal_category_id`),
  ADD KEY `production_batch_items_meal_type_id_foreign` (`meal_type_id`),
  ADD KEY `production_batch_items_production_batch_id_index` (`production_batch_id`),
  ADD KEY `production_batch_items_meal_id_index` (`meal_id`),
  ADD KEY `production_batch_items_status_index` (`status`),
  ADD KEY `production_batch_items_production_batch_id_meal_id_index` (`production_batch_id`,`meal_id`);

--
-- Indexes for table `production_schedules`
--
ALTER TABLE `production_schedules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `production_schedules_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `production_schedules_kitchen_id_production_date_meal_type_unique` (`kitchen_id`,`production_date`,`meal_type`),
  ADD KEY `production_schedules_kitchen_id_index` (`kitchen_id`),
  ADD KEY `production_schedules_production_date_index` (`production_date`),
  ADD KEY `production_schedules_meal_type_index` (`meal_type`),
  ADD KEY `production_schedules_status_index` (`status`),
  ADD KEY `production_schedules_kitchen_id_status_index` (`kitchen_id`,`status`);

--
-- Indexes for table `production_status_history`
--
ALTER TABLE `production_status_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `production_status_history_uuid_unique` (`uuid`),
  ADD KEY `production_status_history_production_batch_id_index` (`production_batch_id`),
  ADD KEY `production_status_history_to_status_index` (`to_status`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_orders_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `purchase_orders_po_number_unique` (`po_number`),
  ADD KEY `purchase_orders_purchase_request_id_foreign` (`purchase_request_id`),
  ADD KEY `purchase_orders_approved_by_foreign` (`approved_by`),
  ADD KEY `purchase_orders_created_by_foreign` (`created_by`),
  ADD KEY `purchase_orders_updated_by_foreign` (`updated_by`),
  ADD KEY `purchase_orders_deleted_by_foreign` (`deleted_by`),
  ADD KEY `purchase_orders_order_status_index` (`order_status`),
  ADD KEY `purchase_orders_payment_status_index` (`payment_status`),
  ADD KEY `purchase_orders_supplier_id_index` (`supplier_id`);

--
-- Indexes for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_order_items_uuid_unique` (`uuid`),
  ADD KEY `purchase_order_items_purchase_order_id_foreign` (`purchase_order_id`),
  ADD KEY `purchase_order_items_inventory_item_id_foreign` (`inventory_item_id`),
  ADD KEY `purchase_order_items_unit_id_foreign` (`unit_id`);

--
-- Indexes for table `purchase_requests`
--
ALTER TABLE `purchase_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_requests_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `purchase_requests_request_number_unique` (`request_number`),
  ADD KEY `purchase_requests_approved_by_foreign` (`approved_by`),
  ADD KEY `purchase_requests_created_by_foreign` (`created_by`),
  ADD KEY `purchase_requests_updated_by_foreign` (`updated_by`),
  ADD KEY `purchase_requests_deleted_by_foreign` (`deleted_by`),
  ADD KEY `purchase_requests_status_index` (`status`),
  ADD KEY `purchase_requests_priority_index` (`priority`),
  ADD KEY `purchase_requests_request_type_index` (`request_type`);

--
-- Indexes for table `purchase_request_items`
--
ALTER TABLE `purchase_request_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_request_items_uuid_unique` (`uuid`),
  ADD KEY `purchase_request_items_purchase_request_id_foreign` (`purchase_request_id`),
  ADD KEY `purchase_request_items_inventory_item_id_foreign` (`inventory_item_id`),
  ADD KEY `purchase_request_items_unit_id_foreign` (`unit_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `recipes_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `recipes_recipe_code_unique` (`recipe_code`),
  ADD KEY `recipes_status_index` (`status`),
  ADD KEY `recipes_meal_id_index` (`meal_id`);

--
-- Indexes for table `recipe_items`
--
ALTER TABLE `recipe_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `recipe_items_uuid_unique` (`uuid`),
  ADD KEY `recipe_items_inventory_item_id_foreign` (`inventory_item_id`),
  ADD KEY `recipe_items_unit_id_foreign` (`unit_id`),
  ADD KEY `recipe_items_recipe_id_index` (`recipe_id`);

--
-- Indexes for table `recipe_versions`
--
ALTER TABLE `recipe_versions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `recipe_versions_uuid_unique` (`uuid`),
  ADD KEY `recipe_versions_recipe_id_index` (`recipe_id`);

--
-- Indexes for table `report_exports`
--
ALTER TABLE `report_exports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_exports_export_format_index` (`export_format`),
  ADD KEY `report_exports_generated_by_index` (`generated_by`),
  ADD KEY `report_exports_generated_at_index` (`generated_at`),
  ADD KEY `report_exports_export_format_generated_by_index` (`export_format`,`generated_by`),
  ADD KEY `report_exports_uuid_index` (`uuid`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reviews_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `unique_review_per_order_meal` (`customer_id`,`meal_id`,`order_id`),
  ADD KEY `reviews_customer_id_index` (`customer_id`),
  ADD KEY `reviews_meal_id_index` (`meal_id`),
  ADD KEY `reviews_order_id_index` (`order_id`),
  ADD KEY `reviews_rating_index` (`rating`),
  ADD KEY `reviews_status_index` (`status`),
  ADD KEY `reviews_is_featured_index` (`is_featured`),
  ADD KEY `reviews_created_at_index` (`created_at`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `role_has_permissions_permission_id_foreign` (`permission_id`);

--
-- Indexes for table `saved_reports`
--
ALTER TABLE `saved_reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `saved_reports_report_code_unique` (`report_code`),
  ADD KEY `saved_reports_report_type_index` (`report_type`),
  ADD KEY `saved_reports_created_by_index` (`created_by`),
  ADD KEY `saved_reports_is_public_index` (`is_public`),
  ADD KEY `saved_reports_report_type_created_by_index` (`report_type`,`created_by`),
  ADD KEY `saved_reports_uuid_index` (`uuid`);

--
-- Indexes for table `scheduled_reports`
--
ALTER TABLE `scheduled_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scheduled_reports_report_type_index` (`report_type`),
  ADD KEY `scheduled_reports_frequency_index` (`frequency`),
  ADD KEY `scheduled_reports_status_index` (`status`),
  ADD KEY `scheduled_reports_next_run_index` (`next_run`),
  ADD KEY `scheduled_reports_created_by_index` (`created_by`),
  ADD KEY `scheduled_reports_status_next_run_index` (`status`,`next_run`),
  ADD KEY `scheduled_reports_status_frequency_index` (`status`,`frequency`),
  ADD KEY `scheduled_reports_uuid_index` (`uuid`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `states_country_id_name_unique` (`country_id`,`name`),
  ADD UNIQUE KEY `states_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `states_country_id_state_code_unique` (`country_id`,`state_code`),
  ADD KEY `states_name_index` (`name`),
  ADD KEY `states_status_index` (`status`),
  ADD KEY `states_is_default_index` (`is_default`),
  ADD KEY `states_sort_order_index` (`sort_order`),
  ADD KEY `states_state_code_index` (`state_code`);

--
-- Indexes for table `stock_audits`
--
ALTER TABLE `stock_audits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stock_audits_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `stock_audits_audit_number_unique` (`audit_number`),
  ADD KEY `stock_audits_inventory_item_id_status_index` (`inventory_item_id`,`status`),
  ADD KEY `stock_audits_audit_number_index` (`audit_number`);

--
-- Indexes for table `subscription_pause_history`
--
ALTER TABLE `subscription_pause_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_pause_history_uuid_unique` (`uuid`),
  ADD KEY `subscription_pause_history_approved_by_foreign` (`approved_by`),
  ADD KEY `subscription_pause_history_customer_subscription_id_index` (`customer_subscription_id`);

--
-- Indexes for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_plans_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `subscription_plans_plan_code_unique` (`plan_code`),
  ADD UNIQUE KEY `subscription_plans_slug_unique` (`slug`),
  ADD KEY `subscription_plans_created_by_foreign` (`created_by`),
  ADD KEY `subscription_plans_updated_by_foreign` (`updated_by`),
  ADD KEY `subscription_plans_deleted_by_foreign` (`deleted_by`),
  ADD KEY `subscription_plans_plan_type_index` (`plan_type`),
  ADD KEY `subscription_plans_billing_cycle_index` (`billing_cycle`),
  ADD KEY `subscription_plans_status_index` (`status`),
  ADD KEY `subscription_plans_is_popular_index` (`is_popular`),
  ADD KEY `subscription_plans_is_recommended_index` (`is_recommended`),
  ADD KEY `subscription_plans_meal_category_id_index` (`meal_category_id`),
  ADD KEY `subscription_plans_kitchen_id_index` (`kitchen_id`),
  ADD KEY `subscription_plans_display_order_index` (`display_order`);

--
-- Indexes for table `subscription_plan_meals`
--
ALTER TABLE `subscription_plan_meals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_plan_meals_uuid_unique` (`uuid`),
  ADD KEY `subscription_plan_meals_meal_type_id_foreign` (`meal_type_id`),
  ADD KEY `subscription_plan_meals_subscription_plan_id_index` (`subscription_plan_id`),
  ADD KEY `subscription_plan_meals_meal_category_id_index` (`meal_category_id`),
  ADD KEY `subscription_plan_meals_meal_id_index` (`meal_id`);

--
-- Indexes for table `subscription_renew_history`
--
ALTER TABLE `subscription_renew_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_renew_history_uuid_unique` (`uuid`),
  ADD KEY `subscription_renew_history_from_plan_id_foreign` (`from_plan_id`),
  ADD KEY `subscription_renew_history_to_plan_id_foreign` (`to_plan_id`),
  ADD KEY `subscription_renew_history_customer_subscription_id_index` (`customer_subscription_id`);

--
-- Indexes for table `subscription_skip_history`
--
ALTER TABLE `subscription_skip_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_skip_history_uuid_unique` (`uuid`),
  ADD KEY `subscription_skip_history_meal_id_foreign` (`meal_id`),
  ADD KEY `subscription_skip_history_customer_subscription_id_index` (`customer_subscription_id`),
  ADD KEY `subscription_skip_history_skip_date_index` (`skip_date`);

--
-- Indexes for table `subscription_status_history`
--
ALTER TABLE `subscription_status_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_status_history_uuid_unique` (`uuid`),
  ADD KEY `subscription_status_history_changed_by_foreign` (`changed_by`),
  ADD KEY `subscription_status_history_customer_subscription_id_index` (`customer_subscription_id`),
  ADD KEY `subscription_status_history_to_status_index` (`to_status`);

--
-- Indexes for table `subscription_upgrade_history`
--
ALTER TABLE `subscription_upgrade_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_upgrade_history_uuid_unique` (`uuid`),
  ADD KEY `subscription_upgrade_history_from_plan_id_foreign` (`from_plan_id`),
  ADD KEY `subscription_upgrade_history_to_plan_id_foreign` (`to_plan_id`),
  ADD KEY `subscription_upgrade_history_approved_by_foreign` (`approved_by`),
  ADD KEY `subscription_upgrade_history_customer_subscription_id_index` (`customer_subscription_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `suppliers_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `suppliers_supplier_code_unique` (`supplier_code`),
  ADD KEY `suppliers_country_id_foreign` (`country_id`),
  ADD KEY `suppliers_created_by_foreign` (`created_by`),
  ADD KEY `suppliers_updated_by_foreign` (`updated_by`),
  ADD KEY `suppliers_deleted_by_foreign` (`deleted_by`),
  ADD KEY `suppliers_status_index` (`status`),
  ADD KEY `suppliers_state_id_foreign` (`state_id`),
  ADD KEY `suppliers_city_id_foreign` (`city_id`),
  ADD KEY `suppliers_supplier_type_index` (`supplier_type`),
  ADD KEY `suppliers_is_preferred_index` (`is_preferred`);

--
-- Indexes for table `supplier_contacts`
--
ALTER TABLE `supplier_contacts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `supplier_contacts_uuid_unique` (`uuid`),
  ADD KEY `supplier_contacts_supplier_id_index` (`supplier_id`),
  ADD KEY `supplier_contacts_is_primary_index` (`is_primary`);

--
-- Indexes for table `supplier_documents`
--
ALTER TABLE `supplier_documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `supplier_documents_uuid_unique` (`uuid`),
  ADD KEY `supplier_documents_supplier_id_index` (`supplier_id`),
  ADD KEY `supplier_documents_document_type_index` (`document_type`),
  ADD KEY `supplier_documents_expiry_date_index` (`expiry_date`);

--
-- Indexes for table `supplier_ledger`
--
ALTER TABLE `supplier_ledger`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_ledger_supplier_id_index` (`supplier_id`),
  ADD KEY `supplier_ledger_journal_entry_id_index` (`journal_entry_id`),
  ADD KEY `supplier_ledger_transaction_date_index` (`transaction_date`);

--
-- Indexes for table `supplier_price_history`
--
ALTER TABLE `supplier_price_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `supplier_price_history_uuid_unique` (`uuid`),
  ADD KEY `supplier_price_history_supplier_id_index` (`supplier_id`),
  ADD KEY `supplier_price_history_inventory_item_id_index` (`inventory_item_id`),
  ADD KEY `supplier_price_history_effective_from_index` (`effective_from`);

--
-- Indexes for table `supplier_products`
--
ALTER TABLE `supplier_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `supplier_products_uuid_unique` (`uuid`),
  ADD KEY `supplier_products_supplier_id_index` (`supplier_id`),
  ADD KEY `supplier_products_inventory_item_id_index` (`inventory_item_id`),
  ADD KEY `supplier_products_is_primary_supplier_index` (`is_primary_supplier`);

--
-- Indexes for table `system_backups`
--
ALTER TABLE `system_backups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `system_backups_uuid_unique` (`uuid`),
  ADD KEY `system_backups_backup_type_index` (`backup_type`),
  ADD KEY `system_backups_status_index` (`status`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `system_settings_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `system_settings_setting_key_unique` (`setting_key`),
  ADD KEY `system_settings_setting_group_index` (`setting_group`),
  ADD KEY `system_settings_autoload_index` (`autoload`),
  ADD KEY `system_settings_status_index` (`status`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `units_uuid_unique` (`uuid`),
  ADD KEY `units_base_unit_id_foreign` (`base_unit_id`),
  ADD KEY `units_status_index` (`status`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallets_wallet_number_unique` (`wallet_number`),
  ADD KEY `wallets_customer_id_index` (`customer_id`),
  ADD KEY `wallets_status_index` (`status`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallet_transactions_transaction_number_unique` (`transaction_number`),
  ADD KEY `wallet_transactions_wallet_id_index` (`wallet_id`),
  ADD KEY `wallet_transactions_transaction_type_index` (`transaction_type`),
  ADD KEY `wallet_transactions_reference_type_reference_id_index` (`reference_type`,`reference_id`),
  ADD KEY `wallet_transactions_created_by_foreign` (`created_by`);

--
-- Indexes for table `weekly_menus`
--
ALTER TABLE `weekly_menus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `weekly_menus_kitchen_id_week_start_date_week_end_date_unique` (`kitchen_id`,`week_start_date`,`week_end_date`),
  ADD UNIQUE KEY `weekly_menus_uuid_unique` (`uuid`),
  ADD KEY `weekly_menus_published_by_foreign` (`published_by`),
  ADD KEY `weekly_menus_created_by_foreign` (`created_by`),
  ADD KEY `weekly_menus_updated_by_foreign` (`updated_by`),
  ADD KEY `weekly_menus_deleted_by_foreign` (`deleted_by`),
  ADD KEY `weekly_menus_kitchen_id_index` (`kitchen_id`),
  ADD KEY `weekly_menus_status_index` (`status`),
  ADD KEY `weekly_menus_week_start_date_index` (`week_start_date`),
  ADD KEY `weekly_menus_week_end_date_index` (`week_end_date`);

--
-- Indexes for table `weekly_menu_items`
--
ALTER TABLE `weekly_menu_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wmi_menu_date_cat_order_uniq` (`weekly_menu_id`,`menu_date`,`meal_category_id`,`display_order`),
  ADD UNIQUE KEY `weekly_menu_items_uuid_unique` (`uuid`),
  ADD KEY `weekly_menu_items_meal_id_foreign` (`meal_id`),
  ADD KEY `weekly_menu_items_meal_type_id_foreign` (`meal_type_id`),
  ADD KEY `weekly_menu_items_weekly_menu_id_index` (`weekly_menu_id`),
  ADD KEY `weekly_menu_items_menu_date_index` (`menu_date`),
  ADD KEY `weekly_menu_items_meal_category_id_index` (`meal_category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `app_versions`
--
ALTER TABLE `app_versions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `areas`
--
ALTER TABLE `areas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bank_book`
--
ALTER TABLE `bank_book`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bank_reconciliations`
--
ALTER TABLE `bank_reconciliations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cash_book`
--
ALTER TABLE `cash_book`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chart_of_accounts`
--
ALTER TABLE `chart_of_accounts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cms_pages`
--
ALTER TABLE `cms_pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customer_ledger`
--
ALTER TABLE `customer_ledger`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_meal_selections`
--
ALTER TABLE `customer_meal_selections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_subscriptions`
--
ALTER TABLE `customer_subscriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `delivery_slots`
--
ALTER TABLE `delivery_slots`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_zones`
--
ALTER TABLE `delivery_zones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense_approvals`
--
ALTER TABLE `expense_approvals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense_attachments`
--
ALTER TABLE `expense_attachments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_login_attempts`
--
ALTER TABLE `failed_login_attempts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `financial_years`
--
ALTER TABLE `financial_years`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `goods_receipts`
--
ALTER TABLE `goods_receipts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `goods_receipt_items`
--
ALTER TABLE `goods_receipt_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gst_transactions`
--
ALTER TABLE `gst_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_adjustments`
--
ALTER TABLE `inventory_adjustments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_batches`
--
ALTER TABLE `inventory_batches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_consumption_logs`
--
ALTER TABLE `inventory_consumption_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_items`
--
ALTER TABLE `inventory_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `journal_entry_lines`
--
ALTER TABLE `journal_entry_lines`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kitchens`
--
ALTER TABLE `kitchens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kitchen_capacity`
--
ALTER TABLE `kitchen_capacity`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kitchen_holidays`
--
ALTER TABLE `kitchen_holidays`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kitchen_working_days`
--
ALTER TABLE `kitchen_working_days`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `login_histories`
--
ALTER TABLE `login_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `meal_categories`
--
ALTER TABLE `meal_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `meal_packing_lists`
--
ALTER TABLE `meal_packing_lists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meal_types`
--
ALTER TABLE `meal_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `menu_templates`
--
ALTER TABLE `menu_templates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menu_template_items`
--
ALTER TABLE `menu_template_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `monthly_menus`
--
ALTER TABLE `monthly_menus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `monthly_menu_items`
--
ALTER TABLE `monthly_menu_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_logs`
--
ALTER TABLE `notification_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_preferences`
--
ALTER TABLE `notification_preferences`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_templates`
--
ALTER TABLE `notification_templates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_cancellations`
--
ALTER TABLE `order_cancellations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_refunds`
--
ALTER TABLE `order_refunds`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `payment_refunds`
--
ALTER TABLE `payment_refunds`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_webhook_logs`
--
ALTER TABLE `payment_webhook_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pincodes`
--
ALTER TABLE `pincodes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pincode_requests`
--
ALTER TABLE `pincode_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `production_batches`
--
ALTER TABLE `production_batches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `production_batch_items`
--
ALTER TABLE `production_batch_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `production_schedules`
--
ALTER TABLE `production_schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `production_status_history`
--
ALTER TABLE `production_status_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_requests`
--
ALTER TABLE `purchase_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_request_items`
--
ALTER TABLE `purchase_request_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recipe_items`
--
ALTER TABLE `recipe_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recipe_versions`
--
ALTER TABLE `recipe_versions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `report_exports`
--
ALTER TABLE `report_exports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `saved_reports`
--
ALTER TABLE `saved_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scheduled_reports`
--
ALTER TABLE `scheduled_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stock_audits`
--
ALTER TABLE `stock_audits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_pause_history`
--
ALTER TABLE `subscription_pause_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subscription_plan_meals`
--
ALTER TABLE `subscription_plan_meals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_renew_history`
--
ALTER TABLE `subscription_renew_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_skip_history`
--
ALTER TABLE `subscription_skip_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_status_history`
--
ALTER TABLE `subscription_status_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subscription_upgrade_history`
--
ALTER TABLE `subscription_upgrade_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_contacts`
--
ALTER TABLE `supplier_contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_documents`
--
ALTER TABLE `supplier_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_ledger`
--
ALTER TABLE `supplier_ledger`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_price_history`
--
ALTER TABLE `supplier_price_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_products`
--
ALTER TABLE `supplier_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_backups`
--
ALTER TABLE `system_backups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `weekly_menus`
--
ALTER TABLE `weekly_menus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `weekly_menu_items`
--
ALTER TABLE `weekly_menu_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `admins_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `admins_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD CONSTRAINT `admin_sessions_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `areas`
--
ALTER TABLE `areas`
  ADD CONSTRAINT `areas_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `areas_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `areas_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD CONSTRAINT `bank_accounts_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `chart_of_accounts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bank_accounts_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bank_accounts_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bank_accounts_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `bank_book`
--
ALTER TABLE `bank_book`
  ADD CONSTRAINT `bank_book_bank_account_id_foreign` FOREIGN KEY (`bank_account_id`) REFERENCES `bank_accounts` (`id`),
  ADD CONSTRAINT `bank_book_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bank_book_journal_entry_id_foreign` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `bank_reconciliations`
--
ALTER TABLE `bank_reconciliations`
  ADD CONSTRAINT `bank_reconciliations_bank_account_id_foreign` FOREIGN KEY (`bank_account_id`) REFERENCES `bank_accounts` (`id`),
  ADD CONSTRAINT `bank_reconciliations_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bank_reconciliations_reconciled_by_foreign` FOREIGN KEY (`reconciled_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bank_reconciliations_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cash_book`
--
ALTER TABLE `cash_book`
  ADD CONSTRAINT `cash_book_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `cash_book_journal_entry_id_foreign` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `chart_of_accounts`
--
ALTER TABLE `chart_of_accounts`
  ADD CONSTRAINT `chart_of_accounts_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chart_of_accounts_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chart_of_accounts_parent_account_id_foreign` FOREIGN KEY (`parent_account_id`) REFERENCES `chart_of_accounts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chart_of_accounts_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `cities_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cities_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_area_id_foreign` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customers_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customers_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customers_referred_by_foreign` FOREIGN KEY (`referred_by`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customers_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  ADD CONSTRAINT `customer_addresses_area_id_foreign` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_addresses_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_addresses_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_addresses_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_addresses_delivery_zone_id_foreign` FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_addresses_pincode_id_foreign` FOREIGN KEY (`pincode_id`) REFERENCES `pincodes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_addresses_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_ledger`
--
ALTER TABLE `customer_ledger`
  ADD CONSTRAINT `customer_ledger_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_ledger_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `customer_ledger_journal_entry_id_foreign` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_meal_selections`
--
ALTER TABLE `customer_meal_selections`
  ADD CONSTRAINT `customer_meal_selections_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_meal_selections_meal_category_id_foreign` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_meal_selections_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_meal_selections_weekly_menu_id_foreign` FOREIGN KEY (`weekly_menu_id`) REFERENCES `weekly_menus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_meal_selections_weekly_menu_item_id_foreign` FOREIGN KEY (`weekly_menu_item_id`) REFERENCES `weekly_menu_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_subscriptions`
--
ALTER TABLE `customer_subscriptions`
  ADD CONSTRAINT `customer_subscriptions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_subscriptions_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_subscriptions_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_subscriptions_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_subscriptions_meal_category_id_foreign` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_subscriptions_subscription_plan_id_foreign` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_subscriptions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `delivery_slots`
--
ALTER TABLE `delivery_slots`
  ADD CONSTRAINT `delivery_slots_delivery_zone_id_foreign` FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `delivery_zones`
--
ALTER TABLE `delivery_zones`
  ADD CONSTRAINT `delivery_zones_area_id_foreign` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `delivery_zones_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `delivery_zones_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `delivery_zones_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_expense_category_id_foreign` FOREIGN KEY (`expense_category_id`) REFERENCES `expense_categories` (`id`),
  ADD CONSTRAINT `expenses_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `expense_approvals`
--
ALTER TABLE `expense_approvals`
  ADD CONSTRAINT `expense_approvals_expense_id_foreign` FOREIGN KEY (`expense_id`) REFERENCES `expenses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expense_attachments`
--
ALTER TABLE `expense_attachments`
  ADD CONSTRAINT `expense_attachments_expense_id_foreign` FOREIGN KEY (`expense_id`) REFERENCES `expenses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD CONSTRAINT `expense_categories_parent_category_id_foreign` FOREIGN KEY (`parent_category_id`) REFERENCES `expense_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `financial_years`
--
ALTER TABLE `financial_years`
  ADD CONSTRAINT `financial_years_closed_by_foreign` FOREIGN KEY (`closed_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_years_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_years_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_years_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `goods_receipts`
--
ALTER TABLE `goods_receipts`
  ADD CONSTRAINT `goods_receipts_purchase_order_id_foreign` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `goods_receipts_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `goods_receipt_items`
--
ALTER TABLE `goods_receipt_items`
  ADD CONSTRAINT `goods_receipt_items_goods_receipt_id_foreign` FOREIGN KEY (`goods_receipt_id`) REFERENCES `goods_receipts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `goods_receipt_items_inventory_item_id_foreign` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `gst_transactions`
--
ALTER TABLE `gst_transactions`
  ADD CONSTRAINT `gst_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `gst_transactions_journal_entry_id_foreign` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `inventory_adjustments`
--
ALTER TABLE `inventory_adjustments`
  ADD CONSTRAINT `inventory_adjustments_inventory_item_id_foreign` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory_batches`
--
ALTER TABLE `inventory_batches`
  ADD CONSTRAINT `inventory_batches_inventory_item_id_foreign` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory_consumption_logs`
--
ALTER TABLE `inventory_consumption_logs`
  ADD CONSTRAINT `inventory_consumption_logs_inventory_item_id_foreign` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_consumption_logs_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `inventory_consumption_logs_production_batch_id_foreign` FOREIGN KEY (`production_batch_id`) REFERENCES `production_batches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_consumption_logs_recipe_id_foreign` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD CONSTRAINT `inventory_items_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD CONSTRAINT `inventory_transactions_inventory_item_id_foreign` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD CONSTRAINT `journal_entries_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `journal_entries_financial_year_id_foreign` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`),
  ADD CONSTRAINT `journal_entries_posted_by_foreign` FOREIGN KEY (`posted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `journal_entries_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `journal_entry_lines`
--
ALTER TABLE `journal_entry_lines`
  ADD CONSTRAINT `journal_entry_lines_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `chart_of_accounts` (`id`),
  ADD CONSTRAINT `journal_entry_lines_journal_entry_id_foreign` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kitchens`
--
ALTER TABLE `kitchens`
  ADD CONSTRAINT `kitchens_area_id_foreign` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `kitchens_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `kitchens_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `kitchens_delivery_zone_id_foreign` FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `kitchens_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `kitchen_capacity`
--
ALTER TABLE `kitchen_capacity`
  ADD CONSTRAINT `kitchen_capacity_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `kitchen_holidays`
--
ALTER TABLE `kitchen_holidays`
  ADD CONSTRAINT `kitchen_holidays_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `kitchen_working_days`
--
ALTER TABLE `kitchen_working_days`
  ADD CONSTRAINT `kitchen_working_days_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `login_histories`
--
ALTER TABLE `login_histories`
  ADD CONSTRAINT `login_histories_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meals`
--
ALTER TABLE `meals`
  ADD CONSTRAINT `meals_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `meal_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meals_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meals_meal_type_id_foreign` FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meal_packing_lists`
--
ALTER TABLE `meal_packing_lists`
  ADD CONSTRAINT `meal_packing_lists_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meal_packing_lists_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meal_packing_lists_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meal_packing_lists_production_batch_id_foreign` FOREIGN KEY (`production_batch_id`) REFERENCES `production_batches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_templates`
--
ALTER TABLE `menu_templates`
  ADD CONSTRAINT `menu_templates_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_template_items`
--
ALTER TABLE `menu_template_items`
  ADD CONSTRAINT `menu_template_items_meal_category_id_foreign` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `menu_template_items_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `menu_template_items_meal_type_id_foreign` FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `menu_template_items_menu_template_id_foreign` FOREIGN KEY (`menu_template_id`) REFERENCES `menu_templates` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `monthly_menus`
--
ALTER TABLE `monthly_menus`
  ADD CONSTRAINT `monthly_menus_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `monthly_menus_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `monthly_menus_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `monthly_menus_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `monthly_menus_menu_template_id_foreign` FOREIGN KEY (`menu_template_id`) REFERENCES `menu_templates` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `monthly_menus_published_by_foreign` FOREIGN KEY (`published_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `monthly_menus_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `monthly_menu_items`
--
ALTER TABLE `monthly_menu_items`
  ADD CONSTRAINT `monthly_menu_items_meal_category_id_foreign` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `monthly_menu_items_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `monthly_menu_items_meal_type_id_foreign` FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `monthly_menu_items_monthly_menu_id_foreign` FOREIGN KEY (`monthly_menu_id`) REFERENCES `monthly_menus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_template_id_foreign` FOREIGN KEY (`template_id`) REFERENCES `notification_templates` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `notification_logs`
--
ALTER TABLE `notification_logs`
  ADD CONSTRAINT `notification_logs_notification_id_foreign` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification_preferences`
--
ALTER TABLE `notification_preferences`
  ADD CONSTRAINT `notification_preferences_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification_templates`
--
ALTER TABLE `notification_templates`
  ADD CONSTRAINT `notification_templates_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `notification_templates_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_address_id_foreign` FOREIGN KEY (`address_id`) REFERENCES `customer_addresses` (`id`),
  ADD CONSTRAINT `orders_cancelled_by_foreign` FOREIGN KEY (`cancelled_by`) REFERENCES `admins` (`id`),
  ADD CONSTRAINT `orders_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`),
  ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `orders_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`),
  ADD CONSTRAINT `orders_delivery_zone_id_foreign` FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones` (`id`),
  ADD CONSTRAINT `orders_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`),
  ADD CONSTRAINT `orders_meal_category_id_foreign` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_categories` (`id`),
  ADD CONSTRAINT `orders_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`),
  ADD CONSTRAINT `orders_meal_type_id_foreign` FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types` (`id`),
  ADD CONSTRAINT `orders_subscription_id_foreign` FOREIGN KEY (`subscription_id`) REFERENCES `customer_subscriptions` (`id`),
  ADD CONSTRAINT `orders_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`);

--
-- Constraints for table `order_cancellations`
--
ALTER TABLE `order_cancellations`
  ADD CONSTRAINT `order_cancellations_cancelled_by_foreign` FOREIGN KEY (`cancelled_by`) REFERENCES `admins` (`id`),
  ADD CONSTRAINT `order_cancellations_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_meal_category_id_foreign` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_categories` (`id`),
  ADD CONSTRAINT `order_items_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`),
  ADD CONSTRAINT `order_items_meal_type_id_foreign` FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types` (`id`),
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `order_refunds`
--
ALTER TABLE `order_refunds`
  ADD CONSTRAINT `order_refunds_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_refunds_processed_by_foreign` FOREIGN KEY (`processed_by`) REFERENCES `admins` (`id`);

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `order_status_history_changed_by_foreign` FOREIGN KEY (`changed_by`) REFERENCES `admins` (`id`),
  ADD CONSTRAINT `order_status_history_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `payment_refunds`
--
ALTER TABLE `payment_refunds`
  ADD CONSTRAINT `payment_refunds_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `payment_refunds_payment_transaction_id_foreign` FOREIGN KEY (`payment_transaction_id`) REFERENCES `payment_transactions` (`id`),
  ADD CONSTRAINT `payment_refunds_processed_by_foreign` FOREIGN KEY (`processed_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `payment_transactions_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `payment_transactions_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payment_transactions_subscription_id_foreign` FOREIGN KEY (`subscription_id`) REFERENCES `customer_subscriptions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `pincodes`
--
ALTER TABLE `pincodes`
  ADD CONSTRAINT `pincodes_area_id_foreign` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pincodes_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pincodes_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pincodes_delivery_zone_id_foreign` FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pincodes_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pincode_requests`
--
ALTER TABLE `pincode_requests`
  ADD CONSTRAINT `pincode_requests_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `production_batches`
--
ALTER TABLE `production_batches`
  ADD CONSTRAINT `production_batches_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `production_batch_items`
--
ALTER TABLE `production_batch_items`
  ADD CONSTRAINT `production_batch_items_meal_category_id_foreign` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `production_batch_items_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `production_batch_items_meal_type_id_foreign` FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `production_batch_items_production_batch_id_foreign` FOREIGN KEY (`production_batch_id`) REFERENCES `production_batches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `production_schedules`
--
ALTER TABLE `production_schedules`
  ADD CONSTRAINT `production_schedules_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `production_status_history`
--
ALTER TABLE `production_status_history`
  ADD CONSTRAINT `production_status_history_production_batch_id_foreign` FOREIGN KEY (`production_batch_id`) REFERENCES `production_batches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_orders_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_orders_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_orders_purchase_request_id_foreign` FOREIGN KEY (`purchase_request_id`) REFERENCES `purchase_requests` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_orders_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_orders_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_inventory_item_id_foreign` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_order_items_purchase_order_id_foreign` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_order_items_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_requests`
--
ALTER TABLE `purchase_requests`
  ADD CONSTRAINT `purchase_requests_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_requests_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_requests_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_requests_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `purchase_request_items`
--
ALTER TABLE `purchase_request_items`
  ADD CONSTRAINT `purchase_request_items_inventory_item_id_foreign` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_request_items_purchase_request_id_foreign` FOREIGN KEY (`purchase_request_id`) REFERENCES `purchase_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_request_items_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipe_items`
--
ALTER TABLE `recipe_items`
  ADD CONSTRAINT `recipe_items_inventory_item_id_foreign` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipe_items_recipe_id_foreign` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipe_items_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipe_versions`
--
ALTER TABLE `recipe_versions`
  ADD CONSTRAINT `recipe_versions_recipe_id_foreign` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `states`
--
ALTER TABLE `states`
  ADD CONSTRAINT `states_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_audits`
--
ALTER TABLE `stock_audits`
  ADD CONSTRAINT `stock_audits_inventory_item_id_foreign` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscription_pause_history`
--
ALTER TABLE `subscription_pause_history`
  ADD CONSTRAINT `subscription_pause_history_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `subscription_pause_history_customer_subscription_id_foreign` FOREIGN KEY (`customer_subscription_id`) REFERENCES `customer_subscriptions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD CONSTRAINT `subscription_plans_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `subscription_plans_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `subscription_plans_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscription_plans_meal_category_id_foreign` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscription_plans_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `subscription_plan_meals`
--
ALTER TABLE `subscription_plan_meals`
  ADD CONSTRAINT `subscription_plan_meals_meal_category_id_foreign` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscription_plan_meals_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscription_plan_meals_meal_type_id_foreign` FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `subscription_plan_meals_subscription_plan_id_foreign` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscription_renew_history`
--
ALTER TABLE `subscription_renew_history`
  ADD CONSTRAINT `subscription_renew_history_customer_subscription_id_foreign` FOREIGN KEY (`customer_subscription_id`) REFERENCES `customer_subscriptions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscription_renew_history_from_plan_id_foreign` FOREIGN KEY (`from_plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscription_renew_history_to_plan_id_foreign` FOREIGN KEY (`to_plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscription_skip_history`
--
ALTER TABLE `subscription_skip_history`
  ADD CONSTRAINT `subscription_skip_history_customer_subscription_id_foreign` FOREIGN KEY (`customer_subscription_id`) REFERENCES `customer_subscriptions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscription_skip_history_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `subscription_status_history`
--
ALTER TABLE `subscription_status_history`
  ADD CONSTRAINT `subscription_status_history_changed_by_foreign` FOREIGN KEY (`changed_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `subscription_status_history_customer_subscription_id_foreign` FOREIGN KEY (`customer_subscription_id`) REFERENCES `customer_subscriptions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscription_upgrade_history`
--
ALTER TABLE `subscription_upgrade_history`
  ADD CONSTRAINT `subscription_upgrade_history_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `subscription_upgrade_history_customer_subscription_id_foreign` FOREIGN KEY (`customer_subscription_id`) REFERENCES `customer_subscriptions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscription_upgrade_history_from_plan_id_foreign` FOREIGN KEY (`from_plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscription_upgrade_history_to_plan_id_foreign` FOREIGN KEY (`to_plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD CONSTRAINT `suppliers_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `suppliers_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `suppliers_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `suppliers_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `suppliers_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `suppliers_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `supplier_contacts`
--
ALTER TABLE `supplier_contacts`
  ADD CONSTRAINT `supplier_contacts_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_documents`
--
ALTER TABLE `supplier_documents`
  ADD CONSTRAINT `supplier_documents_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_ledger`
--
ALTER TABLE `supplier_ledger`
  ADD CONSTRAINT `supplier_ledger_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

--
-- Constraints for table `supplier_price_history`
--
ALTER TABLE `supplier_price_history`
  ADD CONSTRAINT `supplier_price_history_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_products`
--
ALTER TABLE `supplier_products`
  ADD CONSTRAINT `supplier_products_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `units`
--
ALTER TABLE `units`
  ADD CONSTRAINT `units_base_unit_id_foreign` FOREIGN KEY (`base_unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `wallet_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `wallet_transactions_wallet_id_foreign` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `weekly_menus`
--
ALTER TABLE `weekly_menus`
  ADD CONSTRAINT `weekly_menus_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `weekly_menus_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `weekly_menus_kitchen_id_foreign` FOREIGN KEY (`kitchen_id`) REFERENCES `kitchens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `weekly_menus_published_by_foreign` FOREIGN KEY (`published_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `weekly_menus_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `weekly_menu_items`
--
ALTER TABLE `weekly_menu_items`
  ADD CONSTRAINT `weekly_menu_items_meal_category_id_foreign` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `weekly_menu_items_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `weekly_menu_items_meal_type_id_foreign` FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `weekly_menu_items_weekly_menu_id_foreign` FOREIGN KEY (`weekly_menu_id`) REFERENCES `weekly_menus` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

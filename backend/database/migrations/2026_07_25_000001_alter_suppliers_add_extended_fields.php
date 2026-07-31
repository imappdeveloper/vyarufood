<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('supplier_name', 200)->after('supplier_code')->nullable();
            $table->enum('supplier_type', ['raw_material', 'packaging', 'gas', 'cleaning', 'equipment', 'general'])->after('supplier_name')->default('general');
            $table->string('alternate_mobile', 20)->nullable()->after('mobile');
            $table->string('website', 255)->nullable()->after('email');
            $table->string('fssai_license', 50)->nullable()->after('pan_number');
            $table->string('drug_license', 50)->nullable()->after('fssai_license');
            $table->unsignedBigInteger('state_id')->nullable()->after('country_id');
            $table->unsignedBigInteger('city_id')->nullable()->after('state_id');
            $table->decimal('latitude', 10, 7)->nullable()->after('pincode');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->string('bank_name', 150)->nullable()->after('remarks');
            $table->string('account_holder_name', 150)->nullable()->after('bank_name');
            $table->string('account_number', 30)->nullable()->after('account_holder_name');
            $table->string('ifsc_code', 15)->nullable()->after('account_number');
            $table->string('branch_name', 150)->nullable()->after('ifsc_code');
            $table->decimal('credit_days', 5, 0)->default(0)->after('credit_limit');
            $table->decimal('opening_balance', 12, 2)->default(0)->after('credit_days');
            $table->decimal('current_balance', 12, 2)->default(0)->after('opening_balance');
            $table->boolean('is_preferred')->default(false)->after('current_balance');

            $table->foreign('state_id')->references('id')->on('states')->nullOnDelete();
            $table->foreign('city_id')->references('id')->on('cities')->nullOnDelete();
            $table->index('supplier_type');
            $table->index('is_preferred');
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropForeign(['state_id']);
            $table->dropForeign(['city_id']);
            $table->dropColumn([
                'supplier_name', 'supplier_type', 'alternate_mobile', 'website',
                'fssai_license', 'drug_license', 'state_id', 'city_id',
                'latitude', 'longitude', 'bank_name', 'account_holder_name',
                'account_number', 'ifsc_code', 'branch_name', 'credit_days',
                'opening_balance', 'current_balance', 'is_preferred',
            ]);
        });
    }
};

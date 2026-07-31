<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('system_settings', function (Blueprint $table) {
            if (! Schema::hasColumn('system_settings', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('cms_pages', function (Blueprint $table) {
            if (! Schema::hasColumn('cms_pages', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('app_versions', function (Blueprint $table) {
            if (! Schema::hasColumn('app_versions', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    public function down(): void
    {
        Schema::table('system_settings', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('cms_pages', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('app_versions', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};

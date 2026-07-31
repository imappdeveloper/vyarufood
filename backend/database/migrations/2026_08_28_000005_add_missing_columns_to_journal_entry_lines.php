<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('journal_entry_lines', function (Blueprint $table) {
            $table->unsignedSmallInteger('line_number')->default(1)->after('account_id');
            $table->text('description')->nullable()->after('line_number');
            $table->string('cost_center', 50)->nullable()->after('description');
            $table->unsignedBigInteger('project_id')->nullable()->after('cost_center');
        });
    }

    public function down(): void
    {
        Schema::table('journal_entry_lines', function (Blueprint $table) {
            $table->dropColumn(['line_number', 'description', 'cost_center', 'project_id']);
        });
    }
};

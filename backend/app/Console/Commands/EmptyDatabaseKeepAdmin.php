<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EmptyDatabaseKeepAdmin extends Command
{
    protected $signature = 'db:empty-keep-admin';
    protected $description = 'Truncate all tables except admin/auth system so you can start fresh';

    private const KEEP_TABLES = [
        'admins',
        'roles',
        'permissions',
        'model_has_roles',
        'model_has_permissions',
        'role_has_permissions',
        'personal_access_tokens',
        'admin_sessions',
        'password_reset_tokens',
        'failed_login_attempts',
        'login_histories',
        'activity_log',
        'migrations',
    ];

    public function handle(): int
    {
        if (!$this->confirm('This will TRUNCATE all business tables. Admin users will be preserved. Continue?')) {
            return Command::FAILURE;
        }

        $allTables = $this->getAllTables();
        $toTruncate = array_diff($allTables, self::KEEP_TABLES, ['sessions']);

        if (empty($toTruncate)) {
            $this->warn('No tables to truncate.');
            return Command::SUCCESS;
        }

        $this->info('Tables to KEEP: ' . implode(', ', array_intersect($allTables, self::KEEP_TABLES)));
        $this->info('Tables to TRUNCATE: ' . implode(', ', $toTruncate));

        if (!$this->confirm('Proceed with truncating ' . count($toTruncate) . ' tables?')) {
            return Command::FAILURE;
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        $bar = $this->output->createProgressBar(count($toTruncate));
        $bar->start();

        foreach ($toTruncate as $table) {
            DB::table($table)->truncate();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $this->info('Done! ' . count($toTruncate) . ' tables truncated.');
        $this->table(
            ['Email', 'Password'],
            [
                ['superadmin@tiffin.local', 'Admin@1234'],
                ['admin@tiffin.local', 'Admin@1234'],
            ]
        );

        return Command::SUCCESS;
    }

    private function getAllTables(): array
    {
        $tables = DB::select('SHOW TABLES');
        $key = 'Tables_in_' . config('database.connections.mysql.database', 'vyarufood');
        return array_map(fn($t) => $t->$key, $tables);
    }
}

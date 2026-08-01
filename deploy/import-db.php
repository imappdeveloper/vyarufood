<?php

$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '3306';
$name = getenv('DB_DATABASE') ?: 'railway';
$user = getenv('DB_USERNAME') ?: 'root';
$pass = (string) getenv('DB_PASSWORD');
$dump = '/var/www/database/tiffin_db.sql';
$lastMigration = '2026_09_01_000006_add_otp_columns_to_customers_table';

if (!file_exists($dump)) {
    fwrite(STDERR, "!! import-db: dump not found at $dump\n");
    exit(1);
}

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_MULTI_STATEMENTS => true,
            PDO::ATTR_TIMEOUT => 30,
        ]
    );
} catch (Throwable $e) {
    fwrite(STDERR, "!! import-db: connect failed: " . $e->getMessage() . "\n");
    exit(1);
}

try {
    $hasMigrations = (int) $pdo->query(
        'SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '
        . $pdo->quote($name) . " AND table_name = 'migrations'"
    )->fetchColumn();

    if ($hasMigrations > 0) {
        $count = (int) $pdo->query(
            'SELECT COUNT(*) FROM `migrations` WHERE `migration` = ' . $pdo->quote($lastMigration)
        )->fetchColumn();
        if ($count > 0) {
            echo "==> import-db: migrations already complete, skipping import\n";
            exit(0);
        }
        echo "==> import-db: migrations table present but incomplete, rebuilding\n";
    }

    echo "==> import-db: dropping existing tables\n";
    $tables = $pdo->query(
        'SELECT table_name FROM information_schema.tables WHERE table_schema = ' . $pdo->quote($name)
    )->fetchAll(PDO::FETCH_COLUMN);

    $pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
    foreach ($tables as $t) {
        $pdo->exec('DROP TABLE IF EXISTS `' . str_replace('`', '``', $t) . '`');
    }
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');

    echo "==> import-db: importing $dump\n";
    $sql = file_get_contents($dump);
    if ($sql === false) {
        fwrite(STDERR, "!! import-db: failed to read dump\n");
        exit(1);
    }
    $pdo->exec($sql);
    echo "==> import-db: import complete\n";
} catch (Throwable $e) {
    fwrite(STDERR, "!! import-db: " . $e->getMessage() . "\n");
    exit(1);
}

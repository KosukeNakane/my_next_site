<?php
// PostgreSQL connection helper (Render DATABASE_URL preferred)
declare(strict_types=1);

// Build DSN using DATABASE_URL if available; otherwise use individual env vars
$databaseUrl = getenv('DATABASE_URL') ?: '';

try {
    if ($databaseUrl !== '') {
        $url = parse_url($databaseUrl);
        if ($url === false || !isset($url['host'], $url['path'])) {
            throw new RuntimeException('Invalid DATABASE_URL');
        }

        $host = $url['host'];
        $port = isset($url['port']) ? (int)$url['port'] : 5432;
        $db   = ltrim($url['path'], '/');
        $user = $url['user'] ?? '';
        $pass = isset($url['pass']) ? urldecode($url['pass']) : '';

        // On Render, require SSL
        $dsn = "pgsql:host={$host};port={$port};dbname={$db};sslmode=require";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } else {
        // Fallback to discrete env vars (local default)
        // Defaults to local development DB `my_next_site_dev` without forcing SSL
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '5432';
        $db   = getenv('DB_NAME') ?: 'my_next_site_dev';
        $user = getenv('DB_USER') ?: 'postgres';
        $pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : getenv('DB_PASSWORD');
        if ($pass === false) { $pass = ''; }

        $sslmode = getenv('DB_SSLMODE') ?: 'prefer'; // prefer for local dev
        $dsn = "pgsql:host={$host};port={$port};dbname={$db};sslmode={$sslmode}";
        $pdo = new PDO($dsn, (string)$user, (string)$pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'DB接続に失敗しました: ' . $e->getMessage()]);
    exit;
}

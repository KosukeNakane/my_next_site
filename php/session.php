<?php
// API endpoint to report current session status

// CORS allow Next.js dev (3000)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = getenv('CORS_ALLOW_ORIGINS') ?: 'http://localhost:3000,http://127.0.0.1:3000';
$allowedOrigins = array_filter(array_map('trim', explode(',', $allowed)));
if ($origin && in_array($origin, $allowedOrigins, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Access-Control-Allow-Methods: GET, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// Optionally load DB and ensure core tables exist
// (This helps first-time setups before hitting login/register.)
if (file_exists(__DIR__ . '/db.php')) {
  require __DIR__ . '/db.php';
  try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT uniq_email UNIQUE (email),
      CONSTRAINT uniq_username UNIQUE (username)
    );
  ");
  } catch (Throwable $e) { /* ignore */ }
}

session_start();
header('Content-Type: application/json; charset=utf-8');

$loggedIn = !empty($_SESSION['login']) || !empty($_SESSION['user_id']);
$username = $loggedIn ? ($_SESSION['username'] ?? null) : null;

echo json_encode([
  'logged_in' => (bool)$loggedIn,
  'username' => $username,
]);

<?php
// API-only login endpoint (JSON). No HTML UI.

// CORS must be at the top so preflight can return without initiating session
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
if (in_array($origin, $allowedOrigins, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Access-Control-Allow-Methods: POST, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

session_start();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'POSTメソッドのみ対応しています']);
  exit;
}

// Load DB (my_next_site)
if (file_exists(__DIR__ . '/db.php')) {
  require __DIR__ . '/db.php';
  // Ensure users table exists (id, username, email, password, created_at)
  try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_email (email),
      UNIQUE KEY uniq_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
  } catch (Throwable $e) { /* ignore to avoid leaking errors */ }
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'DB設定ファイルが見つかりません']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'メールとパスワードを入力してください']);
  exit;
}

try {
  $stmt = $pdo->prepare('SELECT id, username, email, password FROM users WHERE email = :email LIMIT 1');
  $stmt->execute([':email' => $email]);
  $user = $stmt->fetch();
  if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'メールかパスワードが間違っています']);
    exit;
  }
  session_regenerate_id(true);
  $_SESSION['login'] = true;
  $_SESSION['user_id'] = (int)$user['id'];
  $_SESSION['username'] = $user['username'];
  echo json_encode(['success' => true]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'サーバーエラーが発生しました']);
}

<?php
// API-only register endpoint (JSON). No HTML UI.

// CORS at top
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
  echo json_encode(['success' => false, 'errors' => ['POSTメソッドのみ対応しています']]);
  exit;
}

// Load DB (my_next_site)
if (file_exists(__DIR__ . '/db.php')) {
  require __DIR__ . '/db.php';
  // Ensure users table exists before attempting to insert
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
  echo json_encode(['success' => false, 'errors' => ['DB設定ファイルが見つかりません']]);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$username = trim($input['username'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$confirm = $input['confirm'] ?? '';

$errors = [];
if ($username === '' || mb_strlen($username) > 50) {
    $errors[] = 'ユーザー名を50文字以内で入力してください。';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = '正しいメールアドレスを入力してください。';
}
if (mb_strlen($password) < 8) {
    $errors[] = 'パスワードは8文字以上で入力してください。';
}
if ($password !== $confirm) {
    $errors[] = '確認用パスワードが一致しません。';
}

if ($errors) {
  http_response_code(400);
  echo json_encode(['success' => false, 'errors' => $errors]);
  exit;
}

try {
  // duplicate check
  $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email OR username = :username LIMIT 1');
  $stmt->execute([':email' => $email, ':username' => $username]);
  if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'errors' => ['そのユーザー名またはメールアドレスは既に使用されています。']]);
    exit;
  }
  $hash = password_hash($password, PASSWORD_DEFAULT);
  $ins = $pdo->prepare('INSERT INTO users (username, email, password) VALUES (:username, :email, :password)');
  $ins->execute([':username' => $username, ':email' => $email, ':password' => $hash]);

  $_SESSION['user_id'] = (int)$pdo->lastInsertId();
  $_SESSION['username'] = $username;
  $_SESSION['login'] = true;

  echo json_encode(['success' => true]);
} catch (Throwable $e) {
  http_response_code(500);
  $msg = '登録に失敗しました。時間をおいて再度お試しください。';
  if (ini_get('display_errors')) { $msg .= ' ('.$e->getMessage().')'; }
  echo json_encode(['success' => false, 'errors' => [$msg]]);
}

<?php
// API-only bookmarks endpoint (JSON)
// Supports: GET (list or check), POST (add), DELETE (remove)

// CORS allow Next.js dev (3000)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = getenv('CORS_ALLOW_ORIGINS') ?: 'http://localhost:3000,http://127.0.0.1:3000';
$allowedOrigins = array_filter(array_map('trim', explode(',', $allowed)));
if ($origin && in_array($origin, $allowedOrigins, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

session_start();
header('Content-Type: application/json; charset=utf-8');

if (empty($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['success' => false, 'error' => 'ログインが必要です']);
  exit;
}

// Load DB
require __DIR__ . '/db.php';
$userId = (int)$_SESSION['user_id'];

// Ensure table exists (optional safe-guard; PostgreSQL)
try {
  $pdo->exec("CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    path VARCHAR(512) NOT NULL,
    title VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uniq_user_path UNIQUE (user_id, path)
  );");
} catch (Throwable $e) { /* ignore */ }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $path = isset($_GET['path']) ? (string)$_GET['path'] : '';
  if ($path !== '') {
    $stmt = $pdo->prepare('SELECT 1 FROM bookmarks WHERE user_id = :uid AND path = :path LIMIT 1');
    $stmt->execute([':uid' => $userId, ':path' => $path]);
    $exists = (bool)$stmt->fetchColumn();
    echo json_encode(['success' => true, 'bookmarked' => $exists]);
  } else {
    $stmt = $pdo->prepare('SELECT path, COALESCE(title, path) AS title, created_at FROM bookmarks WHERE user_id = :uid ORDER BY created_at DESC');
    $stmt->execute([':uid' => $userId]);
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'items' => $rows]);
  }
  exit;
}

if ($method === 'POST') {
  $body = json_decode(file_get_contents('php://input'), true) ?: [];
  $path = trim($body['path'] ?? '');
  $title = trim($body['title'] ?? '');
  if ($path === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'path が必要です']);
    exit;
  }
  try {
    $stmt = $pdo->prepare('INSERT INTO bookmarks (user_id, path, title) VALUES (:uid, :path, :title) ON CONFLICT (user_id, path) DO NOTHING');
    $stmt->execute([':uid' => $userId, ':path' => $path, ':title' => ($title !== '' ? $title : null)]);
    echo json_encode(['success' => true]);
  } catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => '登録に失敗しました']);
  }
  exit;
}

if ($method === 'DELETE') {
  $body = json_decode(file_get_contents('php://input'), true) ?: [];
  $path = trim($body['path'] ?? '');
  if ($path === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'path が必要です']);
    exit;
  }
  try {
    $stmt = $pdo->prepare('DELETE FROM bookmarks WHERE user_id = :uid AND path = :path');
    $stmt->execute([':uid' => $userId, ':path' => $path]);
    echo json_encode(['success' => true]);
  } catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => '削除に失敗しました']);
  }
  exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);

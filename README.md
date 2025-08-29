#  my_next_site — 開発環境構築ガイド（日本語）

本リポジトリは Next.js 15（App Router + TypeScript + Tailwind）を用いたフロントエンドと、認証・ブックマーク用の軽量な PHP バックエンド（MySQL）で構成されています。以下の手順に従ってローカル環境を構築してください。

## 技術スタック
- Next.js 15（React 18）
- Tailwind CSS
- MUI（アイコン等）
- PHP 8.x（認証・ブックマーク API）
- MySQL 8（ブックマーク保存）

## 前提条件
- Node.js 20 以上（LTS 推奨）
- npm 10 以上（Node 20 に同梱）
- PHP 8.x（pdo_mysql 有効）
- MySQL 8（MAMP 付属の MySQL でも可）

任意（簡単に動かしたい方向け）
- MAMP（Apache/ MySQL を手早く用意可能）

## リポジトリ構成（概要）
- `app/` — Next.js App Router のページと API ルート
  - `api/bookmarks/` — ブックマーク API（PHP へプロキシ）
  - `api/session|login|logout|register/` — 認証 API（PHP へプロキシ）
  - `api/images/random/` — `public/images` からランダム画像を返却
  - `food/`, `himeji/`, `tokyo-yokohama/` — 各ギャラリーページ（PicCard）
- `components/` — 共通 UI（NavBar, BookmarkButton など）
- `public/images/` — 画像アセット
- `php/` — PHP エンドポイント（`bookmarks.php`, `session.php`, `login.php`, `logout.php`, `register.php`, `db.php`）

## 1) 依存関係インストール
```
npm install
```

## 2) 環境変数の設定
リポジトリ直下に `.env.local` を作成し、PHP を公開しているベース URL を設定します。
```
# PHP の公開 URL（/php/*.php に到達できるルート）
NEXT_PUBLIC_PHP_BASE_URL=http://localhost:8888
```
Next.js の API ルートは、この値を使って `NEXT_PUBLIC_PHP_BASE_URL/php/...` にアクセスします。

## 3) PHP 環境構築（MAMP を使う場合）
1. MAMP をインストール
2. Web server に Apache を選択
3. Preferences → Server から Document root に「このリポジトリのルート」を指定
4. Start を押して MAMP を起動
5. ブラウザで `http://localhost:8888/php/session.php` や `http://localhost:8888/php/bookmarks.php` にアクセスして表示されることを確認

これにより、Next.js から PHP への連携（ログイン処理・ブックマーク処理）が可能になります。

補足（MySQL 設定）
- 既定の接続情報（`php/db.php`）：
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=8889`（MAMP の MySQL 既定）
  - `DB_NAME=my_next_site`
  - `DB_USER=root`
  - `DB_PASS=root`
- 必要に応じて MySQL に `my_next_site` データベースを作成してください（MAMP の phpMyAdmin 等で作成可）。
- `php/bookmarks.php` は初回アクセス時に `bookmarks` テーブルを自動作成します。

## データベースを手動で作成する場合

本リポジトリの PHP コードでは `bookmarks` テーブルは初回アクセス時に自動作成されますが、
本番環境などで **データベースを手動で準備したい場合** は以下の手順を実行してください。

```sql
-- データベースを作成
CREATE DATABASE my_next_site
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- データベースを選択
USE my_next_site;

-- users テーブルを作成
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_email (email),
  UNIQUE KEY uniq_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

- `my_next_site` の部分は `php/db.php` に記載されたデータベース名と揃えてください。
- `password` カラムには **平文ではなく `password_hash()` でハッシュ化したパスワード** を保存してください。

（MAMP を使わず PHP 内蔵サーバを使う場合の例）
```
# リポジトリ直下で実行
export DB_HOST=127.0.0.1
export DB_PORT=8889
export DB_NAME=my_next_site
export DB_USER=root
export DB_PASS=root
php -S localhost:8888 -t .
```

## 4) フロントエンド（Next.js）を起動
開発モード:
```
npm run dev
```
`http://localhost:3000` で起動します。`.env.local` の `NEXT_PUBLIC_PHP_BASE_URL` を用いて PHP へアクセスします。

本番ビルド:
```
npm run build
npm start
```
本番でも PHP（および MySQL）は別途稼働させておく必要があります。

## 5) 主な機能と API
- PicCard ブックマーク
  - 各カード右下の MUI アイコン（しおり）で登録/解除
  - ブックマークは `#アンカー` を含む URL として保存
  - `/mypage` に一覧表示。クリックで該当カード位置にスクロール遷移
- 認証系（Next → PHP プロキシ）
  - `GET /api/session` → `php/session.php`
  - `POST /api/login` → `php/login.php`
  - `POST /api/logout` → `php/logout.php`
  - `POST /api/register` → `php/register.php`
- ブックマーク API（Next → PHP プロキシ）
  - `GET/POST/DELETE /api/bookmarks` → `php/bookmarks.php`
- ランダム画像
  - `GET /api/images/random` — `public/images` から 1 枚を返却（アバター用途）

## 6) フォント
- Tailwind の `fontFamily` は `tailwind.config.js` に定義済み
- Adobe（Typekit）の CSS は `components/AdobeFontsLoader.tsx` と `styles/globals.css` で読み込み
- 反映されない場合はネットワークで Typekit ドメインがブロックされていないか確認してください

## 7) トラブルシューティング
- PHP へのアクセスで 404/CORS になる
  - `NEXT_PUBLIC_PHP_BASE_URL` を再確認（例: `http://localhost:8888`）
  - MAMP の Document root がこのリポジトリを指しているか確認
- MySQL 接続エラー
  - `php/db.php` の `DB_*` を確認。`pdo_mysql` が有効かもチェック
  - MAMP 既定は `user=root`, `pass=root`, `port=8889`
- フォントが想定と異なる
  - `AdobeFontsLoader` がマウントされているか、Typekit がブロックされていないか確認
- 画像が表示されない
  - `public/images` 以下のパス/拡張子（.JPG と .jpg の違いなど）を再確認

## 8) スクリプト
- `npm run dev` — 開発起動（Turbopack）
- `npm run build` — 本番ビルド
- `npm start` — 本番起動
- `npm run lint` — Lint 実行

## 9) デプロイ
- Next.js（Vercel など）をホストし、`NEXT_PUBLIC_PHP_BASE_URL` を PHP 側の公開 URL に設定
- PHP + MySQL は任意の LAMP 環境でホストし、`DB_*` を設定。クッキー/セッションが同一ドメイン/サブドメインで機能するように構成

---
不明点やエラーがあれば、環境情報・手順・ログを添えて連絡してください。

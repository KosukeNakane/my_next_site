
# my_next_site — 開発環境構築ガイド

私が2025年の夏に撮影した写真を記録した Web サイトです。
ログインすると写真をブックマークに保存できます。

本リポジトリは Next.js 15（App Router + TypeScript + Tailwind）を用いたフロントエンドと、ログイン認証・ブックマーク機能を提供する軽量な PHP バックエンド（PostgreSQL）で構成されています。

公開版は [my-next-site-three.vercel.app](https://my-next-site-three.vercel.app) から閲覧できます。
ローカルで動作させたい場合は「## 4. ローカル実行環境構築手順」に従って環境を構築してください。

---

## 1. 技術スタック

- Next.js 15（React 18）
- Tailwind CSS
- MUI（アイコン等）
- PHP 8.x（ログイン認証・ブックマーク API）
- PostgreSQL 15+（ログイン認証・ブックマーク保存）

---

## 2. 環境要件

- Node.js 20 以上（LTS 推奨）
- npm 10 以上（Node 20 に同梱）
- PHP 8.x（pdo_pgsql 有効）
- PostgreSQL 15 以上（ローカル or Render）

---

## 3. リポジトリ構成（概要）

- `app/` — Next.js App Router のページと API ルート
  - `api/bookmarks/` — ブックマーク API（PHP へプロキシ）
  - `api/session|login|logout|register/` — ログイン認証 API（PHP へプロキシ）
  - `api/images/random/` — `public/images` からランダム画像を返却
  - `food/`, `himeji/`, `tokyo-yokohama/` — 各ギャラリーページ（PicCard）
- `components/` — 共通 UI（NavBar, BookmarkButton など）
- `public/images/` — 画像アセット
- `php/` — PHP エンドポイント（`bookmarks.php`, `session.php`, `login.php`, `logout.php`, `register.php`, `db.php`）

---

## 4. ローカル実行環境構築手順

### 4.1 PostgreSQL インストール例

- **Mac (Homebrew)**

  ```bash
  brew install postgresql
  brew services start postgresql
  ```

- **Linux (Ubuntu 例)**

  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
  ```

- **Windows**
  [PostgreSQL公式サイト](https://www.postgresql.org/download/windows/)からインストーラーをダウンロードしてセットアップしてください。

---

### 4.2 PostgreSQL ロール（ユーザー）作成

PostgreSQL に `postgres` ロールが存在しない場合は、以下のコマンドで作成します。
`<OSユーザー名>` は適宜置き換えてください。

```bash
createuser -U <OSユーザー名> -s -P postgres
```

---

### 4.3 データベース作成とテーブル初期化

以下のコマンドでデータベース作成とテーブルの流し込みを一括で行えます。

```bash
psql -U postgres -d postgres -c "CREATE DATABASE my_next_site_dev;" \
&& psql -U postgres -d my_next_site_dev -f sql/users.sql \
&& psql -U postgres -d my_next_site_dev -f sql/bookmarks.sql
```

---

### 4.4 PHP 内蔵サーバ起動

リポジトリ直下で以下を実行し、PHP の内蔵サーバを起動します。

```bash
php -S localhost:8888 -t .
```

---

## 4.5 依存関係インストール

```bash
npm install
```

---

### 4.6 Next.js 開発サーバ起動

別ターミナルで以下を実行し、Next.js の開発サーバを起動します。

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスし、動作を確認してください。

---

### 4.7 本番ビルド・起動

```bash
npm run build
npm start
```

※ 本番環境でも PHP サーバーは別途稼働させておく必要があります。

---


本サイトはスマートフォン・タブレット・PC で快適に利用できるようレスポンシブ対応しています。

## 5. 主な機能と API

- **PicCard ブックマーク**
  - 各カード右下のブックマークアイコンから登録/解除
  - ブックマークは `#アンカー` を含む URL として保存
  - `/mypage` に一覧表示。クリックで該当カード位置にスクロール遷移

- **ログイン認証（Next → PHP プロキシ）**
  - `GET /api/session` → `php/session.php`
  - `POST /api/login` → `php/login.php`
  - `POST /api/logout` → `php/logout.php`
  - `POST /api/register` → `php/register.php`

- **ブックマーク API（Next → PHP プロキシ）**
  - `GET/POST/DELETE /api/bookmarks` → `php/bookmarks.php`

- **ランダム画像**
  - `GET /api/images/random` — `public/images` から 1 枚を返却（アバター用途）

---

## 6. フォント設定

- Tailwind の `fontFamily` は `tailwind.config.js` に定義済み
- Adobe（Typekit）の CSS は `components/AdobeFontsLoader.tsx` と `styles/globals.css` で読み込み
- 反映されない場合はネットワークで Typekit ドメインがブロックされていないか確認してください

---

## 7. トラブルシューティング

- **PHP へのアクセスで 500 エラーが出る**
  - PHP 内蔵サーバの起動を確認

- **フォントが想定と異なる**
  - Typekit ドメインがブロックされていないか確認

---

## 8. スクリプト一覧

- `npm run dev` — 開発起動（Turbopack）
- `npm run build` — 本番ビルド
- `npm start` — 本番起動
- `npm run lint` — Lint 実行

---

## 9. デプロイ（Vercel + Render）

- **フロントエンド（Vercel）**
  - 本リポジトリの Next.js を Vercel にデプロイ
  - 環境変数 `NEXT_PUBLIC_PHP_BASE_URL` に Render の PHP Web Service の URL を設定

- **バックエンド（Render Web Service + Render PostgreSQL）**
  - Render Web Service に PHP をデプロイ（ドキュメントルートをこのリポジトリ直下に設定）
  - Render PostgreSQL を作成し、PHP サービスに `DATABASE_URL` を設定（自動で `sslmode=require` に対応）
  - CORS 設定：PHP サービスに `CORS_ALLOW_ORIGINS` を設定（Vercel の URL とローカル開発 URL をカンマ区切りで）
  - セッション/クッキーは同一ドメイン/サブドメインでの取り扱いに注意（必要に応じて Cookie 属性やドメインを調整）

---

不明点やエラーがあれば、環境情報・手順・ログを添えてご連絡ください。

"use client";

import Link from "next/link";
import Image from "next/image";
import LottieBookmarkIcon from "../../LottieBookmarkIcon";

export type BookmarkItem = { path: string; title: string; created_at?: string };

export type DesktopMyPageProps = {
  username: string | null;
  loading: boolean;
  error: string | null;
  avatar: string | null;
  items: BookmarkItem[];
  onCardClick: (path: string) => void;
  onDelete: (path: string) => Promise<void> | void;
  bookmarkLabel: (path: string) => string;
  thumbFor: (path: string) => string;
};

const DesktopMyPage = ({ username, loading, error, avatar, items, onCardClick, onDelete, bookmarkLabel, thumbFor }: DesktopMyPageProps) => {
  return (
    <main className="min-h-[70vh] max-w-screen-lg mx-auto mt-6 px-6">
      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-500">読み込み中...</div>
      ) : username ? (
        <div className="space-y-8">
          <section className="relative bg-white text-gray-900 border-b border-gray-300">
            <div className="relative px-8 py-10 flex items-center gap-6">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 ring-1 ring-gray-300 overflow-hidden">
                {avatar ? (
                  <Image src={avatar} alt="avatar" fill sizes="64px" className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{username} さんのマイページ</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">ブックマークを管理・アクセスできます。</p>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm ring-1 ring-gray-200 text-gray-700">
                <LottieBookmarkIcon size={18} frame="end" />
                <span className="tabular-nums">{items.length}</span>
                <span>件</span>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <LottieBookmarkIcon size={40} frame="end" />
                ブックマーク
              </h2>
              <div className="sm:hidden text-sm text-gray-500">{items.length}件</div>
            </div>
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 bg-white/50">
                まだブックマークはありません。<br />各カード右下のアイコンから追加できます。
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((it) => (
                  <li key={it.path} className="group overflow-hidden border border-gray-200 bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => onCardClick(it.path)}>
                      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={thumbFor(it.path)} alt="thumb" fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-black">
                        <span className="truncate block">{it.title || bookmarkLabel(it.path)}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(it.path); }}
                        className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded border border-transparent hover:border-red-200 transition"
                        title="ブックマークを削除"
                      >
                        削除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-8 text-center shadow-sm">
          <p className="text-gray-700">ログインしていません。</p>
          <Link href="/" className="text-blue-600 hover:underline">ホームに戻る</Link>
        </div>
      )}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </main>
  );
};

export default DesktopMyPage;

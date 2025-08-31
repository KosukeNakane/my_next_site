"use client";

import Link from "next/link";
import Image from "next/image";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import type { BookmarkItem } from "./MyPage";

export type SpMyPageProps = {
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

const SpMyPage = ({ username, loading, error, avatar, items, onCardClick, onDelete, bookmarkLabel, thumbFor }: SpMyPageProps) => {
  return (
    <main className="min-h-[70vh] max-w-screen-lg mx-auto md:mt-36 px-4 md:px-6">
      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-500">読み込み中...</div>
      ) : username ? (
        <div className="space-y-6 md:space-y-8">
          <section className="relative bg-white text-gray-900 border-b border-gray-300">
            <div className="relative px-4 md:px-8 py-6 md:py-10 flex items-center gap-4 md:gap-6">
              <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-100 ring-1 ring-gray-300 overflow-hidden">
                {avatar ? (
                  <Image src={avatar} alt="avatar" fill sizes="56px" className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{username} さんのマイページ</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-0.5 md:mt-1">ブックマークを管理・アクセスできます。</p>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-2 rounded-full bg-gray-100 px-2.5 md:px-3 py-1 md:py-1.5 text-sm ring-1 ring-gray-200 text-gray-700">
                <BookmarkIcon sx={{ fontSize: 18, color: '#38bdf8' }} />
                <span className="tabular-nums">{items.length}</span>
                <span>件</span>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                <BookmarkIcon sx={{ fontSize: 20, color: '#38bdf8' }} />
                ブックマーク
              </h2>
              <div className="sm:hidden text-sm text-gray-500">{items.length}件</div>
            </div>
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 md:p-8 text-center text-gray-500 bg-white/50">
                まだブックマークはありません。各カード右下のアイコンから追加できます。
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {items.map((it) => (
                  <li key={it.path} className="group overflow-hidden  border border-gray-200 bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3 md:p-4 flex items-center gap-3 cursor-pointer" onClick={() => onCardClick(it.path)}>
                      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={thumbFor(it.path)} alt="thumb" fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-black">
                        <span className="truncate block text-sm md:text-base">{it.title || bookmarkLabel(it.path)}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(it.path); }}
                        className="text-xs text-gray-500 hover:text-red-600 px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-transparent hover:border-red-200 transition"
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
        <div className="space-y-3 md:space-y-4 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 md:p-8 text-center shadow-sm">
          <p className="text-gray-700">ログインしていません。</p>
          <Link href="/" className="text-blue-600 hover:underline">ホームに戻る</Link>
        </div>
      )}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </main>
  );
};

export default SpMyPage;

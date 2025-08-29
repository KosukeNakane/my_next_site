"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function MyPage() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<{ path: string; title: string; created_at?: string }[]>([]);
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/session", { cache: "no-store" });
                const data = await res.json();
                if (data.logged_in) {
                    setUsername(data.username || null);
                    const b = await fetch('/api/bookmarks', { cache: 'no-store' });
                    const bd = await b.json();
                    if (bd.success && Array.isArray(bd.items)) setItems(bd.items);
                    // load random avatar from public/images
                    try {
                      const a = await fetch('/api/images/random', { cache: 'no-store' });
                      const ad = await a.json();
                      if (ad?.image) setAvatar(ad.image);
                    } catch {}
                }
            } catch {
                setError("セッション取得に失敗しました");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const bookmarkLabel = (path: string) => {
        const noQuery = path.split('?')[0].split('#')[0];
        const parts = noQuery.split('/').filter(Boolean);
        const label = parts.length ? parts.join(' ▶ ') : '/';
        try { return decodeURIComponent(label); } catch { return label; }
    };

    return (
        <main className="min-h-[70vh] max-w-screen-lg mx-auto mt-36 px-6">
            {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-500">読み込み中...</div>
            ) : username ? (
                <div className="space-y-8">
                    {/* Hero */}
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
                                <BookmarkIcon sx={{ fontSize: 18, color: '#fbbf24' }} />
                                <span className="tabular-nums">{items.length}</span>
                                <span>件</span>
                            </div>
                        </div>
                    </section>

                    {/* Bookmarks */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <BookmarkIcon sx={{ fontSize: 22, color: '#f59e0b' }} />
                                ブックマーク
                            </h2>
                            <div className="sm:hidden text-sm text-gray-500">{items.length}件</div>
                        </div>
                        {items.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 bg-white/50">
                                まだブックマークはありません。各カード右下のアイコンから追加できます。
                            </div>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {items.map((it) => (
                                    <li key={it.path} className="group overflow-hidden  border border-gray-200 bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
                                        <div
                                            className="p-4 flex items-center gap-3 cursor-pointer"
                                            onClick={() => router.push(it.path)}
                                        >
                                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 text-amber-600">
                                                <BookmarkIcon sx={{ fontSize: 18 }} />
                                            </div>
                                            <div className="flex-1 min-w-0 text-black">
                                                <span className="truncate block">{it.title || bookmarkLabel(it.path)}</span>
                                            </div>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    try {
                                                        const res = await fetch('/api/bookmarks', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: it.path }) });
                                                        const d = await res.json();
                                                        if (d.success) setItems(prev => prev.filter(p => p.path !== it.path));
                                                    } catch { }
                                                }}
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

                    <div className="pt-2">
                        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4">ホームに戻る</Link>
                    </div>
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
}

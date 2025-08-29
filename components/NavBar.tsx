"use client";


import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AuthModal, { AuthMode } from "./AuthModal";

type NavBarProps = {
  dark?: boolean;
  mode?: string;
};

const NavBar: React.FC<NavBarProps> = ({ dark = false, mode = "" }) => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const phpBase = process.env.NEXT_PUBLIC_PHP_BASE_URL || '';

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch session to show login state
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/session', { cache: 'no-store' });
        const data = await res.json();
        if (data.logged_in) setUsername(data.username || '');
        else setUsername(null);
      } catch { }
    };
    load();
  }, []);

  useEffect(() => {
    const onOpenAuth = (e: Event) => {
      const ce = e as CustomEvent;
      const mode = ce?.detail?.mode === 'register' ? 'register' : 'login';
      setAuthMode(mode as AuthMode);
      setAuthOpen(true);
    };
    window.addEventListener('open-auth-modal', onOpenAuth as EventListener);
    return () => window.removeEventListener('open-auth-modal', onOpenAuth as EventListener);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 py-2 ${"bg-white/70 text-gray-800"
        } ${mode === "benton" ? "font-bentonModernDisplay" : ""} backdrop-blur-md transition-opacity duration-300 ${showNav ? "opacity-100" : "opacity-0"
        }`}
    >
      <nav className="relative w-full px-4 py-9 flex items-center justify-between">
        {/* 左側リンク（FOOD / TOKYO-YOKOHAMA） */}
        <div className="w-[calc(50%-5rem)] flex justify-end">
          <ul
            className={`flex justify-end flex-wrap gap-x-6 text-sm ${dark ? "text-white" : "text-gray-900"}`}
          >
            <li>
              <Link
                href="/food"
                className="hover:text-gray-400 transition duration-200"
              >
                FOOD
              </Link>
            </li>
            <li>
              <Link
                href="/tokyo-yokohama"
                className="hover:text-gray-400 transition duration-200"
              >
                TOKYO / YOKOHAMA
              </Link>
            </li>
          </ul>
        </div>

        {/* ロゴ中央配置 */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10">
          <Link href="/" className="block backdrop-blur-none">
            <img
              src="/icons/icon.jpg"
              alt="ens logo"
              className="w-20 h-20 object-contain rounded-full"
            />
          </Link>
        </div>

        {/* 右側リンク（HIMEJI / LINK ドロップダウン） */}
        <div className="w-[calc(50%-5rem)] flex items-center">
          <ul
            className={`flex justify-start flex-wrap gap-x-6 text-sm ${dark ? "text-white" : "text-gray-900"}`}
          >
            <li>
              <Link
                href="/himeji"
                className="hover:text-gray-400 transition duration-200"
              >
                HIMEJI
              </Link>
            </li>

            {/* LINK ドロップダウン（外部リンク） */}
            <li className="relative group">
              <button type="button" className="hover:text-gray-400 transition duration-200">
                LINK
              </button>

              <div className="absolute right-0 left-auto top-full pt-2 hidden group-hover:block group-focus-within:block z-20">

                <div className="bg-white text-gray-900 border border-gray-200 rounded shadow-lg p-2 min-w-[200px] text-right">
                  <a href="https://www.city.kobe.lg.jp/" target="_blank" rel="noopener noreferrer" className="block px-3 py-1.5 hover:bg-gray-100 rounded text-sm">KOBE</a>
                  <a href="https://www.city.himeji.lg.jp/" target="_blank" rel="noopener noreferrer" className="block px-3 py-1.5 hover:bg-gray-100 rounded text-sm">HIMEJI</a>
                  <a href="https://www.metro.tokyo.lg.jp/" target="_blank" rel="noopener noreferrer" className="block px-3 py-1.5 hover:bg-gray-100 rounded text-sm">TOKYO</a>
                  <a href="https://www.city.yokohama.lg.jp/" target="_blank" rel="noopener noreferrer" className="block px-3 py-1.5 hover:bg-gray-100 rounded text-sm">YOKOHAMA</a>
                </div>
              </div>
            </li>
          </ul>

          {/* 右端：認証系ボタン */}
          <div className="ml-auto flex items-center gap-3">
            {username ? (
              <div className="relative group">
                <button type="button" className="text-sm text-gray-800 hover:text-gray-400">
                  ようこそ {username}さん
                </button>
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block group-focus-within:block z-20">
                  <div className="bg-white text-gray-900 border border-gray-200 rounded shadow-lg p-2 min-w-[180px]">
                    <Link href="/mypage" className="px-3 py-1 hover:bg-gray-100 rounded flex items-center gap-2">
                      <PersonIcon sx={{ fontSize: 18 }} />
                      <span>マイページ</span>
                    </Link>
                    <button type="button" onClick={() => setLogoutOpen(true)} className=" w-full text-left px-3 py-1 hover:bg-gray-100 rounded flex items-center gap-2">
                      <LogoutIcon sx={{ fontSize: 18 }} />
                      <span>ログアウト</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <a
                  href="#login"
                  onClick={(e) => { e.preventDefault(); setAuthMode("login"); setAuthOpen(true); }}
                  className="text-sm text-gray-800 hover:text-gray-400"
                >
                  ログイン
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="#register"
                  onClick={(e) => { e.preventDefault(); setAuthMode("register"); setAuthOpen(true); }}
                  className="text-sm text-gray-800 hover:text-gray-400"
                >
                  ユーザー登録
                </a>
              </>
            )}
          </div>
          <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} />
          {logoutOpen && createPortal(
            <div className="fixed inset-0 z-[110] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50" onClick={() => setLogoutOpen(false)} />
              <div className="relative bg-white rounded shadow-lg w-[min(90vw,420px)] p-5">
                <h3 className="text-lg font-semibold mb-3">ログアウトしますか？</h3>
                <p className="text-sm text-gray-600 mb-5">現在のアカウントからログアウトしますか？</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setLogoutOpen(false)} className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-sm">キャンセル</button>
                  <button
                    onClick={async () => {
                      try { await fetch('/api/logout', { method: 'POST' }); } catch { }
                      window.location.href = '/';
                    }}
                    className="px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-gray-700 text-sm"
                  >
                    ログアウト
                  </button>
                </div>
              </div>
            </div>,
            document.getElementById('modal-root') as HTMLElement
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;

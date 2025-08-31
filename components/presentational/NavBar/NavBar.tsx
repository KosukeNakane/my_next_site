"use client";

import Link from "next/link";
import Image from "next/image";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

export type DesktopNavBarProps = {
  dark?: boolean;
  mode?: string;
  showNav: boolean;
  username: string | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenLogout: () => void;
};

const DesktopNavBar = ({
  dark = false,
  mode = "",
  showNav,
  username,
  onOpenLogin,
  onOpenRegister,
  onOpenLogout,
}: DesktopNavBarProps) => {
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 py-2 md:py-4 ${"bg-white/70 text-gray-800"} ${mode === "benton" ? "font-bentonModernDisplay" : ""} backdrop-blur-md transition-opacity duration-300 ${showNav ? "opacity-100" : "opacity-0"}`}
    >
      <nav className="relative w-full px-3 md:px-6 py-2 md:py-9 flex items-center justify-between">
        <div className="w-[calc(50%-5rem)] flex justify-end">
          <ul className={`flex justify-end flex-wrap gap-x-6 text-sm ${dark ? "text-white" : "text-gray-900"}`}>
            <li>
              <Link href="/food" className="hover:text-gray-400 transition duration-200">FOOD</Link>
            </li>
            <li>
              <Link href="/tokyo-yokohama" className="hover:text-gray-400 transition duration-200">TOKYO / YOKOHAMA</Link>
            </li>
          </ul>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 z-10">
          <Link href="/" className="block backdrop-blur-none">
            <Image src="/icons/icon.jpg" alt="ens logo" width={80} height={80} className="w-10 h-10 md:w-20 md:h-20 object-contain rounded-full" priority />
          </Link>
        </div>

        <div className="w-[calc(50%-5rem)] flex items-center">
          <ul className={`flex justify-start flex-wrap gap-x-6 text-sm ${dark ? "text-white" : "text-gray-900"}`}>
            <li>
              <Link href="/himeji" className="hover:text-gray-400 transition duration-200">HIMEJI</Link>
            </li>
            <li className="relative group">
              <button type="button" className="hover:text-gray-400 transition duration-200">LINK</button>
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

          <div className="ml-auto flex items-center gap-3 text-sm">
            {username ? (
              <div className="relative group">
                <button type="button" className="text-sm text-gray-800 hover:text-gray-400">ようこそ {username}さん</button>
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block group-focus-within:block z-20">
                  <div className="bg-white text-gray-900 border border-gray-200 rounded shadow-lg p-2 min-w-[180px]">
                    <Link href="/mypage" className="px-3 py-1 hover:bg-gray-100 rounded flex items-center gap-2">
                      <PersonIcon sx={{ fontSize: 18 }} />
                      <span>マイページ</span>
                    </Link>
                    <button type="button" onClick={onOpenLogout} className="w-full text-left px-3 py-1 hover:bg-gray-100 rounded flex items-center gap-2">
                      <LogoutIcon sx={{ fontSize: 18 }} />
                      <span>ログアウト</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button onClick={onOpenLogin} className="text-sm text-gray-800 hover:text-gray-400">ログイン</button>
                <span className="text-gray-400">|</span>
                <button onClick={onOpenRegister} className="text-sm text-gray-800 hover:text-gray-400">ユーザー登録</button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DesktopNavBar;


"use client";

import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import MenuIcon from '@mui/icons-material/Menu';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export type SpNavBarProps = {
  dark?: boolean;
  mode?: string;
  showNav: boolean;
  username: string | null;
  mobileOpen: boolean;
  mobileLinksOpen: boolean;
  onToggleMobile: () => void;
  onToggleLinks: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenLogout: () => void;
};

const SpNavBar = ({
  dark = false,
  mode = "",
  showNav,
  username,
  mobileOpen,
  mobileLinksOpen,
  onToggleMobile,
  onToggleLinks,
  onOpenLogin,
  onOpenRegister,
  onOpenLogout,
}: SpNavBarProps) => {
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 py-2 md:py-2 ${"bg-white/70 text-gray-800"} ${mode === "benton" ? "font-bentonModernDisplay" : ""} backdrop-blur-md transition-opacity duration-300 ${showNav ? "opacity-100" : "opacity-0"}`}
    >
      <nav className="relative w-full px-3 md:px-6 py-1 md:py-9 flex items-center justify-between text-[13px]">
        <div className="w-[calc(50%-5rem)] flex justify-end">
          <ul className={`hidden sm:flex justify-end flex-wrap gap-x-6 text-sm ${dark ? "text-white" : "text-gray-900"}`}>
            <li><Link href="/food" className="hover:text-gray-400 transition duration-200">FOOD</Link></li>
            <li><Link href="/tokyo-yokohama" className="hover:text-gray-400 transition duration-200">TOKYO / YOKOHAMA</Link></li>
          </ul>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 z-10">
          <Link href="/" className="block backdrop-blur-none">
            <Image src="/icons/icon.jpg" alt="ens logo" width={80} height={80} className="w-9 h-9 md:w-20 md:h-20 object-contain rounded-full" priority />
          </Link>
        </div>

        <div className="w-[calc(50%-5rem)] flex items-center">
          <ul className={`hidden sm:flex justify-start flex-wrap gap-x-6 text-sm ${dark ? "text-white" : "text-gray-900"}`}>
            <li><Link href="/himeji" className="hover:text-gray-400 transition duration-200">HIMEJI</Link></li>
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

          <div className="sm:hidden ml-auto">
            <button type="button" aria-label="メニューを開く" onClick={onToggleMobile} className="inline-flex items-center justify-center w-9 h-9 text-gray-800 hover:bg-white">
              <MenuIcon sx={{ fontSize: 22 }} />
            </button>
          </div>

          {mobileOpen && typeof window !== 'undefined' && createPortal(
            <div className="fixed inset-0 z-[110]" aria-modal="true" role="dialog">
              <div className="absolute inset-0 bg-black/20" onClick={onToggleMobile} />
              <div className="absolute right-2 top-[52px] w-[min(42vw,280px)] rounded-lg bg-white text-gray-900 shadow-lg ring-1 ring-black/5 overflow-hidden text-[13px]">
                <nav className="py-1.5">
                  <Link href="/food" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={onToggleMobile}>
                    <RestaurantMenuIcon sx={{ fontSize: 18 }} />
                    <span>FOOD</span>
                  </Link>
                  <Link href="/tokyo-yokohama" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={onToggleMobile}>
                    <LocationCityIcon sx={{ fontSize: 18 }} />
                    <span>TOKYO / YOKOHAMA</span>
                  </Link>
                  <Link href="/himeji" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={onToggleMobile}>
                    <LocationCityIcon sx={{ fontSize: 18 }} />
                    <span>HIMEJI</span>
                  </Link>
                  <div className="border-t my-1.5" />
                  <div className="px-2">
                    <button type="button" className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 flex items-center justify-between" onClick={onToggleLinks} aria-expanded={mobileLinksOpen}>
                      <span className="flex items-center gap-2"><LinkIcon sx={{ fontSize: 18 }} /><span>LINK</span></span>
                      {mobileLinksOpen ? (
                        <ArrowDropUpIcon sx={{ fontSize: 22 }} />
                      ) : (
                        <ArrowDropDownIcon sx={{ fontSize: 22 }} />
                      )}
                    </button>
                    {mobileLinksOpen && (
                      <div className="mt-1 mb-2 ml-2">
                        <a href="https://www.city.kobe.lg.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50">
                          <CorporateFareIcon sx={{ fontSize: 16 }} />
                          <span>KOBE</span>
                        </a>
                        <a href="https://www.city.himeji.lg.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50">
                          <CorporateFareIcon sx={{ fontSize: 16 }} />
                          <span>HIMEJI</span>
                        </a>
                        <a href="https://www.metro.tokyo.lg.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50">
                          <CorporateFareIcon sx={{ fontSize: 16 }} />
                          <span>TOKYO</span>
                        </a>
                        <a href="https://www.city.yokohama.lg.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50">
                          <CorporateFareIcon sx={{ fontSize: 16 }} />
                          <span>YOKOHAMA</span>
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="border-t my-1.5" />
                  {username ? (
                    <>
                      <Link href="/mypage" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={onToggleMobile}>
                        <PersonIcon sx={{ fontSize: 18 }} />
                        <span>マイページ</span>
                      </Link>
                      <button type="button" className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2" onClick={() => { onToggleMobile(); onOpenLogout(); }}>
                        <LogoutIcon sx={{ fontSize: 18 }} />
                        <span>ログアウト</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { onToggleMobile(); onOpenLogin(); }}>ログイン</button>
                      <button type="button" className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { onToggleMobile(); onOpenRegister(); }}>ユーザー登録</button>
                    </>
                  )}
                </nav>
              </div>
            </div>,
            document.getElementById('modal-root') as HTMLElement
          )}
        </div>
      </nav>
    </header>
  );
};

export default SpNavBar;

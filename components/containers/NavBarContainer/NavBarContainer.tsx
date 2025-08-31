"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useIsMobile from "../../../hooks/useIsMobile";
import DesktopNavBar from "../../presentational/NavBar/NavBar";
import SpNavBar from "../../presentational/NavBar/SpNavBar";
import AuthModal, { AuthMode } from "../../AuthModal";

type Props = {
  dark?: boolean;
  mode?: string;
};

const NavBarContainer: React.FC<Props> = ({ dark = false, mode = "" }) => {
  const isMobile = useIsMobile(768);
  const [showNav, setShowNav] = useState(true);
  const lastScrollYRef = useRef(0);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Mobile-only UI states
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileLinksOpen, setMobileLinksOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const last = lastScrollYRef.current;
      setShowNav(currentScrollY < last || currentScrollY < 50);
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const onOpenLogin = () => { setAuthMode('login'); setAuthOpen(true); };
  const onOpenRegister = () => { setAuthMode('register'); setAuthOpen(true); };
  const onOpenLogout = () => { setLogoutOpen(true); };

  const commonProps = { dark, mode, showNav, username, onOpenLogin, onOpenRegister, onOpenLogout } as const;

  return (
    <>
      {isMobile ? (
        <SpNavBar
          {...commonProps}
          mobileOpen={mobileOpen}
          mobileLinksOpen={mobileLinksOpen}
          onToggleMobile={() => {
            setMobileOpen(prev => {
              if (prev) setMobileLinksOpen(false);
              return !prev;
            });
          }}
          onToggleLinks={() => setMobileLinksOpen(v => !v)}
        />
      ) : (
        <DesktopNavBar {...commonProps} />
      )}

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
                onClick={async () => { try { await fetch('/api/logout', { method: 'POST' }); } catch { } window.location.href = '/'; }}
                className="px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-gray-700 text-sm"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement
      )}
    </>
  );
};

export default NavBarContainer;

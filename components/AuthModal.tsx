"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CloseIcon from '@mui/icons-material/Close';

export type AuthMode = "login" | "register";

type Props = {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
};

const AuthModal: React.FC<Props> = ({ open, mode, onClose }) => {
  const [active, setActive] = useState<AuthMode>(mode);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // register form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  useEffect(() => {
    setActive(mode);
    setErrors([]);
  }, [mode, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const portalEl = typeof window !== 'undefined' ? document.getElementById('modal-root') : null;
  if (!open || !mounted || !portalEl) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginUsername, password: loginPassword }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.success !== true) {
        const errMsg = data?.error || "ログインに失敗しました。入力内容をご確認ください。";
        setErrors([errMsg]);
      } else {
        const to = data.redirect || "/";
        window.location.href = to;
      }
    } catch {
      setErrors(["通信エラーが発生しました。時間をおいてお試しください。"]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: regUsername, email: regEmail, password: regPassword, confirm: regConfirm }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.success !== true) {
        const errs = data?.errors || [data?.error || "登録に失敗しました。入力内容をご確認ください。"];
        setErrors(errs);
      } else {
        const to = data.redirect || "/";
        window.location.href = to;
      }
    } catch {
      setErrors(["通信エラーが発生しました。時間をおいてお試しください。"]);
    } finally {
      setLoading(false);
    }
  };

  const node = (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white w-[min(95vw,560px)] rounded shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-6">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-gray-900"
          >
            <CloseIcon sx={{ fontSize: 22 }} />
          </button>
          <div />
        </div>
        <div className="px-24 ">
          <h2 className="text-2xl font-bold text-left">
            {active === 'login' ? 'ログイン' : 'ユーザー登録'}
          </h2>
        </div>

        {errors.length > 0 && (
          <div className="mx-4 mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
            <ul className="list-disc ml-5">
              {errors.map((e, i) => (<li key={i}>{e}</li>))}
            </ul>
          </div>
        )}

        {/* Body */}
        <div className="px-24 pt-6 pb-16">
          {active === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm mb-1" htmlFor="login-username">メールアドレス</label>
                <input id="login-username" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="login-password">パスワード</label>
                <input id="login-password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white  py-2 rounded-full hover:bg-gray-700 disabled:opacity-60">
                {loading ? "送信中..." : "ログイン"}
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">
                アカウントをお持ちでないですか？
                <button
                  type="button"
                  onClick={() => { setActive("register"); setErrors([]); }}
                  className="ml-1 text-blue-600 hover:underline"
                >
                  ユーザー登録
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm mb-1" htmlFor="reg-username">ユーザー名</label>
                <input id="reg-username" value={regUsername} onChange={e => setRegUsername(e.target.value)} required maxLength={50} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="reg-email">メールアドレス</label>
                <input id="reg-email" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="reg-password">パスワード</label>
                <input id="reg-password" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required minLength={8} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="reg-confirm">パスワード（確認）</label>
                <input id="reg-confirm" type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} required minLength={8} className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-2 rounded-full hover:bg-gray-700 disabled:opacity-60">
                {loading ? "送信中..." : "登録する"}
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">
                すでにアカウントをお持ちですか？
                <button
                  type="button"
                  onClick={() => { setActive("login"); setErrors([]); }}
                  className="ml-1 text-blue-600 hover:underline"
                >
                  ログイン
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
  return createPortal(node, portalEl);
};

export default AuthModal;

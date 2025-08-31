"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DesktopAuthModal from "./presentational/AuthModal/AuthModal";
import SpAuthModal from "./presentational/AuthModal/SpAuthModal";
import useIsMobile from "../hooks/useIsMobile";

export type AuthMode = "login" | "register";

type Props = {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
};

const AuthModal: React.FC<Props> = ({ open, mode, onClose }) => {
  const isMobile = useIsMobile(768);
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

  const presentationalProps = {
    active,
    loading,
    errors,
    loginUsername,
    loginPassword,
    regUsername,
    regEmail,
    regPassword,
    regConfirm,
    onChange: (field: string, value: string) => {
      switch (field) {
        case 'loginUsername': setLoginUsername(value); break;
        case 'loginPassword': setLoginPassword(value); break;
        case 'regUsername': setRegUsername(value); break;
        case 'regEmail': setRegEmail(value); break;
        case 'regPassword': setRegPassword(value); break;
        case 'regConfirm': setRegConfirm(value); break;
      }
    },
    onSubmitLogin: handleLogin,
    onSubmitRegister: handleRegister,
    switchTo: (m: AuthMode) => { setActive(m); setErrors([]); },
    onClose,
  };

  const card = isMobile ? <SpAuthModal {...presentationalProps} /> : <DesktopAuthModal {...presentationalProps} />;
  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      {card}
    </div>
  );
  return createPortal(modal, portalEl);
};

export default AuthModal;

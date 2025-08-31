"use client";

import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import type { AuthPresentationalProps } from './AuthModal';

const SpAuthModal: React.FC<AuthPresentationalProps> = (p) => {
  return (
    <div className="relative bg-white w-[min(92vw,420px)] rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-3">
        <button type="button" aria-label="Close" onClick={p.onClose} className="p-1 text-gray-600 hover:text-gray-900">
          <CloseIcon sx={{ fontSize: 20 }} />
        </button>
        <div />
      </div>
      <div className="px-4">
        <h2 className="text-xl font-bold text-left">{p.active === 'login' ? 'ログイン' : 'ユーザー登録'}</h2>
      </div>
      {p.errors.length > 0 && (
        <div className="mx-3 mt-3 bg-red-50 border border-red-200 text-red-700 p-2 rounded text-sm">
          <ul className="list-disc ml-5">
            {p.errors.map((e, i) => (<li key={i}>{e}</li>))}
          </ul>
        </div>
      )}
      <div className="px-4 pt-4 pb-8">
        {p.active === 'login' ? (
          <form onSubmit={p.onSubmitLogin} className="space-y-3">
            <div>
              <label className="block text-sm mb-1" htmlFor="login-username">メールアドレス</label>
              <input id="login-username" value={p.loginUsername} onChange={e => p.onChange('loginUsername', e.target.value)} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="login-password">パスワード</label>
              <input id="login-password" type="password" value={p.loginPassword} onChange={e => p.onChange('loginPassword', e.target.value)} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
            </div>
            <button type="submit" disabled={p.loading} className="w-full bg-gray-900 text-white py-2 rounded-full hover:bg-gray-700 disabled:opacity-60">{p.loading ? "送信中..." : "ログイン"}</button>
            <p className="text-sm text-gray-600 text-center">
              アカウントをお持ちでないですか？
              <button type="button" onClick={() => p.switchTo('register')} className="ml-1 text-blue-600 hover:underline">ユーザー登録</button>
            </p>
          </form>
        ) : (
          <form onSubmit={p.onSubmitRegister} className="space-y-3">
            <div>
              <label className="block text-sm mb-1" htmlFor="reg-username">ユーザー名</label>
              <input id="reg-username" value={p.regUsername} onChange={e => p.onChange('regUsername', e.target.value)} required maxLength={50} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="reg-email">メールアドレス</label>
              <input id="reg-email" type="email" value={p.regEmail} onChange={e => p.onChange('regEmail', e.target.value)} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="reg-password">パスワード</label>
              <input id="reg-password" type="password" value={p.regPassword} onChange={e => p.onChange('regPassword', e.target.value)} required minLength={8} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="reg-confirm">パスワード（確認）</label>
              <input id="reg-confirm" type="password" value={p.regConfirm} onChange={e => p.onChange('regConfirm', e.target.value)} required minLength={8} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" />
            </div>
            <button type="submit" disabled={p.loading} className="w-full bg-gray-900 text-white py-2 rounded-full hover:bg-gray-700 disabled:opacity-60">{p.loading ? "送信中..." : "登録する"}</button>
            <p className="text-sm text-gray-600 text-center">
              すでにアカウントをお持ちですか？
              <button type="button" onClick={() => p.switchTo('login')} className="ml-1 text-blue-600 hover:underline">ログイン</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SpAuthModal;


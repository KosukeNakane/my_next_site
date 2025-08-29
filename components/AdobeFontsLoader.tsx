'use client';

import { useEffect } from 'react';

const AdobeFontsLoader = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://use.typekit.net/lzd3jvi.js';
    script.src = 'https://use.typekit.net/qyh6kcr.js';
    script.async = true;
    script.onload = () => {
      // @ts-expect-error Typekit is injected by the Adobe script
      try { window.Typekit.load(); } catch (e) { console.error('Adobe Fonts failed to load', e); }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};

export default AdobeFontsLoader;

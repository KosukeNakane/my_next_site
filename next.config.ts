import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const phpBase = process.env.NEXT_PUBLIC_PHP_BASE_URL || 'http://localhost:8888';
    return {
      beforeFiles: [
        { source: "/register.php", destination: `${phpBase}/php/register.php` },
        { source: "/login.php", destination: `${phpBase}/php/login.php` },
        { source: "/logout.php", destination: `${phpBase}/php/logout.php` },
        { source: "/session.php", destination: `${phpBase}/php/session.php` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;

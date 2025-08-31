import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const phpBase = process.env.NEXT_PUBLIC_PHP_BASE_URL || 'http://localhost:8888/php';
    return {
      beforeFiles: [
        { source: "/register.php", destination: `${phpBase}/register.php` },
        { source: "/login.php", destination: `${phpBase}/login.php` },
        { source: "/logout.php", destination: `${phpBase}/logout.php` },
        { source: "/session.php", destination: `${phpBase}/session.php` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";

export default function BackButton({ useBenton = false }: { useBenton?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile(768);
  const [parentPath, setParentPath] = useState<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === "/") {
      setParentPath(null);
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      setParentPath("/" + segments.slice(0, -1).join("/"));
    } else {
      setParentPath("/");
    }
  }, [pathname]);

  if (!parentPath || isMobile) return null;

  return (
    <button
      onClick={() => {
        try {
          const evt = new CustomEvent('app:navigate', { detail: { href: parentPath } });
          window.dispatchEvent(evt);
        } catch {
          router.push(parentPath);
        }
      }}
      className={`fixed bottom-4 left-4 px-4 py-2 bg-gray-900 text-white hover:bg-gray-700 transition z-50 ${useBenton ? " font-bentonModernDisplay" : ""}`}
    >
      ← BACK
    </button>
  );
}

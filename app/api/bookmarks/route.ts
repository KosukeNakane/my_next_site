import { NextResponse } from "next/server";

const phpBase = process.env.NEXT_PUBLIC_PHP_BASE_URL || "http://localhost:8888/php";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  const upstream = await fetch(`${phpBase}/bookmarks.php${path ? `?path=${encodeURIComponent(path)}` : ''}`, {
    headers: { Cookie: cookie },
    cache: "no-store",
  });
  const data = await upstream.json().catch(() => ({ success: false }));
  return NextResponse.json(data, { status: upstream.status });
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const body = await req.json().catch(() => ({}));
  const upstream = await fetch(`${phpBase}/bookmarks.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(body),
  });
  const data = await upstream.json().catch(() => ({ success: false }));
  const res = NextResponse.json(data, { status: upstream.status });
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);
  return res;
}

export async function DELETE(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const body = await req.json().catch(() => ({}));
  const upstream = await fetch(`${phpBase}/bookmarks.php`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(body),
  });
  const data = await upstream.json().catch(() => ({ success: false }));
  const res = NextResponse.json(data, { status: upstream.status });
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);
  return res;
}


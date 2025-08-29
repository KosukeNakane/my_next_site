import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const phpBase = process.env.NEXT_PUBLIC_PHP_BASE_URL || "http://localhost:8888";
  const cookie = req.headers.get("cookie") || "";
  const upstream = await fetch(`${phpBase}/php/logout.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookie,
    },
    body: JSON.stringify({}),
  });
  const data = await upstream.json().catch(() => ({ success: false }));
  const res = NextResponse.json(data, { status: upstream.status });
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("set-cookie", setCookie);
  }
  return res;
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const phpBase = process.env.NEXT_PUBLIC_PHP_BASE_URL || "http://localhost:8888";
  const body = await req.json().catch(() => ({}));
  const cookie = req.headers.get("cookie") || "";

  const upstream = await fetch(`${phpBase}/php/login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookie,
    },
    body: JSON.stringify(body),
  });

  // Forward JSON body
  const text = await upstream.text();
  console.log("PHP response:", text);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { success: false, error: "Invalid JSON", raw: text };
  }
  const res = NextResponse.json(data, { status: upstream.status });

  // Forward Set-Cookie from PHP to the browser (session handling)
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("set-cookie", setCookie);
  }
  return res;
}

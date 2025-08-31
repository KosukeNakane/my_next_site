import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const phpBase = process.env.NEXT_PUBLIC_PHP_BASE_URL || "http://localhost:8888/php";
  const cookie = req.headers.get("cookie") || "";
  const upstream = await fetch(`${phpBase}/session.php`, {
    headers: { Cookie: cookie },
    cache: "no-store",
  });
  const data = await upstream.json().catch(() => ({ logged_in: false }));
  return NextResponse.json(data, { status: upstream.status });
}

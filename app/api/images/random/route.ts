import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function listImages(dir: string, base: string, out: string[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    const rel = path.join(base, e.name);
    if (e.isDirectory()) {
      // limit recursion depth implicitly by directory structure
      listImages(full, rel, out);
    } else {
      const ext = e.name.toLowerCase();
      if (ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp')) {
        out.push('/' + rel.replace(/\\/g, '/'));
      }
    }
  }
}

export async function GET() {
  try {
    const root = path.join(process.cwd(), 'public', 'images');
    const images: string[] = [];
    if (fs.existsSync(root)) listImages(root, 'images', images);
    if (images.length === 0) {
      return NextResponse.json({ success: true, image: null, items: [] });
    }
    const pick = images[Math.floor(Math.random() * images.length)];
    return NextResponse.json({ success: true, image: pick, items: images });
  } catch {
    return NextResponse.json({ success: false, error: 'failed_to_list' }, { status: 500 });
  }
}

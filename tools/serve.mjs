/**
 * Zero-dependency static server for previewing the GitHub Pages export.
 *
 * It mounts `out/` under the same basePath the site is built with, so the
 * export is exercised exactly as GitHub Pages will serve it:
 *
 *   node tools/serve.mjs            # http://localhost:4321/hero3d-landing/
 *   node tools/serve.mjs 5000       # different port
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const port = Number(process.argv[2] ?? 4321);
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "/hero3d-landing").replace(/\/$/, "");
const root = resolve(new URL("../out", import.meta.url).pathname.replace(/^\/(\w:)/, "$1"));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function resolveFile(pathname) {
  const rel = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, "");
  const target = join(root, rel);
  // Refuse anything that escapes the export directory.
  if (!target.startsWith(root + sep) && target !== root) return null;
  if (existsSync(target) && statSync(target).isFile()) return target;
  const index = join(target, "index.html");
  if (existsSync(index)) return index;
  return null;
}

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let pathname = url.pathname;

  if (base && (pathname === base || pathname.startsWith(`${base}/`))) {
    pathname = pathname.slice(base.length) || "/";
  }

  let file = resolveFile(pathname) ?? resolveFile(`${pathname}.html`);
  let status = 200;
  if (!file) {
    file = join(root, "404.html");
    status = 404;
  }

  res.writeHead(status, {
    "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log(`serving ./out at http://localhost:${port}${base}/`);
});

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3002;

// Minimal .env loader (preview/.env). Keeps the preview server dependency-free.
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const CONTENT_FILE = path.join(__dirname, "data", "content.json");
const UPLOAD_DIR = path.join(__dirname, "images", "uploads");
const MAX_JSON_BYTES = 1024 * 1024;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const UPLOAD_EXT = new Set([".webp", ".jpg", ".jpeg", ".png"]);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const sessions = new Map(); // token -> expiry (ms)
const SESSION_MS = 8 * 60 * 60 * 1000;
const loginAttempts = new Map(); // ip -> { count, resetAt }

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("too_large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function isAuthed(req) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  const exp = sessions.get(token);
  if (!exp) return false;
  if (exp < Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function validateContent(c) {
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  if (!isObj(c)) return "Content must be an object";
  for (const k of ["announcement", "hero", "collections", "bench", "contact"]) {
    if (!isObj(c[k])) return `Missing section: ${k}`;
  }
  if (!Array.isArray(c.collections.items)) return "collections.items must be a list";
  if (!Array.isArray(c.hero.facts)) return "hero.facts must be a list";
  if (!isObj(c.bench.pieces) || !isObj(c.bench.sizes)) return "bench.pieces and bench.sizes are required";
  for (const [key, p] of Object.entries(c.bench.pieces)) {
    for (const f of ["baseWeight", "silverPrice", "vermeilPrice"]) {
      if (typeof p[f] !== "number" || !isFinite(p[f]) || p[f] < 0) return `bench.pieces.${key}.${f} must be a non-negative number`;
    }
  }
  for (const [key, s] of Object.entries(c.bench.sizes)) {
    if (typeof s.weightFactor !== "number" || !isFinite(s.weightFactor) || s.weightFactor <= 0) return `bench.sizes.${key}.weightFactor must be a positive number`;
  }
  if (!/^\d{8,15}$/.test(String(c.contact.whatsapp || ""))) return "WhatsApp must be digits only with country code (8 to 15 digits)";
  return null;
}

async function handleApi(req, res, pathname) {
  if (pathname === "/api/content" && req.method === "GET") {
    try {
      return sendJson(res, 200, JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8")));
    } catch {
      return sendJson(res, 500, { error: "Content file unreadable" });
    }
  }

  if (pathname === "/api/login" && req.method === "POST") {
    if (!ADMIN_PASSWORD) return sendJson(res, 503, { error: "ADMIN_PASSWORD is not set in preview/.env" });
    const ip = req.socket.remoteAddress || "local";
    const now = Date.now();
    const rec = loginAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
    if (rec.resetAt < now) { rec.count = 0; rec.resetAt = now + 15 * 60 * 1000; }
    if (rec.count >= 8) return sendJson(res, 429, { error: "Too many attempts. Try again in a few minutes." });
    let body;
    try { body = JSON.parse((await readBody(req, 4096)).toString("utf8")); } catch { return sendJson(res, 400, { error: "Bad request" }); }
    if (typeof body.password !== "string" || !safeEqual(body.password, ADMIN_PASSWORD)) {
      rec.count += 1;
      loginAttempts.set(ip, rec);
      return sendJson(res, 401, { error: "Incorrect password" });
    }
    loginAttempts.delete(ip);
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, Date.now() + SESSION_MS);
    return sendJson(res, 200, { token });
  }

  if (pathname === "/api/logout" && req.method === "POST") {
    const h = req.headers.authorization || "";
    sessions.delete(h.startsWith("Bearer ") ? h.slice(7) : "");
    return sendJson(res, 200, { ok: true });
  }

  if (pathname === "/api/session" && req.method === "GET") {
    return sendJson(res, isAuthed(req) ? 200 : 401, { ok: isAuthed(req) });
  }

  if (pathname === "/api/content" && req.method === "PUT") {
    if (!isAuthed(req)) return sendJson(res, 401, { error: "Unauthorized" });
    let content;
    try { content = JSON.parse((await readBody(req, MAX_JSON_BYTES)).toString("utf8")); }
    catch (e) { return sendJson(res, e.message === "too_large" ? 413 : 400, { error: "Invalid JSON body" }); }
    const problem = validateContent(content);
    if (problem) return sendJson(res, 422, { error: problem });
    try {
      if (fs.existsSync(CONTENT_FILE)) fs.copyFileSync(CONTENT_FILE, CONTENT_FILE.replace(/\.json$/, ".backup.json"));
      const tmp = CONTENT_FILE + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(content, null, 2) + "\n");
      fs.renameSync(tmp, CONTENT_FILE);
    } catch {
      return sendJson(res, 500, { error: "Could not write content file" });
    }
    return sendJson(res, 200, { ok: true });
  }

  if (pathname === "/api/upload" && req.method === "POST") {
    if (!isAuthed(req)) return sendJson(res, 401, { error: "Unauthorized" });
    const rawName = decodeURIComponent(String(req.headers["x-filename"] || ""));
    const ext = path.extname(rawName).toLowerCase();
    if (!UPLOAD_EXT.has(ext)) return sendJson(res, 415, { error: "Only .webp, .jpg, .jpeg, .png are allowed" });
    let buf;
    try { buf = await readBody(req, MAX_UPLOAD_BYTES); } catch { return sendJson(res, 413, { error: "File is larger than 5 MB" }); }
    const isImage =
      (ext === ".png" && buf.slice(0, 4).toString("hex") === "89504e47") ||
      ((ext === ".jpg" || ext === ".jpeg") && buf.slice(0, 3).toString("hex") === "ffd8ff") ||
      (ext === ".webp" && buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP");
    if (!isImage) return sendJson(res, 415, { error: "File content does not match its extension" });
    const base = path.basename(rawName, ext).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "image";
    const name = `${base}-${Date.now().toString(36)}${ext}`;
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);
    return sendJson(res, 200, { path: `images/uploads/${name}` });
  }

  return sendJson(res, 404, { error: "Not found" });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname;
  try { pathname = decodeURIComponent(parsedUrl.pathname); } catch { res.writeHead(400); res.end("Bad request"); return; }

  if (pathname.startsWith("/api/")) {
    try { return await handleApi(req, res, pathname); }
    catch { return sendJson(res, 500, { error: "Server error" }); }
  }

  if (pathname === "/") pathname = "/index.html";
  if (pathname === "/admin") pathname = "/admin.html";

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "").replace(/^\/+/, "");
  let filePath;
  const isAllowedRoot = safePath.startsWith("old/") || safePath.startsWith("assets/");
  if (isAllowedRoot) {
    filePath = path.join(__dirname, "..", safePath);
  } else {
    filePath = path.join(__dirname, safePath);
  }

  const baseDir = isAllowedRoot ? path.resolve(__dirname, "..") : __dirname;
  const rel = path.relative(baseDir, filePath);
  const blocked =
    rel.startsWith("..") ||
    path.isAbsolute(rel) ||
    rel.split(path.sep).some((seg) => seg.startsWith(".")) ||
    rel === "server.mjs" ||
    rel.endsWith(".backup.json") ||
    rel.endsWith(".env");

  fs.stat(filePath, (err, stats) => {
    if (blocked || err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Artfuli Jewelry Preview Server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin ${ADMIN_PASSWORD ? "" : "(set ADMIN_PASSWORD in preview/.env to enable login)"}`);
});

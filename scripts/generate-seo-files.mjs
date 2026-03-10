import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const gamesConfigPath = path.join(projectRoot, "src", "app", "constants", "games.json");

function sanitizeUrl(url) {
  return (url || "").trim().replace(/\/+$/, "");
}

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const env = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex < 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    env[key] = value.replace(/^['"]|['"]$/g, "");
  }

  return env;
}

function getSiteUrl() {
  const prodEnv = readEnvFile(path.join(projectRoot, ".env.prod"));
  const defaultEnv = readEnvFile(path.join(projectRoot, ".env"));

  return (
    sanitizeUrl(process.env.VITE_PUBLIC_APP_URL) ||
    sanitizeUrl(prodEnv.VITE_PUBLIC_APP_URL) ||
    sanitizeUrl(defaultEnv.VITE_PUBLIC_APP_URL) ||
    "https://chesspuzzledirectory.com"
  );
}

function buildUrl(baseUrl, routePath) {
  const normalizedPath = routePath.startsWith("/") ? routePath : `/${routePath}`;
  return `${baseUrl}${normalizedPath}`;
}

function generateSitemapXml(baseUrl, routes, lastmod) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const route of routes) {
    lines.push("  <url>");
    lines.push(`    <loc>${buildUrl(baseUrl, route.path)}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    lines.push(`    <priority>${route.priority}</priority>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  lines.push("");
  return lines.join("\n");
}

function generateRobotsTxt(baseUrl) {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "Disallow: /account",
    "Disallow: /profile",
    "Disallow: /chat",
    "Disallow: /login/",
    "",
    `Sitemap: ${baseUrl}/sitemap.xml`,
    `Host: ${new URL(baseUrl).host}`,
    "",
  ].join("\n");
}

function main() {
  const baseUrl = getSiteUrl();
  const lastmod = new Date().toISOString().slice(0, 10);
  const games = JSON.parse(fs.readFileSync(gamesConfigPath, "utf8"));

  const routes = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    ...games.map((game) => ({
      path: game.path,
      changefreq: "weekly",
      priority: "0.9",
    })),
    { path: "/leaderboard", changefreq: "weekly", priority: "0.7" },
    { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
    { path: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
  ];

  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(
    path.join(publicDir, "sitemap.xml"),
    generateSitemapXml(baseUrl, routes, lastmod),
    "utf8"
  );
  fs.writeFileSync(path.join(publicDir, "robots.txt"), generateRobotsTxt(baseUrl), "utf8");

  console.log(`Generated SEO files in public/ for ${baseUrl}`);
}

main();

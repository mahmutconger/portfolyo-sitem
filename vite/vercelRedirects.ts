import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Connect, Plugin } from "vite";

export interface VercelRedirect {
  source: string;
  destination: string;
  statusCode?: number;
  permanent?: boolean;
}

export interface VercelHeaderRule {
  source: string;
  headers: { key: string; value: string }[];
}

interface VercelConfig {
  redirects: VercelRedirect[];
  headers: VercelHeaderRule[];
}

// `vercel.json` içindeki yönlendirme ve başlık kurallarını yerel geliştirme
// ve önizleme sunucusunda da uygular. Böylece eski CV adresi ve CV önbellek
// başlıkları testlerde yayındaki gibi davranır; kurallar tek yerde kalır.
export function readVercelConfig(root = process.cwd()): VercelConfig {
  const config = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
  return {
    redirects: Array.isArray(config.redirects) ? config.redirects : [],
    headers: Array.isArray(config.headers) ? config.headers : [],
  };
}

/** Vercel kaynak kalıbını ("/cv/(.*)") tam eşleşen bir düzenli ifadeye çevirir. */
export const sourcePattern = (source: string): RegExp => new RegExp(`^${source}$`);

/** Vercel'in varsayılanları: statusCode yoksa permanent → 308, değilse 307. */
export const redirectStatus = (rule: VercelRedirect): number =>
  rule.statusCode ?? (rule.permanent ? 308 : 307);

function middleware({ redirects, headers }: VercelConfig): Connect.NextHandleFunction {
  const headerRules = headers.map((rule) => ({ ...rule, pattern: sourcePattern(rule.source) }));
  const redirectRules = redirects.map((rule) => ({ ...rule, pattern: sourcePattern(rule.source) }));
  return (req, res, next) => {
    const path = decodeURIComponent(req.url?.split("?")[0] ?? "");
    // Vercel'deki gibi başlıklar yönlendirme yanıtlarına da eklenir.
    for (const rule of headerRules) {
      if (rule.pattern.test(path))
        rule.headers.forEach(({ key, value }) => res.setHeader(key, value));
    }
    const match = redirectRules.find((rule) => rule.pattern.test(path));
    if (!match) return next();
    res.statusCode = redirectStatus(match);
    res.setHeader("Location", match.destination);
    res.end();
  };
}

export default function vercelRedirects(): Plugin {
  const config = readVercelConfig();
  return {
    name: "vercel-redirects",
    configureServer(server) {
      server.middlewares.use(middleware(config));
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(config));
    },
  };
}

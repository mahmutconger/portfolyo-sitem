import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Connect, Plugin } from "vite";

interface VercelRedirect {
  source: string;
  destination: string;
  permanent?: boolean;
}

// `vercel.json` içindeki yönlendirmeleri yerel geliştirme ve önizleme
// sunucusunda da uygular. Böylece eski CV adresi testlerde yayındaki gibi
// davranır ve kurallar tek yerde (vercel.json) kalır.
export function readVercelRedirects(root = process.cwd()): VercelRedirect[] {
  const config = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
  return Array.isArray(config.redirects) ? config.redirects : [];
}

function middleware(redirects: VercelRedirect[]): Connect.NextHandleFunction {
  return (req, res, next) => {
    const path = req.url?.split("?")[0];
    const match = redirects.find((rule) => rule.source === path);
    if (!match) return next();
    res.statusCode = match.permanent ? 308 : 307;
    res.setHeader("Location", match.destination);
    res.end();
  };
}

export default function vercelRedirects(): Plugin {
  const redirects = readVercelRedirects();
  return {
    name: "vercel-redirects",
    configureServer(server) {
      server.middlewares.use(middleware(redirects));
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(redirects));
    },
  };
}

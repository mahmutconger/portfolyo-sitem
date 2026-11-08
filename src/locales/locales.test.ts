import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import tr from "./tr.json";
import en from "./en.json";
import { sectionIds } from "../content/sections";
import { projects } from "../content/projects";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((all, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") all[path] = value;
    else Object.assign(all, flatten(value, path));
    return all;
  }, {});
}

const trKeys = flatten(tr as Tree);
const enKeys = flatten(en as Tree);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("çeviri dosyaları", () => {
  it("her TR anahtarının EN karşılığı var", () => {
    const missing = Object.keys(trKeys).filter((key) => !(key in enKeys));
    expect(missing).toEqual([]);
  });

  it("her EN anahtarının TR karşılığı var", () => {
    const missing = Object.keys(enKeys).filter((key) => !(key in trKeys));
    expect(missing).toEqual([]);
  });

  it("hiçbir çeviri boş değil", () => {
    const empty = [
      ...Object.entries(trKeys).filter(([, value]) => !value.trim()).map(([key]) => `tr:${key}`),
      ...Object.entries(enKeys).filter(([, value]) => !value.trim()).map(([key]) => `en:${key}`),
    ];
    expect(empty).toEqual([]);
  });

  it("kodda sabit yazılmış her t(\"…\") anahtarı çeviri dosyasında var", () => {
    const pattern = /\bt\(\s*["'`]([a-z_]+(?:\.[A-Za-z_]+)+)["'`]/g;
    const used = new Set<string>();
    // Admin paneli kapsam dışıdır; kendi varsayılan metinleriyle çalışır.
    const files = sourceFiles(resolve(__dirname, "..")).filter(
      (file) => !/pages[\\/]Admin\.tsx$|AnalyticsTab\.tsx$/.test(file),
    );
    for (const file of files) {
      for (const match of readFileSync(file, "utf8").matchAll(pattern)) used.add(match[1]);
    }
    const missing = [...used].filter((key) => !(key in trKeys));
    expect(missing).toEqual([]);
  });

  it("dinamik anahtarlar (bölüm, proje türü, bağlantı türü) tanımlı", () => {
    const dynamic = [
      ...sectionIds.map((id) => `nav.${id}`),
      ...projects.map((project) => `projects.kind.${project.kind}`),
      ...projects.flatMap((project) => project.links.map((link) => `projects.links.${link.kind}`)),
    ];
    expect(dynamic.filter((key) => !(key in trKeys) || !(key in enKeys))).toEqual([]);
  });
});

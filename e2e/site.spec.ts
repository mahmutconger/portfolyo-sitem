import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";
import { sectionIds } from "../src/content/sections";
import { projects } from "../src/content/projects";
import { cvDocuments, legacyCvPaths } from "../src/content/cv";

const mediumFixture = readFileSync(
  fileURLToPath(new URL("./fixtures/medium.json", import.meta.url)),
  "utf8",
);

const firestoreWrites: string[] = [];

/**
 * Ağ kuralları:
 * - Firestore ve Storage istekleri kesilir; testler canlı veriye dokunmaz.
 *   Bir yazma isteği görülürse test başarısız olur.
 * - Medium RSS sabit bir dosyayla yanıtlanır.
 */
test.beforeEach(async ({ page }) => {
  firestoreWrites.length = 0;
  await page.route(/firestore\.googleapis\.com|firebasestorage\.googleapis\.com/, (route) => {
    const url = route.request().url();
    if (/\/Write\/|:commit|:batchWrite/.test(url)) firestoreWrites.push(url);
    return route.abort();
  });
  await page.route(/api\.rss2json\.com/, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: mediumFixture }),
  );
  await page.addInitScript(() => {
    try {
      localStorage.setItem("appLang", "tr");
    } catch {
      // Depolama kapalıysa varsayılan dil Türkçedir.
    }
  });
});

test.afterEach(() => {
  expect(firestoreWrites, "Canlı Firestore'a yazma isteği gönderilmemeli").toEqual([]);
});

async function openSection(page: Page, id: string) {
  await page.goto(`/#${id}`);
  const heading = page.locator("#active-card [data-section-heading]").first();
  await expect(heading).toBeVisible();
  return heading;
}

async function expectNoBrokenImages(page: Page) {
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete),
  );
  const broken = await page.evaluate(() =>
    Array.from(document.images)
      .filter((image) => image.naturalWidth === 0 && image.dataset.fallback !== "true")
      .map((image) => image.currentSrc || image.src),
  );
  expect(broken).toEqual([]);
}

test("yedi bölümün hepsi açılıyor ve sayaç doğru", async ({ page }) => {
  for (const [index, id] of sectionIds.entries()) {
    await openSection(page, id);
    await expect(page.locator(".card-page")).toHaveText(
      `${String(index + 1).padStart(2, "0")} / ${String(sectionIds.length).padStart(2, "0")}`,
    );
  }
  await expect(page.locator(".dock-item")).toHaveCount(sectionIds.length);
});

test("hero, sayfa başlığı ve meta açıklaması CV ile uyumlu", async ({ page }) => {
  await openSection(page, "home");
  await expect(page).toHaveTitle("Mahmut Can Çönger | Yazılım Mühendisliği Öğrencisi");
  await expect(page.locator(".hero-role")).toHaveText("Yazılım Mühendisliği Öğrencisi");
  await expect(page.locator(".hero-availability")).toContainText(
    "Şubat–Haziran 2027 uzun dönem İME'ye uygun · Mezuniyet: Haziran 2027",
  );
  await expect(page.locator(".home-bottom")).toContainText("Kotlin Multiplatform");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Kotlin, Jetpack Compose ve Kotlin Multiplatform/,
  );

  await page.getByRole("button", { name: "İngilizceye geç" }).click();
  await expect(page).toHaveTitle("Mahmut Can Çönger | Software Engineering Student");
  await expect(page.locator(".hero-role")).toHaveText("Software Engineering Student");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Software Engineering student/,
  );
});

test("hiçbir bölümde kırık görsel yok", async ({ page }) => {
  for (const id of sectionIds) {
    await openSection(page, id);
    await expectNoBrokenImages(page);
  }
  await openSection(page, "projects");
  await page.getByRole("button", { name: "Tüm Projeleri Görüntüle" }).click();
  await expect(page.locator(".project-small")).toHaveCount(projects.length);
  await expectNoBrokenImages(page);
  for (const project of projects) {
    await page.goto(`/?project=${project.id}#projects`);
    await expect(page.getByTestId(`project-detail-${project.id}`)).toBeVisible();
    await expectNoBrokenImages(page);
  }
});

test("CV menüsü üç PDF sunuyor ve hepsi 200 + application/pdf", async ({ page, request }) => {
  await openSection(page, "home");
  await page.locator(".hero-actions").getByRole("button", { name: "Diğer CV seçenekleri" }).click();
  const items = page.getByRole("menuitem");
  await expect(items).toHaveCount(3);
  const hrefs = await items.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );
  expect(hrefs).toEqual(cvDocuments.map((cv) => cv.href));
  for (const href of hrefs) {
    const response = await request.get(href!);
    expect(response.status(), href!).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  }

  await openSection(page, "contact");
  await page.locator(".cv-menu-tile").getByRole("button", { name: "Diğer CV seçenekleri" }).click();
  await expect(page.getByRole("menuitem")).toHaveCount(3);
});

test("eski CV adresleri mobil CV'ye yönleniyor", async ({ request }) => {
  for (const path of legacyCvPaths) {
    const redirect = await request.get(path, { maxRedirects: 0 });
    expect(redirect.status()).toBe(307);
    expect(redirect.headers().location).toBe("/cv/Mahmut_Can_Conger_CV_Mobil.pdf");
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  }
});

test("Deneyim bölümü ZNOSOFT'u ve freelance projelerini gösteriyor", async ({ page }) => {
  await openSection(page, "experience");
  await expect(page.getByTestId("experience-znosoft")).toContainText("ZNOSOFT");
  const freelance = page.getByTestId("experience-freelance");
  await expect(freelance).toContainText("Freelance Mobil Geliştirici");
  await freelance.getByRole("link", { name: /WalkTalk/ }).click();
  await expect(page).toHaveURL(/\?project=walktalk#projects$/);
  await expect(page.getByTestId("project-detail-walktalk")).toBeVisible();
});

test("'Kaynak Kod' / 'Source Code' hiçbir zaman Google Play'e gitmiyor", async ({ page }) => {
  for (const language of ["tr", "en"] as const) {
    await page.addInitScript((lang) => localStorage.setItem("appLang", lang), language);
    for (const project of projects) {
      await page.goto(`/?project=${project.id}#projects`);
      const detail = page.getByTestId(`project-detail-${project.id}`);
      await expect(detail).toBeVisible();
      const sourceLinks = detail.getByRole("link", { name: /Kaynak Kod|Source Code/ });
      const targets = await sourceLinks.evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? ""),
      );
      for (const href of targets) expect(href).not.toContain("play.google.com");
    }
  }
  await page.goto("/?project=walktalk#projects");
  const play = page.getByTestId("project-detail-walktalk").getByRole("link", { name: /Google Play/ });
  await expect(play).toHaveAttribute("href", /play\.google\.com/);
});

test("proje kartlarında tür, tarih ve durum var; İngilizcede başlıklar çevrilmiş", async ({ page }) => {
  await openSection(page, "projects");
  await page.getByRole("button", { name: "Tüm Projeleri Görüntüle" }).click();
  const tiles = page.locator(".project-small");
  await expect(tiles).toHaveCount(projects.length);
  for (const project of projects) {
    const tile = page.getByTestId(`project-tile-${project.id}`);
    await expect(tile.locator(".project-kind")).not.toBeEmpty();
    await expect(tile.locator(".project-meta")).toContainText(/20\d\d/);
    await expect(tile.locator(".project-status")).toContainText(project.status.tr);
  }
  await expect(page.getByTestId("project-tile-timofy")).toContainText("Timofy");
  await expect(page.locator("body")).not.toContainText("Memories Book:");

  await page.getByRole("button", { name: "İngilizceye geç" }).click();
  await expect(page.getByTestId("project-tile-walktalk")).toContainText("Client project");
  await expect(page.getByTestId("project-tile-walktalk")).toContainText("Real-time voice translation");
  await expect(page.getByTestId("project-tile-smartexam")).toContainText("Graduation thesis");
});

test("LinkedIn bağlantıları yeni adresi kullanıyor", async ({ page }) => {
  for (const id of ["home", "contact"]) {
    await openSection(page, id);
    const hrefs = await page
      .locator('a[href*="linkedin.com/in/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(href).toBe("https://www.linkedin.com/in/mahmut-can-conger/");
  }
});

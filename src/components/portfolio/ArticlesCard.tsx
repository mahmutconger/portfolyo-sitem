import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, BookOpen, Clock3 } from "../ui/icons";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { EmptyState, LoadingCards, SectionHeading } from "./shared";
import { stagger } from "./motion";

interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  description?: string;
  content?: string;
}
const feed =
  "https://api.rss2json.com/v1/api.json?rss_url=" +
  encodeURIComponent("https://medium.com/feed/@mahmutconger");
let cachedArticles: Article[] | undefined;
const plainText = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").body.textContent || "";
export default function ArticlesCard() {
  const { t, i18n } = useTranslation();
  const tr = i18n.language.startsWith("tr");
  const [articles, setArticles] = useState<Article[]>(cachedArticles || []);
  const [status, setStatus] = useState(cachedArticles ? "ok" : "loading");
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<Article | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (cachedArticles) return;
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    (async () => {
      try {
        const response = await fetch(feed, { signal: controller.signal });
        if (!response.ok) throw new Error("Makaleler alınamadı");
        const result = await response.json();
        if (result.status !== "ok" || !Array.isArray(result.items))
          throw new Error("Geçersiz makale verisi");
        if (active) {
          cachedArticles = result.items;
          setArticles(result.items);
          setStatus("ok");
        }
      } catch {
        if (active) setStatus("error");
      } finally {
        window.clearTimeout(timeout);
      }
    })();
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [retry]);
  const close = () => {
    setSelected(null);
    window.setTimeout(() => opener.current?.focus(), 50);
  };
  useEffect(() => {
    if (!selected) return;
    heading.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        window.setTimeout(() => opener.current?.focus(), 50);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [selected]);
  function date(value: string) {
    const d = new Date(value);
    return Number.isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString(tr ? "tr-TR" : "en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  }
  function thumbnail(article: Article) {
    return (
      article.thumbnail ||
      new DOMParser()
        .parseFromString(
          article.content || article.description || "",
          "text/html",
        )
        .querySelector("img")?.src
    );
  }
  return (
    <motion.div
      className="section-content articles-content"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div hidden={!!selected}>
        <SectionHeading
          number="05"
          eyebrow={tr ? "NOTLAR & DENEYİMLER" : "NOTES & EXPERIENCES"}
          title={
            <>
              {tr ? "Öğren. Üret. " : "Learn. Build. "}
              <em>{tr ? "Paylaş." : "Share."}</em>
            </>
          }
          description={t("articles.subtitle")}
        />
        {status === "loading" && <LoadingCards />}
        {status === "error" && (
          <EmptyState
            title={t("articles.error")}
            onRetry={() => {
              setStatus("loading");
              setRetry((v) => v + 1);
            }}
          >
            <a
              className="text-link"
              href="https://medium.com/@mahmutconger"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("articles.visit_medium")}
              <ArrowUpRight size={16} />
            </a>
          </EmptyState>
        )}
        {status === "ok" && articles.length === 0 && (
          <EmptyState title={t("articles.empty")} />
        )}
        {status === "ok" && (
          <div className="article-list">
            {articles.map((article, index) => (
              <motion.button
                className="article-row"
                key={article.link}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setSelected(article);
                }}
              >
                <span className="article-index mono">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="article-thumb">
                  {thumbnail(article) ? (
                    <img src={thumbnail(article)} alt="" loading="lazy" />
                  ) : (
                    <BookOpen size={28} />
                  )}
                </div>
                <div className="article-row-copy">
                  <span className="article-date mono">
                    {date(article.pubDate)} <i /> Medium
                  </span>
                  <h2>{article.title}</h2>
                  <p>
                    {plainText(
                      article.description || article.content || "",
                    ).slice(0, 150)}
                    …
                  </p>
                  <span className="article-time">
                    <Clock3 size={12} />
                    {Math.max(
                      1,
                      Math.ceil(
                        plainText(
                          article.content || article.description || "",
                        ).split(/\s+/).length / 200,
                      ),
                    )}{" "}
                    {tr ? "dk okuma" : "min read"}
                  </span>
                </div>
                <span className="article-arrow">
                  <ArrowUpRight size={23} />
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <motion.article
          className="article-detail"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="text-link back-link" onClick={close}>
            <ArrowLeft size={17} />
            {tr ? "Makalelere dön" : "Back to articles"}
          </button>
          <span className="eyebrow">
            MEDIUM <span>/</span> {date(selected.pubDate)}
          </span>
          <h1 ref={heading} tabIndex={-1}>
            {selected.title}
          </h1>
          <div className="article-author">
            <img src="/profile.jpg" alt="" />
            <span>
              Mahmut Can Çönger<small>Android Developer</small>
            </span>
          </div>
          <div
            className="article-body"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                selected.content || selected.description || "",
                {
                  USE_PROFILES: { html: true },
                  FORBID_TAGS: ["form", "input", "button", "style"],
                  FORBID_ATTR: ["style", "id"],
                },
              ),
            }}
          />
          <a
            className="button secondary"
            href={selected.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tr ? "Medium’da görüntüle" : "View on Medium"}
            <ArrowUpRight size={16} />
          </a>
        </motion.article>
      )}
    </motion.div>
  );
}

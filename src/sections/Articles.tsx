import { useEffect, useState } from 'react';
import { Newspaper, Calendar, ArrowUpRight, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ─────────────────────────────────────────────────────────────
   AYAR: Medium kullanıcı adını buraya yaz (@ olmadan).
   Özel domain / publication kullanıyorsan MEDIUM_FEED_URL'i
   doğrudan kendi RSS adresinle değiştirebilirsin.
   ───────────────────────────────────────────────────────────── */
const MEDIUM_USERNAME = 'mahmutconger';
const MEDIUM_FEED_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
  MEDIUM_FEED_URL,
)}`;

interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  excerpt: string;
}

/* rss2json cevabındaki ham item tipi (ihtiyacımız olan alanlar) */
interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  description?: string;
  content?: string;
}

/* HTML etiketlerini temizleyip kısa bir özet üretir */
const toExcerpt = (html: string, max = 140): string => {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
};

/* thumbnail boşsa içerikteki ilk görseli yakala */
const extractImage = (item: RssItem): string => {
  if (item.thumbnail) return item.thumbnail;
  const html = item.content || item.description || '';
  const match = html.match(/<img[^>]+src="([^">]+)"/i);
  return match ? match[1] : '';
};

const formatDate = (dateStr: string, locale: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/* ─── Article Card ───────────────────────────────────────────── */
const ArticleCard = ({ article, locale, readLabel }: {
  article: Article;
  locale: string;
  readLabel: string;
}) => (
  <a
    href={article.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 flex flex-col"
  >
    {/* Kapak görseli */}
    <div className="relative h-44 overflow-hidden bg-zinc-800 shrink-0">
      {article.thumbnail ? (
        <img
          src={article.thumbnail}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-zinc-700" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
      <span className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </div>

    {/* Gövde */}
    <div className="p-5 flex-1 flex flex-col">
      <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-2.5">
        <Calendar className="w-3.5 h-3.5" />
        {formatDate(article.pubDate, locale)}
      </div>
      <h3 className="text-white font-semibold mb-1.5 group-hover:text-indigo-300 transition-colors text-[15px] line-clamp-2">
        {article.title}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 flex-1">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-1 text-indigo-400 text-xs font-medium mt-4 group-hover:translate-x-1 transition-transform">
        {readLabel} <ArrowUpRight className="w-3.5 h-3.5" />
      </div>
    </div>
  </a>
);

/* ─── Articles Section ───────────────────────────────────────── */
const Articles = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    let active = true;

    const fetchArticles = async () => {
      try {
        const res = await fetch(RSS2JSON_URL);
        const data = await res.json();
        if (data.status !== 'ok' || !Array.isArray(data.items)) {
          throw new Error('RSS could not be parsed');
        }
        const mapped: Article[] = (data.items as RssItem[]).map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          thumbnail: extractImage(item),
          excerpt: toExcerpt(item.description || item.content || ''),
        }));
        if (active) {
          setArticles(mapped);
          setStatus('ok');
        }
      } catch (error) {
        console.error('Medium makaleleri alınamadı:', error);
        if (active) setStatus('error');
      }
    };

    fetchArticles();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="articles" className="py-28 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Başlık */}
        <div className="text-center mb-14">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5" />
            Blog
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            {t('articles.title')}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
            {t('articles.subtitle')}
          </p>
        </div>

        {/* Durumlar */}
        {status === 'loading' && (
          <div className="text-center py-16 text-zinc-500 animate-pulse text-sm">
            {t('articles.loading')}
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-sm mb-5">{t('articles.error')}</p>
            <a
              href={`https://medium.com/@${MEDIUM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
            >
              {t('articles.visit_medium')}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        )}

        {status === 'ok' && articles.length === 0 && (
          <div className="text-center py-16 text-zinc-500 text-sm">
            {t('articles.empty')}
          </div>
        )}

        {status === 'ok' && articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => (
                <ArticleCard
                  key={article.link}
                  article={article}
                  locale={i18n.language}
                  readLabel={t('articles.read')}
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <a
                href={`https://medium.com/@${MEDIUM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
              >
                {t('articles.view_all')}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Articles;

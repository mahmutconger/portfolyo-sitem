import React, { useEffect, useState, useMemo } from 'react';
import {
  collection, query, orderBy, limit,
  onSnapshot, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Eye, Users, Clock, Download, MousePointerClick,
  TrendingUp, Monitor, Smartphone, Globe2, RefreshCw,
  Activity, FileText, Github, Linkedin, Mail, ExternalLink,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RawEvent {
  id: string;
  type: string;
  page: string;
  target?: string;
  sessionId: string;
  referrer: string;
  device: 'mobile' | 'desktop';
  language: string;
  timestamp: Timestamp;
  duration?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseReferrer(ref: string): string {
  if (!ref) return 'Doğrudan';
  try {
    const hostname = new URL(ref).hostname.replace('www.', '');
    if (hostname.includes('google')) return 'Google';
    if (hostname.includes('linkedin')) return 'LinkedIn';
    if (hostname.includes('github')) return 'GitHub';
    if (hostname.includes('twitter') || hostname.includes('t.co')) return 'Twitter/X';
    return hostname;
  } catch {
    return 'Diğer';
  }
}

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}d ${s % 60}s`;
}

function formatDate(ts: Timestamp | undefined): string {
  if (!ts) return '—';
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }).format(ts.toDate());
  } catch {
    return '—';
  }
}

function getLast14Days(): string[] {
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }));
  }
  return days;
}

const EVENT_LABELS: Record<string, string> = {
  page_view:      '📄 Sayfa Görüntüleme',
  section_view:   '👁️ Bölüm Görüntüleme',
  cv_download:    '📥 CV İndirme',
  project_click:  '📂 Proje Tıklama',
  social_click:   '🔗 Sosyal Tıklama',
  contact_submit: '✉️ Form Gönderimi',
  page_duration:  '⏱️ Sayfa Süresi',
};

const SECTION_LABELS: Record<string, string> = {
  home: 'Hero / Ana',
  about: 'Hakkımda',
  tech: 'Tech Stack',
  projects: 'Projeler',
  articles: 'Makaleler',
  contact: 'İletişim',
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatCard = ({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) => (
  <div className={`bg-slate-900 border border-white/5 rounded-2xl p-5 flex items-start gap-4 hover:border-white/10 transition-colors`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-[11px] text-gray-600 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// Inline SVG bar chart (no dependency)
const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-28 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group" title={`${d.label}: ${d.value}`}>
          <div
            className="w-full bg-indigo-600/70 group-hover:bg-indigo-500 rounded-t transition-all duration-200"
            style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 4 : 0 }}
          />
          <span className="text-[8px] text-gray-600 rotate-45 origin-left mt-1 hidden md:block">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const ProgressRow = ({
  label, count, total, color = 'bg-indigo-500',
}: {
  label: string; count: number; total: number; color?: string;
}) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-10 text-right">{count}</span>
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────────
const AnalyticsTab: React.FC = () => {
  const [events, setEvents] = useState<RawEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<string>('all');

  // Firestore realtime listener — son 500 event
  useEffect(() => {
    const q = query(
      collection(db, 'analytics_events'),
      orderBy('timestamp', 'desc'),
      limit(500),
    );
    const unsub = onSnapshot(q, (snap) => {
      setEvents(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<RawEvent, 'id'>) })),
      );
      setLoading(false);
      setLastRefresh(new Date());
    });
    return () => unsub();
  }, []);

  // ── Derived metrics ──────────────────────────────────────────────────────
  const pageViews = useMemo(
    () => events.filter((e) => e.type === 'page_view').length,
    [events],
  );

  const uniqueVisitors = useMemo(
    () => new Set(events.map((e) => e.sessionId)).size,
    [events],
  );

  const avgDurationMs = useMemo(() => {
    const durations = events.filter((e) => e.type === 'page_duration' && e.duration);
    if (!durations.length) return 0;
    return durations.reduce((sum, e) => sum + (e.duration ?? 0), 0) / durations.length;
  }, [events]);

  const cvDownloads = useMemo(
    () => events.filter((e) => e.type === 'cv_download').length,
    [events],
  );

  // Günlük ziyaretçi (son 14 gün)
  const last14Days = getLast14Days();
  const dailyData = useMemo(() => {
    return last14Days.map((dayLabel) => {
      const count = events.filter((e) => {
        if (e.type !== 'page_view' || !e.timestamp) return false;
        const d = e.timestamp.toDate();
        const label = d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
        return label === dayLabel;
      }).length;
      return { label: dayLabel, value: count };
    });
  }, [events]);

  // Bölüm popülerliği
  const sectionStats = useMemo(() => {
    const sectionEvents = events.filter((e) => e.type === 'section_view' && e.target);
    const counts: Record<string, number> = {};
    sectionEvents.forEach((e) => {
      counts[e.target!] = (counts[e.target!] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);
  }, [events]);

  const maxSectionCount = Math.max(...sectionStats.map(([, c]) => c), 1);

  // Trafik kaynağı
  const trafficSources = useMemo(() => {
    const counts: Record<string, number> = {};
    events
      .filter((e) => e.type === 'page_view')
      .forEach((e) => {
        const src = parseReferrer(e.referrer);
        counts[src] = (counts[src] ?? 0) + 1;
      });
    return Object.entries(counts).sort(([, a], [, b]) => b - a);
  }, [events]);

  const maxTrafficCount = Math.max(...trafficSources.map(([, c]) => c), 1);

  // Cihaz dağılımı
  const mobileCount = events.filter((e) => e.device === 'mobile').length;
  const desktopCount = events.filter((e) => e.device === 'desktop').length;
  const totalDevices = mobileCount + desktopCount || 1;

  // Proje tıklama sayıları
  const projectStats = useMemo(() => {
    const counts: Record<string, number> = {};
    events.filter((e) => e.type === 'project_click' && e.target).forEach((e) => {
      counts[e.target!] = (counts[e.target!] ?? 0) + 1;
    });
    return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 5);
  }, [events]);
  const maxProjectCount = Math.max(...projectStats.map(([, c]) => c), 1);

  // Sosyal tıklama sayıları
  const socialStats = useMemo(() => {
    const counts: Record<string, number> = {};
    events.filter((e) => e.type === 'social_click' && e.target).forEach((e) => {
      counts[e.target!] = (counts[e.target!] ?? 0) + 1;
    });
    return counts;
  }, [events]);

  // Tablo için filtrelenmiş eventler
  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return events.slice(0, 100);
    return events.filter((e) => e.type === filterType).slice(0, 100);
  }, [events, filterType]);

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-500 gap-3">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Veriler yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Hareketler
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Son {events.length} event · Güncellendi: {lastRefresh.toLocaleTimeString('tr-TR')}
          </p>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Eye className="w-5 h-5 text-blue-400" />}
          label="Toplam Sayfa Görüntüleme"
          value={pageViews}
          color="bg-blue-500/10"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-purple-400" />}
          label="Tekil Ziyaretçi"
          value={uniqueVisitors}
          sub="oturum bazlı"
          color="bg-purple-500/10"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          label="Ort. Ziyaret Süresi"
          value={avgDurationMs > 0 ? formatDuration(avgDurationMs) : '—'}
          color="bg-amber-500/10"
        />
        <StatCard
          icon={<Download className="w-5 h-5 text-emerald-400" />}
          label="CV İndirme"
          value={cvDownloads}
          color="bg-emerald-500/10"
        />
      </div>

      {/* Grafik + Bölüm Popülerliği */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Günlük Ziyaretçi Bar Chart */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Günlük Sayfa Görüntüleme (Son 14 Gün)</h3>
          </div>
          <BarChart data={dailyData} />
        </div>

        {/* Bölüm Popülerliği */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <MousePointerClick className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">En Çok Görüntülenen Bölümler</h3>
          </div>
          <div className="space-y-3">
            {sectionStats.length === 0 ? (
              <p className="text-xs text-gray-600">Henüz bölüm verisi yok</p>
            ) : (
              sectionStats.map(([id, count]) => (
                <ProgressRow
                  key={id}
                  label={SECTION_LABELS[id] ?? id}
                  count={count}
                  total={maxSectionCount}
                  color="bg-indigo-500"
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Trafik Kaynakları + Cihaz + Sosyal */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Trafik Kaynağı */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Globe2 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">Trafik Kaynağı</h3>
          </div>
          <div className="space-y-3">
            {trafficSources.length === 0 ? (
              <p className="text-xs text-gray-600">Veri yok</p>
            ) : (
              trafficSources.map(([src, count]) => (
                <ProgressRow key={src} label={src} count={count} total={maxTrafficCount} color="bg-sky-500" />
              ))
            )}
          </div>
        </div>

        {/* Cihaz Dağılımı */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Monitor className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Cihaz Dağılımı</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Monitor className="w-4 h-4 text-emerald-400" />
                Masaüstü
              </div>
              <span className="text-sm font-bold text-white">
                {Math.round((desktopCount / totalDevices) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${(desktopCount / totalDevices) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Smartphone className="w-4 h-4 text-purple-400" />
                Mobil
              </div>
              <span className="text-sm font-bold text-white">
                {Math.round((mobileCount / totalDevices) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${(mobileCount / totalDevices) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sosyal + Proje Tıklamaları */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              Sosyal Tıklamalar
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'github', icon: <Github className="w-4 h-4" />, label: 'GitHub', color: 'text-white' },
                { key: 'linkedin', icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn', color: 'text-blue-400' },
                { key: 'email', icon: <Mail className="w-4 h-4" />, label: 'Email', color: 'text-red-400' },
              ].map(({ key, icon, label, color }) => (
                <div key={key} className="flex flex-col items-center gap-1 bg-slate-800 rounded-xl p-3">
                  <span className={color}>{icon}</span>
                  <span className="text-lg font-bold text-white">{socialStats[key] ?? 0}</span>
                  <span className="text-[10px] text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {projectStats.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                En Çok Tıklanan Proje
              </h3>
              <div className="space-y-2">
                {projectStats.map(([name, count]) => (
                  <ProgressRow
                    key={name}
                    label={name}
                    count={count}
                    total={maxProjectCount}
                    color="bg-amber-500"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Son Hareketler Tablosu */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-sm font-semibold text-white">Son Hareketler</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {['all', 'page_view', 'section_view', 'project_click', 'cv_download', 'social_click', 'contact_submit'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-gray-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'Tümü' : EVENT_LABELS[type] ?? type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-gray-500 font-medium px-5 py-3">Tarih</th>
                <th className="text-left text-gray-500 font-medium px-3 py-3">Olay</th>
                <th className="text-left text-gray-500 font-medium px-3 py-3">Hedef</th>
                <th className="text-left text-gray-500 font-medium px-3 py-3">Cihaz</th>
                <th className="text-left text-gray-500 font-medium px-3 py-3">Dil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-600 py-10">
                    Bu filtre için kayıt bulunamadı
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-2.5 text-gray-400 whitespace-nowrap">
                      {formatDate(ev.timestamp)}
                    </td>
                    <td className="px-3 py-2.5 text-gray-300 whitespace-nowrap">
                      {EVENT_LABELS[ev.type] ?? ev.type}
                    </td>
                    <td className="px-3 py-2.5 text-gray-400 max-w-[150px] truncate">
                      {ev.target ?? <span className="text-gray-700">—</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      {ev.device === 'mobile'
                        ? <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                        : <Monitor className="w-3.5 h-3.5 text-emerald-400" />}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 uppercase">{ev.language}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;

import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Layers3,
} from "../ui/icons";
import { useTranslation } from "react-i18next";
import { db, firebaseConfigured } from "../../firebase";
import { useAnalytics } from "../../hooks/useAnalytics";
import { EmptyState, LoadingCards, SectionHeading } from "./shared";
import { stagger } from "./motion";

type Localized = string | Record<string, string>;
interface Project {
  id: string;
  title: Localized;
  description: Localized;
  longDescription: Localized;
  image: string;
  gallery?: string[];
  tags?: string[];
  features?: string[] | Record<string, string[]>;
  githubUrl?: string;
  liveUrl?: string;
  linkedinUrl?: string;
  isFeatured?: boolean;
  createdAt?: { seconds: number };
}
let cachedProjects: Project[] | undefined;
export default function ProjectsCard() {
  const { t, i18n } = useTranslation();
  const tr = i18n.language.startsWith("tr");
  const local = (value?: Localized) =>
    typeof value === "string"
      ? value
      : value?.[tr ? "tr" : "en"] || value?.tr || value?.en || "";
  const [projects, setProjects] = useState<Project[]>(cachedProjects || []);
  const [status, setStatus] = useState(cachedProjects ? "ok" : "loading");
  const [retry, setRetry] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const [all, setAll] = useState(false);
  const [slide, setSlide] = useState(0);
  const { trackEvent } = useAnalytics();
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (cachedProjects) return;
    let active = true;
    const timer = window.setTimeout(() => {
      if (active) setStatus("error");
    }, 12000);
    (async () => {
      try {
        if (!firebaseConfigured)
          throw new Error("Firebase yapılandırması eksik");
        const result = await getDocs(collection(db, "projects"));
        const data = result.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }) as Project)
          .sort(
            (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
          );
        if (active) {
          cachedProjects = data;
          setProjects(data);
          setStatus("ok");
        }
      } catch {
        if (active) setStatus("error");
      } finally {
        window.clearTimeout(timer);
      }
    })();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [retry]);
  const close = () => {
    setSelected(null);
    window.setTimeout(() => opener.current?.focus(), 60);
  };
  useEffect(() => {
    if (!selected) return;
    detailHeading.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        window.setTimeout(() => opener.current?.focus(), 60);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [selected]);
  function open(project: Project, button: HTMLButtonElement) {
    opener.current = button;
    setSlide(0);
    setSelected(project);
    trackEvent("project_click", local(project.title));
  }
  const featured = projects.filter((p) => p.isFeatured);
  const showcase = featured.length ? featured : projects;
  const current = showcase[index % Math.max(1, showcase.length)];
  const gallery = selected
    ? (selected.gallery?.length ? selected.gallery : [selected.image]).filter(
        Boolean,
      )
    : [];
  const features = Array.isArray(selected?.features)
    ? selected.features
    : selected?.features?.[tr ? "tr" : "en"] || selected?.features?.tr || [];
  return (
    <motion.div
      className="section-content projects-content"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div hidden={!!selected}>
        <SectionHeading
          number="04"
          eyebrow={tr ? "SEÇİLMİŞ ÇALIŞMALAR" : "SELECTED WORK"}
          title={
            <>
              {tr ? "Fikirler, " : "Ideas, "}
              <em>{tr ? "hayata geçti." : "brought to life."}</em>
            </>
          }
          description={t("projects.featured_desc")}
        />
        {status === "loading" && <LoadingCards />}
        {status === "error" && (
          <EmptyState
            title={
              tr
                ? "Projeler şu anda yüklenemedi."
                : "Projects couldn’t be loaded."
            }
            onRetry={() => {
              setStatus("loading");
              setRetry((v) => v + 1);
            }}
          >
            <p>
              {tr
                ? "Çalışmaları GitHub üzerinden de inceleyebilirsin."
                : "You can also explore my work on GitHub."}
            </p>
            <a
              className="text-link"
              href="https://github.com/mahmutconger"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRight size={16} />
            </a>
          </EmptyState>
        )}
        {status === "ok" && !projects.length && (
          <EmptyState
            title={
              tr
                ? "Yeni projeler için yer açılıyor."
                : "Making room for new projects."
            }
          />
        )}
        {status === "ok" && current && (
          <>
            <div className="project-showcase">
              <div className="project-stack">
                <div className="project-stack-sheet sheet-two" />
                <div className="project-stack-sheet sheet-one" />
                <AnimatePresence mode="wait">
                  <motion.button
                    className="project-cover"
                    key={current.id}
                    initial={{ opacity: 0, rotate: -5, x: -20 }}
                    animate={{ opacity: 1, rotate: -2, x: 0 }}
                    exit={{ opacity: 0, rotate: 5, x: 20 }}
                    transition={{ duration: 0.25 }}
                    onClick={(e) => open(current, e.currentTarget)}
                    aria-label={`${local(current.title)} — ${t("projects.inspect")}`}
                  >
                    <img src={current.image} alt={local(current.title)} />
                    <span className="cover-open">
                      <ArrowUpRight size={20} />
                    </span>
                  </motion.button>
                </AnimatePresence>
                <span className="project-image-caption mono">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(showcase.length).padStart(2, "0")}{" "}
                  <span>{tr ? "FİKİRDEN UYGULAMAYA" : "FROM IDEA TO APP"}</span>
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  className="project-summary"
                  key={current.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className="eyebrow">
                    <Layers3 size={14} />
                    {t("projects.featured_badge")}
                  </span>
                  <h2 title={local(current.title)}>
                    {local(current.title).split(":")[0]}
                  </h2>
                  <p>{local(current.description)}</p>
                  <div className="tags">
                    {current.tags?.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <button
                    className="button primary"
                    onClick={(e) => open(current, e.currentTarget)}
                  >
                    {tr ? "Projeyi keşfet" : "Explore project"}
                    <ArrowUpRight size={17} />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="project-controls">
              <div className="project-pagination">
                <button
                  className="icon-button"
                  aria-label={tr ? "Önceki proje" : "Previous project"}
                  disabled={showcase.length < 2}
                  onClick={() =>
                    setIndex((index - 1 + showcase.length) % showcase.length)
                  }
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="mono">
                  {String(index + 1).padStart(2, "0")}{" "}
                  <span>/ {String(showcase.length).padStart(2, "0")}</span>
                </span>
                <button
                  className="icon-button"
                  aria-label={tr ? "Sonraki proje" : "Next project"}
                  disabled={showcase.length < 2}
                  onClick={() => setIndex((index + 1) % showcase.length)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <button
                className="text-link"
                aria-expanded={all}
                onClick={() => setAll(!all)}
              >
                {all
                  ? tr
                    ? "Listeyi gizle"
                    : "Hide list"
                  : t("projects.view_all")}
                <ArrowRight size={16} />
              </button>
            </div>
            {all && (
              <div className="project-grid">
                {projects.map((project) => (
                  <button
                    className="project-small glass-tile"
                    key={project.id}
                    onClick={(e) => open(project, e.currentTarget)}
                  >
                    <img src={project.image} alt="" loading="lazy" />
                    <h3>
                      {local(project.title)}
                      <ArrowUpRight size={16} />
                    </h3>
                    <p>{local(project.description)}</p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {selected && (
        <motion.article
          className="project-detail"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="text-link back-link" onClick={close}>
            <ArrowLeft size={17} />
            {tr ? "Projelere dön" : "Back to projects"}
          </button>
          <h1 tabIndex={-1} ref={detailHeading}>
            {local(selected.title)}
          </h1>
          <div className="tags">
            {selected.tags?.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {gallery.length > 0 && (
            <div className="project-gallery">
              <img
                src={gallery[slide]}
                alt={`${local(selected.title)} — ${slide + 1}`}
              />
              {gallery.length > 1 && (
                <div className="gallery-controls">
                  <button
                    className="icon-button"
                    aria-label={tr ? "Önceki görsel" : "Previous image"}
                    onClick={() =>
                      setSlide((slide - 1 + gallery.length) % gallery.length)
                    }
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="mono">
                    {slide + 1} / {gallery.length}
                  </span>
                  <button
                    className="icon-button"
                    aria-label={tr ? "Sonraki görsel" : "Next image"}
                    onClick={() => setSlide((slide + 1) % gallery.length)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="project-story">
            <div>
              <h2>{t("projects.story")}</h2>
              <p>
                {local(selected.longDescription) || local(selected.description)}
              </p>
            </div>
            {features.length > 0 && (
              <aside className="glass-tile">
                <h2>{t("projects.features")}</h2>
                <ul>
                  {features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
          <div className="detail-links">
            {selected.githubUrl && (
              <a
                className="button secondary"
                href={selected.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} />
                {t("projects.source_code")}
              </a>
            )}
            {selected.liveUrl && (
              <a
                className="button primary"
                href={selected.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("projects.demo")}
                <ArrowUpRight size={16} />
              </a>
            )}
            {selected.linkedinUrl && (
              <a
                className="button secondary"
                href={selected.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </motion.article>
      )}
    </motion.div>
  );
}

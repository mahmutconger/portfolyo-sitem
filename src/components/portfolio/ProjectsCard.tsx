import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Layers3,
  Linkedin,
  Smartphone,
  Globe,
  type PortfolioIcon,
} from "../ui/icons";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useLanguage } from "../../hooks/useLanguage";
import { useProjects, type ProjectWithMedia } from "../../hooks/useProjects";
import { formatPeriod } from "../../content/format";
import { projectHref } from "../../content/sections";
import type { Language, ProjectLinkKind } from "../../content/types";
import { SectionHeading } from "./shared";
import { stagger } from "./motion";
import ProjectImage from "./ProjectImage";

const linkIcons: Record<ProjectLinkKind, PortfolioIcon> = {
  website: Globe,
  googlePlay: Smartphone,
  source: Github,
  linkedin: Linkedin,
};

function ProjectMeta({
  project,
  language,
}: {
  project: ProjectWithMedia;
  language: Language;
}) {
  const { t } = useTranslation();
  return (
    <span className="project-meta mono">
      <span className="project-kind">{t(`projects.kind.${project.kind}`)}</span>
      <i />
      {formatPeriod(project.period, language)}
    </span>
  );
}

function ProjectStatus({
  project,
  language,
}: {
  project: ProjectWithMedia;
  language: Language;
}) {
  const { t } = useTranslation();
  return (
    <p className="project-status">
      <span className="status-light" aria-hidden="true" />
      <span className="sr-only">{t("projects.status")}: </span>
      {project.status[language]}
    </p>
  );
}

export default function ProjectsCard() {
  const { t } = useTranslation();
  const language = useLanguage();
  const projects = useProjects();
  const { trackEvent } = useAnalytics();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [all, setAll] = useState(false);
  const [slide, setSlide] = useState(0);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const selectedId = new URLSearchParams(search).get("project");
  const selected = projects.find((project) => project.id === selectedId) ?? null;
  const current = projects[index % Math.max(1, projects.length)];

  function open(project: ProjectWithMedia, trigger: HTMLElement) {
    opener.current = trigger;
    setSlide(0);
    trackEvent("project_click", project.title.en);
    navigate(projectHref(project.id));
  }

  useEffect(() => {
    if (!selected) return;
    detailHeading.current?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      navigate("/#projects", { replace: true });
      window.setTimeout(() => opener.current?.focus(), 60);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [selected, navigate]);

  const closeDetail = () => {
    navigate("/#projects");
    window.setTimeout(() => opener.current?.focus(), 60);
  };

  const gallery = selected
    ? selected.media.gallery.length
      ? selected.media.gallery
      : [selected.media.image]
    : [];
  const title = (project: ProjectWithMedia) => project.title[language];

  return (
    <motion.div
      className="section-content projects-content"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div hidden={!!selected}>
        <SectionHeading
          section="projects"
          eyebrow={t("projects.eyebrow")}
          title={
            <>
              {t("projects.title_a")}
              <em>{t("projects.title_b")}</em>
            </>
          }
          description={t("projects.description")}
        />
        {current && (
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
                    aria-label={`${title(current)} — ${t("projects.inspect")}`}
                  >
                    <ProjectImage src={current.media.image} alt={title(current)} />
                    <span className="cover-open">
                      <ArrowUpRight size={20} />
                    </span>
                  </motion.button>
                </AnimatePresence>
                <span className="project-image-caption mono">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}{" "}
                  <span>{t("projects.from_idea")}</span>
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  className="project-summary"
                  key={current.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  data-testid="project-summary"
                >
                  <span className="eyebrow">
                    <Layers3 size={14} />
                    <ProjectMeta project={current} language={language} />
                  </span>
                  <h2>{title(current)}</h2>
                  <p className="project-tagline">{current.tagline[language]}</p>
                  <p>{current.summary[language]}</p>
                  <ProjectStatus project={current} language={language} />
                  <div className="tags">
                    {current.tags.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <button
                    className="button primary"
                    onClick={(e) => open(current, e.currentTarget)}
                  >
                    {t("projects.explore")}
                    <ArrowUpRight size={17} />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="project-controls">
              <div className="project-pagination">
                <button
                  className="icon-button"
                  aria-label={t("projects.previous")}
                  disabled={projects.length < 2}
                  onClick={() =>
                    setIndex((index - 1 + projects.length) % projects.length)
                  }
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="mono">
                  {String(index + 1).padStart(2, "0")}{" "}
                  <span>/ {String(projects.length).padStart(2, "0")}</span>
                </span>
                <button
                  className="icon-button"
                  aria-label={t("projects.next")}
                  disabled={projects.length < 2}
                  onClick={() => setIndex((index + 1) % projects.length)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <button
                className="text-link"
                aria-expanded={all}
                onClick={() => setAll(!all)}
              >
                {all ? t("projects.hide_list") : t("projects.view_all")}
                <ArrowRight size={16} />
              </button>
            </div>
            {all && (
              <div className="project-grid">
                {projects.map((project) => (
                  <button
                    className="project-small glass-tile"
                    key={project.id}
                    data-testid={`project-tile-${project.id}`}
                    onClick={(e) => open(project, e.currentTarget)}
                  >
                    <ProjectImage src={project.media.image} alt="" loading="lazy" />
                    <ProjectMeta project={project} language={language} />
                    <h3>
                      {title(project)}
                      <ArrowUpRight size={16} />
                    </h3>
                    <p>{project.tagline[language]}</p>
                    <ProjectStatus project={project} language={language} />
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
          data-testid={`project-detail-${selected.id}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="text-link back-link" onClick={closeDetail}>
            <ArrowLeft size={17} />
            {t("projects.back")}
          </button>
          <ProjectMeta project={selected} language={language} />
          <h1 tabIndex={-1} ref={detailHeading}>
            {title(selected)}
          </h1>
          <p className="project-tagline">{selected.tagline[language]}</p>
          <ProjectStatus project={selected} language={language} />
          <div className="tags">
            {selected.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="project-gallery">
            <ProjectImage
              src={gallery[slide]}
              alt={`${title(selected)} — ${slide + 1}`}
            />
            {gallery.length > 1 && (
              <div className="gallery-controls">
                <button
                  className="icon-button"
                  aria-label={t("projects.previous_image")}
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
                  aria-label={t("projects.next_image")}
                  onClick={() => setSlide((slide + 1) % gallery.length)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <div className="project-story">
            <div>
              <h2>{t("projects.story")}</h2>
              <p className="project-summary-lead">{selected.summary[language]}</p>
              {selected.story[language].map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <aside className="glass-tile">
              <h2>{t("projects.highlights")}</h2>
              <ul>
                {selected.highlights[language].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
          {selected.links.length > 0 && (
            <div className="detail-links">
              {selected.links.map((link, i) => {
                const Icon = linkIcons[link.kind];
                return (
                  <a
                    key={link.url}
                    className={`button ${i === 0 ? "primary" : "secondary"}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-link-kind={link.kind}
                  >
                    <Icon size={16} />
                    {t(`projects.links.${link.kind}`)}
                    <ArrowUpRight size={16} />
                  </a>
                );
              })}
            </div>
          )}
        </motion.article>
      )}
    </motion.div>
  );
}

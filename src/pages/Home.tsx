import { useEffect, useRef, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight, Globe2, MapPin } from "../components/ui/icons";
import { useTranslation } from "react-i18next";
import Dock from "../components/portfolio/Dock";
import HomeCard from "../components/portfolio/HomeCard";
import { AboutCard, SkillsCard } from "../components/portfolio/ProfileCards";
import { LoadingCards } from "../components/portfolio/shared";
import {
  isSectionId,
  sectionNumber,
  sectionTotal,
  type SectionId,
} from "../content/sections";
import { pageTitle, profile } from "../content/profile";
import { useAnalytics } from "../hooks/useAnalytics";
import { useLanguage } from "../hooks/useLanguage";
import "../portfolio.css";

const ProjectsCard = lazy(() => import("../components/portfolio/ProjectsCard"));
const ArticlesCard = lazy(() => import("../components/portfolio/ArticlesCard"));
const ExperienceSection = lazy(() => import("../sections/ExperienceSection"));
const Contact = lazy(() => import("../sections/Contact"));

export default function Home() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const requested = hash.slice(1);
  const active: SectionId = isSectionId(requested) ? requested : "home";
  const { trackEvent } = useAnalytics(true, true);
  const trackRef = useRef(trackEvent);
  useEffect(() => {
    trackRef.current = trackEvent;
  }, [trackEvent]);
  const seen = useRef(new Set<string>());
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0),
    pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 35, damping: 22 });
  const y = useSpring(pointerY, { stiffness: 35, damping: 22 });
  const language = useLanguage();
  function selectSection(id: SectionId) {
    if (id !== active) navigate(`/#${id}`);
  }
  useEffect(() => {
    // Başlık ve meta açıklaması etkin dile göre güncellenir.
    document.documentElement.lang = language;
    document.title = pageTitle[language];
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", profile.metaDescription[language]);
  }, [language]);
  useEffect(() => {
    if (!seen.current.has(active)) {
      seen.current.add(active);
      trackRef.current("section_view", active);
    }
  }, [active]);
  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        if (active !== "home")
          document
            .querySelector<HTMLElement>("[data-section-heading], #contact h2")
            ?.focus({ preventScroll: true });
      },
      reduced ? 30 : 650,
    );
    window.scrollTo({ top: 0 });
    return () => window.clearTimeout(timer);
  }, [active, reduced]);
  return (
    <MotionConfig reducedMotion="user">
      <div
        className="portfolio"
        onPointerMove={(e) => {
          if (reduced || e.pointerType !== "mouse") return;
          pointerX.set((e.clientX / window.innerWidth - 0.5) * 38);
          pointerY.set((e.clientY / window.innerHeight - 0.5) * 30);
        }}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
      >
        <div className="ambient" aria-hidden="true">
          <motion.div className="ambient-move" style={{ x, y }}>
            <div className="aurora aurora-left" />
            <div className="aurora aurora-right" />
            <div className="aurora aurora-top" />
          </motion.div>
          <div className="ambient-grid" />
          <div className="grain" />
        </div>
        <a
          href="#active-card"
          className="skip-link"
          onClick={(event) => {
            event.preventDefault();
            document.getElementById("active-card")?.focus();
          }}
        >
          {t("common.skip_to_content")}
        </a>
        <header className="site-header">
          <button
            className="brand"
            onClick={() => selectSection("home")}
            aria-label={t("common.home_aria")}
          >
            <span className="brand-mark">
              m<span>c</span>
              <i />
            </span>
            <span className="brand-description">
              MAHMUT CAN ÇÖNGER
              <small>{t("common.personal_portfolio")}</small>
            </span>
          </button>
          <div className="header-right">
            <span className="header-location">
              <MapPin size={13} /> {profile.location}
            </span>
            <button
              className="language-button"
              onClick={() => i18n.changeLanguage(language === "tr" ? "en" : "tr")}
              aria-label={t("common.switch_language")}
            >
              <Globe2 size={14} />
              <span className={language === "tr" ? "selected" : ""}>TR</span>
              <span className="language-divider">/</span>
              <span className={language === "en" ? "selected" : ""}>EN</span>
            </button>
            <button
              className="header-contact"
              onClick={() => selectSection("contact")}
            >
              {t("common.lets_create")}
              <ArrowUpRight size={15} />
            </button>
          </div>
        </header>
        <main className="card-stage" id="active-card" tabIndex={-1}>
          <div className="card-layer layer-back" />
          <div className="card-layer layer-front" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={active}
              id={active === "contact" ? undefined : active}
              className={`glass-card card-${active}`}
              initial={
                reduced
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: 36,
                      z: -90,
                      rotateX: 6,
                      rotateY: -3,
                      scale: 0.965,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
                z: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
              }}
              exit={
                reduced
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: -15,
                      z: -130,
                      rotateX: -4,
                      rotateY: 4,
                      scale: 0.97,
                    }
              }
              transition={{
                duration: reduced ? 0.12 : 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="card-chrome">
                <span className="window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="card-breadcrumb">
                  mahmutcanconger<span>/</span>
                  {t(`nav.${active}`).toLocaleLowerCase(language)}
                </span>
                <span className="card-page">
                  {sectionNumber(active)}
                  <span> / {sectionTotal}</span>
                </span>
              </div>
              <div className="card-scroll">
                <Suspense fallback={<LoadingCards />}>
                  {active === "home" && <HomeCard navigate={selectSection} />}
                  {active === "about" && <AboutCard />}
                  {active === "tech" && <SkillsCard />}
                  {active === "experience" && <ExperienceSection />}
                  {active === "projects" && <ProjectsCard />}
                  {active === "articles" && <ArticlesCard />}
                  {active === "contact" && <Contact />}
                </Suspense>
              </div>
              <div className="card-edge" />
            </motion.section>
          </AnimatePresence>
        </main>
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} {profile.name}</span>
        </footer>
        <Dock active={active} onSelect={selectSection} />
      </div>
    </MotionConfig>
  );
}

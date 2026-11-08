import { ArrowUpRight, MapPin } from "../ui/icons";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { SocialLinks } from "./shared";
import { reveal, stagger, type SectionId } from "./motion";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useLanguage } from "../../hooks/useLanguage";
import { technologies } from "./technologies";
import { profile } from "../../content/profile";
import { cvDocuments } from "../../content/cv";
import CvDownloadMenu from "./CvDownloadMenu";

export default function HomeCard({
  navigate,
}: {
  navigate: (id: SectionId) => void;
}) {
  const { t } = useTranslation();
  const language = useLanguage();
  const { trackEvent } = useAnalytics();
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 90, damping: 22 });
  const rotateY = useSpring(x, { stiffness: 90, damping: 22 });
  return (
    <motion.div
      className="home-card"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="hero-copy">
        <motion.h1 variants={reveal} tabIndex={-1} data-section-heading>
          <span className="hero-greeting">{t("hero.greeting")}</span>
          <span className="hero-name">
            Mahmut Can
            <span className="signature">
              Çönger<span className="signature-dot">.</span>
            </span>
          </span>
        </motion.h1>
        <motion.div variants={reveal} className="hero-role">
          {profile.role[language]}
        </motion.div>
        <motion.p variants={reveal} className="hero-availability">
          <span className="status-light" aria-hidden="true" />
          <span className="sr-only">{t("hero.availability_label")}: </span>
          {profile.availability[language]}
        </motion.p>
        <motion.p variants={reveal} className="hero-description">
          {profile.heroDescription[language]}
        </motion.p>
        <motion.div variants={reveal} className="hero-actions">
          <button
            className="button primary"
            onClick={() => navigate("projects")}
          >
            {t("hero.projects_btn")}
            <ArrowUpRight size={18} />
          </button>
          <CvDownloadMenu
            documents={cvDocuments}
            language={language}
            variant="hero"
            onDownload={(cv) => trackEvent("cv_download", `hero:${cv.variant}`)}
          />
        </motion.div>
        <motion.div variants={reveal} className="hero-social">
          <SocialLinks />
          <span className="social-rule" />
          <span>{t("hero.social_tagline")}</span>
        </motion.div>
      </div>
      <motion.div
        variants={reveal}
        className="portrait-scene"
        onPointerMove={(e) => {
          if (reduced || e.pointerType !== "mouse") return;
          const b = e.currentTarget.getBoundingClientRect();
          x.set(((e.clientX - b.left - b.width / 2) / b.width) * 10);
          y.set((-(e.clientY - b.top - b.height / 2) / b.height) * 10);
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <div className="portrait-orbit orbit-one" />
        <div className="portrait-orbit orbit-two" />
        <motion.div className="portrait-assembly" style={{ rotateX, rotateY }}>
          <div className="portrait-backplate" />
          <div className="portrait-frame">
            <img
              src="/profile.jpg"
              alt={profile.name}
              fetchPriority="high"
            />
            <div className="portrait-overlay" />
            <div className="portrait-caption">
              <span>{profile.name}</span>
              <small>
                <MapPin size={12} /> {profile.location}
              </small>
            </div>
          </div>
          {technologies.map(({ id, name }) => (
            <span
              key={id}
              className={`tech-logo tech-logo-${id}`}
              role="img"
              aria-label={name}
              title={name}
            >
              <img src={`/tech-logos/${id}.svg`} alt="" loading="lazy" />
            </span>
          ))}
        </motion.div>
      </motion.div>
      <motion.div variants={reveal} className="home-bottom">
        <span className="mono">{t("hero.focus_label")}</span>
        <span>
          {profile.focus.map((item, index) => (
            <Fragment key={item}>
              {index > 0 && <i />}
              {item}
            </Fragment>
          ))}
        </span>
        <button onClick={() => navigate("about")}>
          {t("hero.closer")} <ArrowUpRight size={15} />
        </button>
      </motion.div>
    </motion.div>
  );
}

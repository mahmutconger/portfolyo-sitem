import { ArrowDownToLine, ArrowUpRight, MapPin } from "../ui/icons";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { useTranslation } from "react-i18next";
import { SocialLinks } from "./shared";
import { reveal, stagger, type SectionId } from "./motion";
import { useAnalytics } from "../../hooks/useAnalytics";
import { technologies } from "./technologies";

export default function HomeCard({
  navigate,
}: {
  navigate: (id: SectionId) => void;
}) {
  const { t, i18n } = useTranslation();
  const tr = i18n.language.startsWith("tr");
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
          <span className="hero-greeting">
            {tr ? "Merhaba, ben" : "Hello, I’m"}
          </span>
          <span className="hero-name">
            Mahmut Can
            <span className="signature">
              Çönger<span className="signature-dot">.</span>
            </span>
          </span>
        </motion.h1>
        <motion.div variants={reveal} className="hero-role">
          {tr ? "Yazılım Mühendisi" : "Software Engineer"}
        </motion.div>
        <motion.p variants={reveal} className="hero-description">
          {t("hero.description")}
        </motion.p>
        <motion.div variants={reveal} className="hero-actions">
          <button
            className="button primary"
            onClick={() => navigate("projects")}
          >
            {t("hero.projects_btn")}
            <ArrowUpRight size={18} />
          </button>
          <a
            className="button secondary"
            href="/Mahmut_Can_CONGER_CV.pdf"
            download
            onClick={() => trackEvent("cv_download", "hero")}
          >
            <ArrowDownToLine size={16} />
            {t("hero.cv_download")}
          </a>
        </motion.div>
        <motion.div variants={reveal} className="hero-social">
          <SocialLinks />
          <span className="social-rule" />
          <span>
            {tr
              ? "Birlikte güzel şeyler üretelim."
              : "Let’s build something meaningful."}
          </span>
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
              alt="Mahmut Can Çönger"
              fetchPriority="high"
            />
            <div className="portrait-overlay" />
            <div className="portrait-caption">
              <span>Mahmut Can Çönger</span>
              <small>
                <MapPin size={12} /> Manisa, Türkiye
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
        <span className="mono">{tr ? "ODAK NOKTAM" : "MY FOCUS"}</span>
        <span>
          Kotlin <i /> Jetpack Compose <i /> Clean Architecture
        </span>
        <button onClick={() => navigate("about")}>
          {tr ? "Biraz daha yakından" : "A little closer"}{" "}
          <ArrowUpRight size={15} />
        </button>
      </motion.div>
    </motion.div>
  );
}

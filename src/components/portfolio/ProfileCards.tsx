import {
  Award,
  BookOpen,
  Code2,
  Cpu,
  GraduationCap,
  Layers3,
  RefreshCw,
  Users,
  type PortfolioIcon,
} from "../ui/icons";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "./shared";
import { reveal, stagger } from "./motion";
import { useLanguage } from "../../hooks/useLanguage";
import {
  aboutBio,
  competencies,
  education,
  workPrinciples,
} from "../../content/about";
import { approach, skillGroups } from "../../content/skills";
import { profile } from "../../content/profile";

const principleIcons: Record<string, PortfolioIcon> = {
  team: Users,
  passion: BookOpen,
};

const approachIcons: Record<string, PortfolioIcon> = {
  clean: Layers3,
  compose: Code2,
  async: Cpu,
  offline: RefreshCw,
};

export function AboutCard() {
  const { t } = useTranslation();
  const language = useLanguage();
  return (
    <motion.div
      className="section-content about-content"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <SectionHeading
        section="about"
        eyebrow={t("about.profile")}
        title={
          <>
            {t("about.title_main")}
            <br />
            <em>{t("about.title_sub")}.</em>
          </>
        }
      />
      <div className="about-grid">
        <motion.div variants={reveal} className="glass-tile about-bio">
          <div className="about-avatar">
            <img src="/profile.jpg" alt={profile.name} />
            <span className="status-light" />
          </div>
          <p>{aboutBio[language]}</p>
          <span className="signature mini-signature">{profile.name}</span>
        </motion.div>
        <motion.div variants={reveal} className="glass-tile education">
          <div className="tile-label">
            <GraduationCap size={19} />
            {t("about.edu_title")}
          </div>
          <div className="timeline">
            {education.map((item) => (
              <div className="timeline-item" key={item.id}>
                <span className="mono">{item.years}</span>
                <h3>{item.title[language]}</h3>
                <small>{item.place}</small>
                <p>{item.description[language]}</p>
              </div>
            ))}
          </div>
        </motion.div>
        {workPrinciples.map(({ id, title, description }) => {
          const Icon = principleIcons[id] ?? Layers3;
          return (
            <motion.div
              variants={reveal}
              whileHover={{ y: -5 }}
              className="glass-tile principle"
              key={id}
            >
              <Icon size={22} />
              <h3>{title[language]}</h3>
              <p>{description[language]}</p>
            </motion.div>
          );
        })}
        <motion.div variants={reveal} className="certificates">
          <span>
            <Award size={17} />
            {t("about.competencies_title")}
          </span>
          <div className="tags">
            {competencies[language].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function SkillsCard() {
  const { t } = useTranslation();
  const language = useLanguage();
  return (
    <motion.div
      className="section-content skills-content"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <SectionHeading
        section="tech"
        eyebrow={t("tech.eyebrow")}
        title={
          <>
            {t("tech.title_a")}
            <br />
            <em>{t("tech.title_b")}</em>
          </>
        }
        description={t("tech.subtitle")}
      />
      <div className="skill-groups">
        {skillGroups.map(({ id, title, items }, index) => (
          <motion.section
            key={id}
            variants={{
              hidden: { opacity: 0, scale: 0.92, rotateX: 15 },
              show: { opacity: 1, scale: 1, rotateX: 0 },
            }}
            className={`technology-tile skill-group skill-group-${id}`}
            aria-labelledby={`skill-group-${id}`}
          >
            <span className="technology-number mono">0{index + 1}</span>
            <h3 id={`skill-group-${id}`}>{title[language]}</h3>
            <ul className="tags">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>
      <motion.div variants={reveal} className="principles-heading">
        <span className="eyebrow">{t("tech.approach")}</span>
        <span className="line" />
      </motion.div>
      <div className="skill-principles">
        {approach.map(({ id, title, description }) => {
          const Icon = approachIcons[id] ?? Layers3;
          return (
            <motion.div variants={reveal} className="skill-principle" key={id}>
              <Icon size={18} />
              <div>
                <h3>{title[language]}</h3>
                <p>{description[language]}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

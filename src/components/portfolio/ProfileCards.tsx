import {
  Award,
  BookOpen,
  Code2,
  Cpu,
  GitBranch,
  GraduationCap,
  Layers3,
  Users,
  ArrowUpRight,
} from "../ui/icons";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "./shared";
import { reveal, stagger } from "./motion";
import { technologies } from "./technologies";

export function AboutCard() {
  const { t, i18n } = useTranslation();
  const tr = i18n.language.startsWith("tr");
  return (
    <motion.div
      className="section-content about-content"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <SectionHeading
        number="02"
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
            <img src="/profile.jpg" alt="Mahmut Can Çönger" />
            <span className="status-light" />
          </div>
          <p>{t("about.description")}</p>
          <span className="signature mini-signature">Mahmut Can Çönger</span>
        </motion.div>
        <motion.div variants={reveal} className="glass-tile education">
          <div className="tile-label">
            <GraduationCap size={19} />
            {t("about.edu_title")}
          </div>
          <div className="timeline">
            {[
              {
                years: "2023 — 2027",
                title: "uni",
                place: "Manisa Celal Bayar Üniversitesi",
              },
              {
                years: "2019 — 2023",
                title: "high",
                place: "Sivas Bilişim Tek. Lisesi",
              },
            ].map((item) => (
              <div className="timeline-item" key={item.title}>
                <span className="mono">{item.years}</span>
                <h3>{t(`about.${item.title}`)}</h3>
                <small>{item.place}</small>
                <p>{t(`about.${item.title}_desc`)}</p>
              </div>
            ))}
          </div>
        </motion.div>
        {[
          { id: "git", Icon: GitBranch },
          { id: "team", Icon: Users },
          { id: "passion", Icon: BookOpen },
        ].map(({ id, Icon }) => (
          <motion.div
            variants={reveal}
            whileHover={{ y: -5 }}
            className="glass-tile principle"
            key={id}
          >
            <Icon size={22} />
            <h3>{t(`about.${id}_title`)}</h3>
            <p>{t(`about.${id}_desc`)}</p>
          </motion.div>
        ))}
        <motion.div variants={reveal} className="certificates">
          <span>
            <Award size={17} />
            {t("about.certs_title")}
          </span>
          <div className="tags">
            {[
              "Git & GitHub (Advanced)",
              "Jetpack Compose UI",
              "Firebase Backend",
              tr ? "İleri Seviye Kotlin" : "Advanced Kotlin",
              tr ? "Versiyon Kontrol Sistemleri" : "Version Control Systems",
            ].map((cert) => (
              <span key={cert}>{cert}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function SkillsCard() {
  const { t, i18n } = useTranslation();
  const tr = i18n.language.startsWith("tr");
  return (
    <motion.div
      className="section-content skills-content"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <SectionHeading
        number="03"
        eyebrow={tr ? "ARAÇLAR & YAKLAŞIM" : "TOOLS & APPROACH"}
        title={
          <>
            {tr ? "Doğru araçlar." : "The right tools."}
            <br />
            <em>{tr ? "Sağlam temeller." : "Solid foundations."}</em>
          </>
        }
        description={t("tech.subtitle")}
      />
      <div className="technology-grid">
        {technologies.map(({ id, name, category, en }, index) => (
          <motion.div
            key={name}
            variants={{
              hidden: { opacity: 0, scale: 0.85, rotateX: 15 },
              show: { opacity: 1, scale: 1, rotateX: 0 },
            }}
            whileHover={{ y: -6, backgroundColor: "#ffffff0d" }}
            className="technology-tile"
          >
            <span className="technology-number mono">0{index + 1}</span>
            <span
              className="technology-icon"
            >
              <img src={`/tech-logos/${id}.svg`} alt="" loading="lazy" />
            </span>
            <h3>{name}</h3>
            <p>{tr ? category : en}</p>
            <ArrowUpRight className="technology-arrow" size={16} />
          </motion.div>
        ))}
      </div>
      <motion.div variants={reveal} className="principles-heading">
        <span className="eyebrow">
          {tr ? "KODUN ARKASINDAKİ YAKLAŞIM" : "THE APPROACH BEHIND THE CODE"}
        </span>
        <span className="line" />
      </motion.div>
      <div className="skill-principles">
        {[
          { id: "clean", Icon: Layers3 },
          { id: "compose", Icon: Code2 },
          { id: "async", Icon: Cpu },
          { id: "atomic", Icon: GitBranch },
        ].map(({ id, Icon }) => (
          <motion.div variants={reveal} className="skill-principle" key={id}>
            <Icon size={18} />
            <div>
              <h3>{t(`tech.${id}_title`)}</h3>
              <p>{t(`tech.${id}_desc`)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

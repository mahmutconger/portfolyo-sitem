import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Briefcase } from "../ui/icons";
import { SectionHeading } from "./shared";
import { reveal, stagger } from "./motion";
import { Link } from "react-router-dom";
import { formatPeriod } from "../../content/format";
import { projectHref } from "../../content/sections";
import type { ExperienceEntry, Language, Project } from "../../content/types";

interface ExperienceCardProps {
  entries: ExperienceEntry[];
  projects: Project[];
  language: Language;
}

export default function ExperienceCard({
  entries,
  projects,
  language,
}: ExperienceCardProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      className="section-content experience-content"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <SectionHeading
        section="experience"
        eyebrow={t("experience.eyebrow")}
        title={
          <>
            {t("experience.title_a")}
            <br />
            <em>{t("experience.title_b")}</em>
          </>
        }
        description={t("experience.description")}
      />
      <div className="experience-list">
        {entries.map((entry) => {
          const related = entry.projectIds
            .map((id) => projects.find((project) => project.id === id))
            .filter((project): project is Project => Boolean(project));
          return (
            <motion.article
              variants={reveal}
              className="glass-tile experience-entry"
              key={entry.id}
              data-testid={`experience-${entry.id}`}
            >
              <header className="experience-header">
                <span className="experience-icon" aria-hidden="true">
                  <Briefcase size={20} />
                </span>
                <div>
                  <h2>
                    {entry.organization ? (
                      <>
                        {entry.organization}
                        <span> · {entry.role[language]}</span>
                      </>
                    ) : (
                      entry.role[language]
                    )}
                  </h2>
                  <p className="experience-meta mono">
                    {formatPeriod(entry.period, language)}
                    <i />
                    {entry.context[language]}
                  </p>
                </div>
              </header>
              {entry.bullets[language].length > 0 && (
                <ul className="experience-bullets">
                  {entry.bullets[language].map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
              {related.length > 0 && (
                <div className="experience-projects">
                  <span className="eyebrow">{t("experience.projects_label")}</span>
                  <ul>
                    {related.map((project) => (
                      <li key={project.id}>
                        <Link
                          to={projectHref(project.id)}
                          aria-label={`${project.title[language]} — ${t("experience.view_project")}`}
                        >
                          <span className="experience-project-copy">
                            <strong>{project.title[language]}</strong>
                            <small>
                              {formatPeriod(project.period, language)} ·{" "}
                              {project.tagline[language]}
                              {project.client &&
                                ` · ${t("experience.client", { name: project.client })}`}
                            </small>
                          </span>
                          <ArrowUpRight size={16} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}

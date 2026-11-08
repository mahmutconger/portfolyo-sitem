import { motion } from "motion/react";
import { ArrowUpRight } from "../ui/icons";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { reveal } from "./motion";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useLanguage } from "../../hooks/useLanguage";
import { socialLinks } from "../../content/profile";
import { sectionNumber, type SectionId } from "../../content/sections";
import { socialIcons } from "./socialIcons";

export function SectionHeading({
  section,
  eyebrow,
  title,
  description,
}: {
  section: SectionId;
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <motion.header variants={reveal} className="section-heading">
      <div className="eyebrow">
        <span>{sectionNumber(section)} /</span> {eyebrow}
      </div>
      <h1 tabIndex={-1} data-section-heading>
        {title}
      </h1>
      {description && <p>{description}</p>}
    </motion.header>
  );
}

export function SocialLinks() {
  const { trackEvent } = useAnalytics();
  const language = useLanguage();
  return (
    <div className="social-links">
      {socialLinks.map(({ id, label, href }) => {
        const Icon = socialIcons[id];
        const external = !href.startsWith("mailto:");
        return (
          <a
            key={id}
            href={href}
            aria-label={label[language]}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            onClick={() => trackEvent("social_click", label.en)}
          >
            <Icon size={18} />
          </a>
        );
      })}
    </div>
  );
}

export function EmptyState({
  title,
  onRetry,
  children,
}: {
  title: string;
  onRetry?: () => void;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="empty-state" role="status">
      <span className="empty-orbit">
        <ArrowUpRight size={30} />
      </span>
      <h2>{title}</h2>
      {children}
      {onRetry && (
        <button className="button secondary" onClick={onRetry}>
          {t("common.try_again")}
        </button>
      )}
    </div>
  );
}

export function LoadingCards() {
  const { t } = useTranslation();
  return (
    <div className="loading-cards" role="status" aria-label={t("common.loading")}>
      {[0, 1, 2].map((i) => (
        <div className="skeleton-card" key={i}>
          <div />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}

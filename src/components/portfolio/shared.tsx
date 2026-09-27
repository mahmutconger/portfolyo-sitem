import { motion } from "motion/react";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail } from "../ui/icons";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { reveal } from "./motion";
import { useAnalytics } from "../../hooks/useAnalytics";

export function SectionHeading({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <motion.header variants={reveal} className="section-heading">
      <div className="eyebrow">
        <span>{number} /</span> {eyebrow}
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
  return (
    <div className="social-links">
      {[
        {
          label: "GitHub",
          href: "https://github.com/mahmutconger",
          Icon: Github,
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/mahmut-can-conger-4305b1299/",
          Icon: Linkedin,
        },
        {
          label: "Instagram",
          href: "https://www.instagram.com/canconger58/",
          Icon: Instagram,
        },
        { label: "E-posta", href: "mailto:mahmutconger@gmail.com", Icon: Mail },
      ].map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target={href.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          onClick={() => trackEvent("social_click", label)}
        >
          <Icon size={18} />
        </a>
      ))}
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
  const { i18n } = useTranslation();
  return (
    <div className="empty-state" role="status">
      <span className="empty-orbit">
        <ArrowUpRight size={30} />
      </span>
      <h2>{title}</h2>
      {children}
      {onRetry && (
        <button className="button secondary" onClick={onRetry}>
          {i18n.language.startsWith("tr") ? "Tekrar dene" : "Try again"}
        </button>
      )}
    </div>
  );
}

export function LoadingCards() {
  return (
    <div className="loading-cards" role="status" aria-label="Yükleniyor">
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

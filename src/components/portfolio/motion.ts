import type { Variants } from "motion/react";

export const sectionIds = [
  "home",
  "about",
  "tech",
  "projects",
  "articles",
  "contact",
] as const;
export type SectionId = (typeof sectionIds)[number];
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085, delayChildren: 0.1 } },
};
export const reveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

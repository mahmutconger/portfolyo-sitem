import { Github, Instagram, Linkedin, Mail, type PortfolioIcon } from "../ui/icons";
import type { SocialId } from "../../content/types";

export const socialIcons: Record<SocialId, PortfolioIcon> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  email: Mail,
};

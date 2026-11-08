import ExperienceCard from "../components/portfolio/ExperienceCard";
import { experience } from "../content/experience";
import { projects } from "../content/projects";
import { useLanguage } from "../hooks/useLanguage";

// İçeriği sunum bileşenine bağlayan ince katman. Ayrı (tembel) yüklendiği
// için proje metinleri ilk açılış paketine girmez.
export default function ExperienceSection() {
  const language = useLanguage();
  return (
    <ExperienceCard entries={experience} projects={projects} language={language} />
  );
}

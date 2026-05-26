import { useState, useEffect } from 'react';
import {
  Github, ExternalLink, FolderGit2, ChevronLeft, ChevronRight,
  X, Linkedin, Cpu, Info, ArrowRight,
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  image: string;
  gallery: string[];
  features: string[];
  githubUrl: string;
  liveUrl: string | null;
  linkedinUrl?: string;
  isFeatured?: boolean;
}

/* ─── Image Gallery ──────────────────────────────────────────── */
const ImageGallery = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const DURATION = 3500;

  const next = () => setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1));
  const prev = () => setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1));

  if (!images || images.length === 0) return null;

  return (
    <div
      className="relative w-full h-[45vh] md:h-[55vh] bg-zinc-950 rounded-xl overflow-hidden group border border-zinc-800 select-none flex items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`@keyframes fillProgress { from { width: 0%; } to { width: 100%; } }`}</style>

      {/* Blurred bg */}
      <div
        className="absolute inset-0 blur-2xl opacity-25 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      />
      <div className="absolute inset-0 bg-zinc-950/60" />

      <img
        src={images[currentIndex]}
        className="relative h-full w-full object-contain z-10 transition-all duration-500"
        alt=""
      />

      {/* Nav buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 p-2.5 rounded-lg bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all z-20 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 p-2.5 rounded-lg bg-zinc-900/80 text-white hover:bg-zinc-800 transition-all z-20 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Progress bars */}
      <div className="absolute bottom-3 left-0 right-0 px-10 flex gap-1.5 z-20">
        {images.map((_, index) => (
          <div
            key={index}
            className="h-[2px] bg-white/15 rounded-full flex-1 overflow-hidden cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
          >
            <div
              className="h-full bg-indigo-400 rounded-full"
              style={{
                width: index === currentIndex ? '100%' : '0%',
                animation: index === currentIndex ? `fillProgress ${DURATION}ms linear forwards` : 'none',
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
              onAnimationEnd={() => { if (index === currentIndex) next(); }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Project Card ───────────────────────────────────────────── */
const ProjectCard = ({
  project,
  onClick,
}: {
  project: ProjectData;
  onClick: () => void;
}) => {
  const { t } = useTranslation();
  const title = typeof project.title === 'object'
    ? (project.title as any)?.[document.documentElement.lang] || (project.title as any)?.tr || ''
    : project.title;
  const description = typeof project.description === 'object'
    ? (project.description as any)?.[document.documentElement.lang] || (project.description as any)?.tr || ''
    : project.description;

  return (
    <div
      onClick={onClick}
      className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-zinc-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 flex flex-col"
    >
      {/* Cover image */}
      <div className="relative h-52 overflow-hidden bg-zinc-800 shrink-0">
        <img
          src={project.image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />

        {/* Tags overlay */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {project.tags?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[10px] font-medium text-indigo-300 bg-zinc-900/80 backdrop-blur-sm border border-indigo-500/20 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Featured badge */}
        {project.isFeatured && (
          <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-amber-500/90 text-black rounded-full">
            {t('projects.featured_badge')}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-white font-semibold mb-1.5 group-hover:text-indigo-300 transition-colors text-[15px]">
          {title || String(project.title)}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 flex-1">
          {description || String(project.description)}
        </p>
        <div className="flex items-center gap-1 text-indigo-400 text-xs font-medium mt-4 group-hover:translate-x-1 transition-transform">
          {t('projects.inspect')} <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

/* ─── Projects Section ───────────────────────────────────────── */
const Projects = ({ isFullList = false }: { isFullList?: boolean }) => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = isFullList
          ? query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
          : query(collection(db, 'projects'));

        const querySnapshot = await getDocs(q);
        let data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Record<string, unknown>),
        })) as ProjectData[];

        if (!isFullList) {
          data = data.filter((p) => p.isFeatured === true);
        }
        data.sort((a: any, b: any) => b.createdAt?.seconds - a.createdAt?.seconds);
        setProjects(data);
      } catch (error) {
        console.error('Veri hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [isFullList]);

  return (
    <section
      id="projects"
      className={`py-28 bg-zinc-950 ${isFullList ? 'min-h-screen pt-32' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-14">
          <div>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5" />
              Portfolio
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {isFullList ? t('projects.all_title') : t('projects.featured_title')}
            </h2>
            <p className="text-zinc-400 mt-2 text-sm">
              {isFullList ? t('projects.all_desc') : t('projects.featured_desc')}
            </p>
          </div>
          {isFullList && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('projects.back_home')}
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-24 text-zinc-500 animate-pulse text-sm">
            {t('projects.loading')}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id || index}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>

            {!isFullList && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => navigate('/all-projects')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
                >
                  {t('projects.view_all')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};

/* ─── Project Modal ──────────────────────────────────────────── */
const ProjectModal = ({ project, onClose }: { project: ProjectData; onClose: () => void }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'tr' | 'en';

  const getText = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.tr || value.en || '';
  };

  const getList = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value[lang] || value.tr || value.en || [];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-zinc-950 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl border border-zinc-800 shadow-2xl custom-scrollbar animate-in fade-in zoom-in-95 duration-200">

        {/* Close */}
        <button
          onClick={onClose}
          className="sticky top-4 float-right mr-4 z-50 p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 md:px-10 pt-6 pb-10 clear-both">

          {/* Title + tags */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              {getText(project.title)}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium bg-zinc-900 text-indigo-300 border border-zinc-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="mb-8">
            {project.gallery && project.gallery.length > 0 ? (
              <ImageGallery images={project.gallery} />
            ) : (
              <div className="w-full h-[45vh] bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800">
                <img src={project.image} className="h-full object-contain" alt="" />
              </div>
            )}
          </div>

          {/* Content grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Story */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Info className="w-4 h-4 text-indigo-400" />
                {t('projects.story')}
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                {getText(project.longDescription)}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Cpu className="w-4 h-4 text-purple-400" />
                {t('projects.features')}
              </h3>
              <ul className="space-y-2">
                {getList(project.features).map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-zinc-300 text-xs p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-zinc-800">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-medium border border-zinc-800 hover:border-zinc-700"
            >
              <Github className="w-4 h-4" />
              {t('projects.source_code')}
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                {t('projects.demo')}
              </a>
            )}
            {project.linkedinUrl && (
              <a
                href={project.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0077b5] hover:bg-[#006097] text-white px-5 py-2.5 rounded-xl transition-all text-sm font-medium"
              >
                <Linkedin className="w-4 h-4" />
                {t('projects.linkedin')}
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Projects;

import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, FolderGit2, ChevronLeft, ChevronRight, X, Linkedin, Cpu, Info, ArrowRight } from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

// --- Veri Yapısı ---
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
  isFeatured?: boolean; // YENİ ALAN
}

// --- ImageGallery (Aynı Kalıyor - Kısaltıldı) ---
const ImageGallery = ({ images }: { images: string[] }) => {
    // ... (Eski kodun aynısı)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const DURATION = 3500; 
    const nextSlide = () => { setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); };
    const prevSlide = () => { setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); };
    if (!images || images.length === 0) return null;
    return (
        <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-950 rounded-2xl overflow-hidden group border border-white/10 select-none flex items-center justify-center" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <style>{`@keyframes fillProgress { from { width: 0%; } to { width: 100%; } }`}</style>
            <div className="absolute inset-0 blur-xl opacity-50 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${images[currentIndex]})` }} />
            <div className="absolute inset-0 bg-black/40" />
            <img src={images[currentIndex]} className="relative h-full w-full object-contain z-10 transition-all duration-500 drop-shadow-2xl" />
            <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 p-3 rounded-full bg-black/60 text-white hover:bg-blue-600 transition-all z-20 backdrop-blur-md border border-white/10 group-hover:scale-110"><ChevronLeft className="w-6 h-6" /></button>
            <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 p-3 rounded-full bg-black/60 text-white hover:bg-blue-600 transition-all z-20 backdrop-blur-md border border-white/10 group-hover:scale-110"><ChevronRight className="w-6 h-6" /></button>
            <div className="absolute bottom-4 left-0 right-0 px-12 flex gap-2 z-20">
                {images.map((_, index) => (
                    <div key={index} className="h-1 bg-white/20 rounded-full flex-1 overflow-hidden cursor-pointer backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}>
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: index === currentIndex ? '100%' : '0%', animation: index === currentIndex ? `fillProgress ${DURATION}ms linear forwards` : 'none', animationPlayState: isPaused ? 'paused' : 'running' }} onAnimationEnd={() => { if (index === currentIndex) nextSlide(); }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- ANA BİLEŞEN ---
// isFullList: true ise hepsini gösterir (AllProjects sayfası için)
// false ise sadece öne çıkanları gösterir (Ana sayfa için)
const Projects = ({ isFullList = false }: { isFullList?: boolean }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
        try {
            // Firestore Query
            let q;
            if (isFullList) {
                // Eğer "Tüm Liste" ise sadece tarihe göre sırala
                q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
            } else {
                // Eğer Ana Sayfa ise, SADECE "isFeatured == true" olanları getir
                // NOT: Firestore'da index oluşturmanız gerekebilir. Konsolda link verirse tıklayın.
                q = query(collection(db, "projects"), where("isFeatured", "==", true));
                // Not: 'orderBy' ve 'where' birlikte kullanıldığında Firestore Index ister.
                // Şimdilik client-side sorting yapabiliriz karışıklık olmasın diye:
                q = query(collection(db, "projects")); 
            }
            
            const querySnapshot = await getDocs(q);
            let projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProjectData[];

            // Client-side filtering/sorting (Index hatası almamak için)
            if (!isFullList) {
                projectsData = projectsData.filter(p => p.isFeatured === true);
            }
            // Tarihe göre sırala (Yeni -> Eski)
            // (createdAt bir Timestamp objesidir, any casting ile geçiyoruz şimdilik)
            projectsData.sort((a:any, b:any) => b.createdAt?.seconds - a.createdAt?.seconds);

            setProjects(projectsData);
        } catch (error) { console.error("Veri hatası:", error); } finally { setLoading(false); }
    };
    fetchProjects();
  }, [isFullList]);

  return (
    <section id="projects" className={`py-20 bg-slate-900 ${isFullList ? 'min-h-screen pt-32' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg"><FolderGit2 className="w-8 h-8 text-blue-400" /></div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">{isFullList ? "Tüm Projelerim" : "Öne Çıkan Projeler"}</h2>
                    <p className="text-gray-400 mt-1">{isFullList ? "Geliştirdiğim bütün uygulamaların arşivi." : "Seçilmiş en iyi çalışmalarım."}</p>
                </div>
            </div>
            
            {/* Eğer Ana Sayfadaysak ve "Geri Dön" butonu gerekirse */}
            {isFullList && (
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" /> Ana Sayfaya Dön
                </button>
            )}
        </div>

        {loading ? <div className="text-center py-20 animate-pulse text-gray-400">Projeler Yükleniyor...</div> : 
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div key={project.id || index} onClick={() => setSelectedProject(project)} className="group bg-slate-800 rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col cursor-pointer">
                            {/* KART YAPISI (Aynı) */}
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-transparent transition-colors z-10" />
                                <img src={project.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                                {/* Featured Rozeti */}
                                {project.isFeatured && <div className="absolute top-2 right-2 bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded shadow-lg z-20">Öne Çıkan</div>}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">{project.tags?.slice(0, 3).map((tag, i) => (<span key={i} className="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-500/10 rounded-full">{tag}</span>))}</div>
                                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mt-auto group-hover:translate-x-2 transition-transform">İncele <ExternalLink className="w-4 h-4" /></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* "Daha Fazlasını Gör" Butonu (Sadece Ana Sayfadaysa görünür) */}
                {!isFullList && (
                    <div className="mt-12 text-center">
                        <button onClick={() => navigate('/all-projects')} className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-all border border-white/10 group">
                            Tüm Projeleri Görüntüle <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </>
        }
      </div>
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
};

// --- Modal Bileşeni (Aynı - Sadece export'a gerek yok burada) ---
const ProjectModal = ({ project, onClose }: { project: ProjectData, onClose: () => void }) => {
    // ... (Eski kodun aynısı)
    // Yer kaplamasın diye tekrar yazmıyorum, önceki kodunuzdaki ProjectModal'ı buraya yapıştırın.
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
          <div className="relative bg-slate-900 w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300 custom-scrollbar">
            <div className="sticky top-0 right-0 z-50 flex justify-end p-4 pointer-events-none">
                 <button onClick={onClose} className="pointer-events-auto p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors border border-white/20 backdrop-blur-md">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="px-6 md:px-10 pb-10 -mt-16">
                <div className="text-center mb-8 mt-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{project.title}</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {project.tags?.map((tag, i) => (<span key={i} className="px-4 py-1.5 text-sm font-medium bg-slate-800 text-blue-300 border border-white/10 rounded-full shadow-sm">{tag}</span>))}
                    </div>
                </div>
                <div className="mb-10 shadow-2xl shadow-black/50 rounded-2xl">
                    {project.gallery && project.gallery.length > 0 ? <ImageGallery images={project.gallery} /> : <div className="w-full h-[50vh] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10"><img src={project.image} className="h-full object-contain" /></div>}
                </div>
                <div className="grid md:grid-cols-3 gap-10 mb-10">
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2"><Info className="w-5 h-5 text-blue-400" /> Proje Hikayesi</h3>
                        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">{project.longDescription}</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2"><Cpu className="w-5 h-5 text-purple-400" /> Özellikler</h3>
                        <ul className="space-y-3">{project.features?.map((feature, i) => (<li key={i} className="flex items-start gap-3 text-gray-300 p-3 bg-slate-800/50 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors"><span className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></span><span className="text-sm">{feature}</span></li>))}</ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/10 flex flex-wrap justify-center gap-4">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl transition-all font-semibold border border-white/10 hover:scale-105"><Github className="w-5 h-5" /> Kaynak Kod</a>
                    {project.liveUrl && (<a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl transition-all font-semibold shadow-lg shadow-green-900/30 hover:scale-105"><ExternalLink className="w-5 h-5" /> Play Store / Demo</a>)}
                    {project.linkedinUrl && (<a href={project.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#0077b5] hover:bg-[#006097] text-white px-8 py-4 rounded-xl transition-all font-semibold shadow-lg shadow-blue-900/30 hover:scale-105"><Linkedin className="w-5 h-5" /> LinkedIn Gönderisi</a>)}
                </div>
            </div>
          </div>
        </div>
      );
};

export default Projects;
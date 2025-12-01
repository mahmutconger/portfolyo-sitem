import React, { useState } from 'react';
import { Github, ExternalLink, FolderGit2 } from 'lucide-react';

// --- Veri Yapısı (Interface) ---
interface ProjectData {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  image: string;
  gallery: string[];
  features: string[];
  githubUrl: string;
  liveUrl: string | null;
}

// --- Proje Verileri ---
const projects: ProjectData[] = [
  {
    title: "E-Ticaret Uygulaması",
    description: "MVVM mimarisi ve Clean Architecture prensipleri kullanılarak geliştirilmiş modern bir alışveriş uygulaması.",
    longDescription: "Bu proje, Android geliştirme dünyasındaki en güncel pratikleri uygulamak amacıyla geliştirildi. Kullanıcıların ürünleri filtreleyebildiği, sepete ekleyebildiği ve ödeme simülasyonu yapabildiği tam kapsamlı bir akış içerir. State Management için Hilt ve Coroutines yoğun bir şekilde kullanıldı.",
    tags: ["Kotlin", "Jetpack Compose", "Hilt", "Retrofit"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&q=80&w=400"
    ],
    features: [
        "Kullanıcı Girişi ve Firebase Authentication",
        "Ürün Arama ve Detaylı Filtreleme",
        "Sepet Yönetimi (Room DB ile Local Caching)",
        "Karanlık Mod (Dark Mode) Desteği"
    ],
    githubUrl: "https://github.com/mahmutconger",
    liveUrl: "https://play.google.com/store"
  },
  {
    title: "Note App (Offline First)",
    description: "Room veritabanı kullanılarak oluşturulmuş, kullanıcıların notlarını güvenle saklayabildiği not defteri uygulaması.",
    longDescription: "Kullanıcıların internet bağlantısı olmadan da çalışabildiği, notlarını güvenle saklayabildiği bir uygulama. MVVM mimarisi üzerine kuruludur. Kullanıcı deneyimini artırmak için animasyonlar ve sürükle-bırak özellikleri eklenmiştir.",
    tags: ["Kotlin", "Room DB", "Coroutines", "Flow"],
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    features: ["CRUD İşlemleri", "Arama Fonksiyonu", "Yerel Yedekleme", "Önceliklendirme Sistemi"],
    githubUrl: "https://github.com/mahmutconger",
    liveUrl: null 
  },
  {
    title: "MovieDB Explorer",
    description: "TMDB API kullanılarak film detaylarını, oyuncu kadrosunu ve puanları listeleyen dinamik bir film keşif uygulaması.",
    longDescription: "Rest API tüketimi ve asenkron veri işleme konusunda yetkinliklerimi sergilediğim proje. Pagination (sayfalama) yapısı ve Image Caching teknikleri kullanıldı. Retrofit ile API istekleri yönetildi.",
    tags: ["Android SDK", "Rest API", "Glide", "Material 3"],
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    gallery: [],
    features: ["Popüler Filmler Listesi", "Oyuncu Detayları", "Fragman İzleme", "Favorilere Ekleme"],
    githubUrl: "https://github.com/mahmutconger",
    liveUrl: "https://play.google.com/store"
  }
];

// --- Ana Bileşen (Projects) ---
const Projects = () => {
  // State: Hangi projenin seçili olduğunu tutar. (Null ise modal kapalıdır)
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  return (
    <section id="projects" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bölüm Başlığı */}
        <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-blue-500/10 rounded-lg">
                <FolderGit2 className="w-8 h-8 text-blue-400" />
            </div>
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Öne Çıkan Projeler</h2>
                <p className="text-gray-400 mt-1">Geliştirdiğim bazı Android uygulamaları</p>
            </div>
        </div>

        {/* Proje Kartları Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              // Karta tıklandığında State'i güncelle ve Modalı aç
              onClick={() => setSelectedProject(project)}
              className="group bg-slate-800 rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col cursor-pointer"
            >
              
              {/* Resim Alanı */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* İçerik Alanı */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">
                  {project.description}
                </p>

                {/* Etiketler */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-500/10 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Kartın Altındaki Butonlar */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    // stopPropagation: Butona basınca hem linke git hem de modalı aç yapmaması için engelleme.
                    onClick={(e) => e.stopPropagation()} 
                    className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    Kaynak Kod
                  </a>
                  
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-gray-300 hover:text-blue-400 text-sm transition-colors ml-auto"
                    >
                      Canlı Önizleme
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                 {/* Detayları İncele Yazısı (Hover ile görünür opsiyonel) */}
                 <div className="mt-4 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Detaylar için tıklayın <ExternalLink className="w-3 h-3" />
                 </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* --- MODAL RENDERING --- */}
      {/* Eğer selectedProject doluysa (null değilse) ProjectModal'ı ekrana bas */}
      {selectedProject && (
        <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
        />
      )}

    </section>
  );
};

// --- Proje Detay Modalı (Dialog Fragment) ---
const ProjectModal = ({ project, onClose }: { project: ProjectData, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* Arka Plan (Backdrop) - Tıklayınca kapanır */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal İçeriği (Card) - Tıklayınca kapanmaz (stopPropagation zaten div içinde doğal davranır) */}
      <div className="relative bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Kapat Butonu (Sağ Üst) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 1. Üst Kısım: Kapak Resmi */}
        <div className="h-64 sm:h-80 w-full relative">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 text-xs bg-blue-600/80 text-white rounded-full backdrop-blur-md">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* 2. İçerik Kısmı */}
        <div className="p-6 md:p-8 space-y-8">
            
            {/* Açıklama ve Özellikler Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Sol Taraf: Uzun Açıklama */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <FolderGit2 className="w-5 h-5 text-blue-400" /> Proje Hakkında
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                        {project.longDescription}
                    </p>
                </div>

                {/* Sağ Taraf: Özellikler Listesi */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 h-fit">
                    <h3 className="text-lg font-semibold text-white mb-4">Öne Çıkan Özellikler</h3>
                    <ul className="space-y-2">
                        {project.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Galeri (Screenshots) - Varsa Göster */}
            {project.gallery.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Ekran Görüntüleri</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {project.gallery.map((img, i) => (
                            <div key={i} className="rounded-lg overflow-hidden border border-white/5 aspect-[9/16] group cursor-pointer hover:shadow-lg transition-all">
                                <img src={img} alt={`Screenshot ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Alt Butonlar */}
            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                 <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                    <Github className="w-5 h-5" /> GitHub Repo
                 </a>
                 {project.liveUrl && (
                     <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                        <ExternalLink className="w-5 h-5" /> Canlı Demo / Play Store
                     </a>
                 )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default Projects;
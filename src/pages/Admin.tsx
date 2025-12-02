import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'; 
import { Plus, Trash2, Save, LogOut, Image as ImageIcon, Linkedin, Check, Edit2, Star } from 'lucide-react';

const PREDEFINED_TAGS = [
  "Kotlin", "Java", "Jetpack Compose", "XML Views", "Firebase", 
  "Room DB", "Retrofit", "Hilt", "Dagger", "Coroutines", "Flow",
  "MVVM", "Clean Architecture", "React", "TypeScript", "Tailwind CSS"
];

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // PROJE LİSTESİ STATE
  const [projectsList, setProjectsList] = useState<any[]>([]);
  // DÜZENLEME MODU (Edit Mode)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    image: '', 
    githubUrl: '',
    liveUrl: '',
    linkedinUrl: '',
    isFeatured: false // YENİ
  });

  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [currentFeature, setCurrentFeature] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [currentGalleryImg, setCurrentGalleryImg] = useState('');

  // --- LİSTEYİ DİNLE (REALTIME) ---
  useEffect(() => {
    // onSnapshot: Veritabanında değişiklik olursa anında burayı günceller (LiveData observe gibi)
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjectsList(list);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => { auth.signOut(); navigate('/login'); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Featured Checkbox Değişimi
  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isFeatured: e.target.checked });
  };

  const togglePredefinedTag = (tag: string) => {
    if (tags.includes(tag)) setTags(tags.filter(t => t !== tag));
    else setTags([...tags, tag]);
  };

  const addTag = () => { if (currentTag.trim() && !tags.includes(currentTag.trim())) { setTags([...tags, currentTag.trim()]); setCurrentTag(''); }};
  const addFeature = () => { if (currentFeature.trim()) { setFeatures([...features, currentFeature.trim()]); setCurrentFeature(''); }};
  const addGalleryImg = () => { if (currentGalleryImg.trim()) { setGallery([...gallery, currentGalleryImg.trim()]); setCurrentGalleryImg(''); }};
  const removeItem = (index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => { setList(list.filter((_, i) => i !== index)); };

  // --- DÜZENLEMEYİ BAŞLAT ---
  const handleEdit = (project: any) => {
      setEditingId(project.id);
      setFormData({
          title: project.title,
          description: project.description,
          longDescription: project.longDescription,
          image: project.image,
          githubUrl: project.githubUrl,
          liveUrl: project.liveUrl || '',
          linkedinUrl: project.linkedinUrl || '',
          isFeatured: project.isFeatured || false
      });
      setTags(project.tags || []);
      setFeatures(project.features || []);
      setGallery(project.gallery || []);
      
      // Formun en üstüne kaydır
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- İPTAL ET ---
  const handleCancelEdit = () => {
      setEditingId(null);
      resetForm();
  };

  // --- SİLME İŞLEMİ ---
  const handleDelete = async (id: string) => {
      if (window.confirm("Bu projeyi kalıcı olarak silmek istediğinize emin misiniz?")) {
          try {
              await deleteDoc(doc(db, "projects", id));
          } catch (error) {
              console.error("Silme hatası:", error);
              alert("Silinirken hata oluştu.");
          }
      }
  };

  // --- KAYDET / GÜNCELLE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        tags, features, gallery,
        updatedAt: new Date()
      };

      if (editingId) {
          // GÜNCELLEME (UPDATE)
          await updateDoc(doc(db, "projects", editingId), projectData);
          alert("Proje güncellendi!");
          setEditingId(null);
      } else {
          // YENİ EKLEME (CREATE)
          await addDoc(collection(db, "projects"), { ...projectData, createdAt: new Date() });
          alert("Proje eklendi!");
      }
      
      resetForm();

    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', longDescription: '', image: '', githubUrl: '', liveUrl: '', linkedinUrl: '', isFeatured: false });
    setTags([]); setFeatures([]); setGallery([]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-white">Yönetim Paneli</h1>
            <p className="text-gray-400 text-sm mt-1">{editingId ? "Projeyi Düzenliyorsunuz" : "Yeni proje ekle ve portfolyonu yönet."}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
          <LogOut className="w-4 h-4" /> Çıkış
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* SOL: FORM ALANI (2/3) */}
        <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8 bg-slate-950 p-6 rounded-2xl border border-white/10">
                
                {/* Durum Başlığı */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {editingId ? <><Edit2 className="w-5 h-5 text-yellow-500" /> Projeyi Düzenle</> : <><Plus className="w-5 h-5 text-blue-500" /> Yeni Proje Ekle</>}
                    </h2>
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} className="text-sm text-gray-400 hover:text-white">Düzenlemeyi İptal Et</button>
                    )}
                </div>

                {/* TEMEL BİLGİLER */}
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Proje Başlığı</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Kapak Resmi (URL)</label>
                            <input name="image" value={formData.image} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500" required />
                        </div>
                    </div>
                    
                    {/* ÖNE ÇIKAR CHECKBOX */}
                    <div className="flex items-center gap-3 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                        <input type="checkbox" id="featured" checked={formData.isFeatured} onChange={handleFeaturedChange} className="w-5 h-5 accent-yellow-500" />
                        <label htmlFor="featured" className="text-yellow-100 font-medium cursor-pointer select-none flex items-center gap-2">
                            <Star className={`w-4 h-4 ${formData.isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`} /> 
                            Bu projeyi Ana Sayfada öne çıkar (Featured)
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Kısa Açıklama</label>
                        <input name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Uzun Hikaye</label>
                        <textarea name="longDescription" value={formData.longDescription} onChange={handleChange} rows={5} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500" required />
                    </div>
                </div>

                {/* TEKNOLOJİLER */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Teknolojiler</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {PREDEFINED_TAGS.map(tag => (
                            <button key={tag} type="button" onClick={() => togglePredefinedTag(tag)} className={`px-3 py-1 text-xs rounded-full border transition-all ${tags.includes(tag) ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-gray-400 border-white/10'}`}>{tag}</button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                         <input value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" placeholder="Diğer..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                         <button type="button" onClick={addTag} className="bg-blue-600 px-3 rounded-lg"><Plus className="w-5 h-5" /></button>
                    </div>
                    {/* Seçilen Taglar */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, i) => (<span key={i} className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded flex items-center gap-1">{tag} <button type="button" onClick={() => removeItem(i, tags, setTags)}><Trash2 className="w-3 h-3" /></button></span>))}
                    </div>
                </div>

                 {/* FEATURES VE GALLERY KISMI (Yer tutmasın diye kısaltıyorum, önceki kodla aynı mantık) */}
                 <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Özellikler</h3>
                        <div className="flex gap-2 mb-2"><input value={currentFeature} onChange={(e) => setCurrentFeature(e.target.value)} className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} /><button type="button" onClick={addFeature} className="bg-purple-600 px-3 rounded-lg"><Plus className="w-4 h-4" /></button></div>
                        <ul className="max-h-32 overflow-y-auto space-y-1">{features.map((f, i) => (<li key={i} className="text-xs bg-slate-900 p-2 rounded flex justify-between">{f}<button type="button" onClick={() => removeItem(i, features, setFeatures)}><Trash2 className="w-3 h-3 text-red-400" /></button></li>))}</ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Galeri URL</h3>
                        <div className="flex gap-2 mb-2"><input value={currentGalleryImg} onChange={(e) => setCurrentGalleryImg(e.target.value)} className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImg())} /><button type="button" onClick={addGalleryImg} className="bg-green-600 px-3 rounded-lg"><Plus className="w-4 h-4" /></button></div>
                        <div className="grid grid-cols-4 gap-1 max-h-32 overflow-y-auto">{gallery.map((url, i) => (<div key={i} className="relative group aspect-square"><img src={url} className="w-full h-full object-cover rounded" /><button type="button" onClick={() => removeItem(i, gallery, setGallery)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4 text-white" /></button></div>))}</div>
                    </div>
                 </div>

                {/* LİNKLER */}
                <div className="grid grid-cols-3 gap-2">
                    <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" placeholder="GitHub URL" required />
                    <input name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" placeholder="Play Store URL" />
                    <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" placeholder="LinkedIn Post URL" />
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className={`px-8 py-3 rounded-xl font-bold text-white transition-all ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {loading ? 'İşleniyor...' : editingId ? 'Güncellemeyi Kaydet' : 'Projeyi Yayınla'}
                    </button>
                </div>
            </form>
        </div>

        {/* SAĞ: MEVCUT PROJELER LİSTESİ (1/3) */}
        <div className="lg:col-span-1">
            <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 sticky top-6">
                <h2 className="text-xl font-bold text-white mb-4">Mevcut Projeler ({projectsList.length})</h2>
                
                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                    {projectsList.map((project) => (
                        <div key={project.id} className={`p-4 rounded-xl border transition-all ${editingId === project.id ? 'bg-blue-900/30 border-blue-500' : 'bg-slate-900 border-white/5 hover:border-white/20'}`}>
                            
                            <div className="flex gap-3 mb-3">
                                <img src={project.image} className="w-16 h-16 rounded-lg object-cover bg-black" />
                                <div>
                                    <h4 className="font-bold text-white text-sm line-clamp-1">{project.title}</h4>
                                    <div className="flex gap-2 mt-1">
                                        {project.isFeatured && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-500/30">Öne Çıkan</span>}
                                        <span className="text-[10px] bg-slate-700 text-gray-300 px-1.5 py-0.5 rounded">{project.tags?.[0]}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleEdit(project)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-blue-400 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                                >
                                    <Edit2 className="w-3 h-3" /> Düzenle
                                </button>
                                <button 
                                    onClick={() => handleDelete(project.id)}
                                    className="flex-1 bg-slate-800 hover:bg-red-900/30 text-red-400 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" /> Sil
                                </button>
                            </div>

                        </div>
                    ))}

                    {projectsList.length === 0 && <p className="text-gray-500 text-center text-sm">Henüz proje yok.</p>}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
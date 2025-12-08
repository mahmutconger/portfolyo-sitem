import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// EKSİK İKONLAR EKLENDİ: Mail, Calendar
import { Plus, Trash2, LogOut, Edit2, Star, MessageSquare, Upload, Loader2, X, Mail, Calendar } from 'lucide-react';

const PREDEFINED_TAGS = [
  "Kotlin", "Java", "Jetpack Compose", "XML Views", "Firebase", 
  "Room DB", "Retrofit", "Hilt", "Dagger", "Coroutines", "Flow",
  "MVVM", "Clean Architecture", "React", "TypeScript", "Tailwind CSS"
];

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'projects' | 'messages'>('projects');
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', description: '', longDescription: '', image: '', githubUrl: '', liveUrl: '', linkedinUrl: '', isFeatured: false
  });

  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [currentFeature, setCurrentFeature] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);

  // --- VERİ DİNLEME ---
  useEffect(() => {
    const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
        setProjectsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qMessages = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
        setMessagesList(snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            // Tarih hatasını önlemek için güvenli çeviri
            createdAtDate: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date() 
        })));
    });

    return () => { unsubProjects(); unsubMessages(); };
  }, []);

  const handleLogout = () => { auth.signOut(); navigate('/login'); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData({ ...formData, isFeatured: e.target.checked }); };
  
  // --- RESİM YÜKLEME ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Dosya boyutu kontrolü (Örn: 5MB üzeri dosyaları uyar)
    for (let i = 0; i < files.length; i++) {
        if (files[i].size > 5 * 1024 * 1024) {
            alert(`"${files[i].name}" çok büyük! Lütfen 5MB altı resimler yükleyin.`);
            return;
        }
    }

    setUploading(true);

    try {
      // FileList'i Array'e çevirip map ile dönüyoruz
      // Her bir yükleme işlemi bir Promise (Gelecek vaadi) döndürür
      const uploadPromises = Array.from(files).map(async (file) => {
        // Dosya ismini benzersiz yap (Türkçe karakter sorununu da çözer)
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
        const storageRef = ref(storage, `images/${fileName}`);
        
        // Yükle
        const snapshot = await uploadBytes(storageRef, file);
        
        // Linki al ve döndür
        return await getDownloadURL(snapshot.ref);
      });

      // Promise.all: Tüm yüklemelerin bitmesini bekle (Paralel çalışır)
      const uploadedUrls = await Promise.all(uploadPromises);

      if (isGallery) {
        setGallery((prev) => [...prev, ...uploadedUrls]);
      } else {
        setFormData({ ...formData, image: uploadedUrls[0] });
      }

    } catch (error: any) {
      console.error("Yükleme Detaylı Hata:", error);
      // Kullanıcıya teknik hatayı göster (Storage izni vb.)
      alert(`Yükleme başarısız: ${error.message || "Bilinmeyen hata"}`);
    } finally {
      setUploading(false);
      e.target.value = ''; // Input'u temizle
    }
  };

  // --- DİĞER FONKSİYONLAR ---
  const togglePredefinedTag = (tag: string) => { if (tags.includes(tag)) setTags(tags.filter(t => t !== tag)); else setTags([...tags, tag]); };
  const addTag = () => { if (currentTag.trim() && !tags.includes(currentTag.trim())) { setTags([...tags, currentTag.trim()]); setCurrentTag(''); }};
  const addFeature = () => { if (currentFeature.trim()) { setFeatures([...features, currentFeature.trim()]); setCurrentFeature(''); }};
  const removeItem = (index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => { setList(list.filter((_, i) => i !== index)); };

  const handleEdit = (project: any) => {
      setActiveTab('projects');
      setEditingId(project.id);
      setFormData({
          title: project.title, description: project.description, longDescription: project.longDescription,
          image: project.image, githubUrl: project.githubUrl, liveUrl: project.liveUrl || '', linkedinUrl: project.linkedinUrl || '', isFeatured: project.isFeatured || false
      });
      setTags(project.tags || []); setFeatures(project.features || []); setGallery(project.gallery || []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => { setEditingId(null); resetForm(); };

  const handleDelete = async (id: string, collectionName: string) => {
      if (window.confirm("Bu öğeyi kalıcı olarak silmek istediğinize emin misiniz?")) {
          try { await deleteDoc(doc(db, collectionName, id)); } 
          catch (error) { console.error("Silme hatası:", error); alert("Hata oluştu."); }
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const projectData = { ...formData, tags, features, gallery, updatedAt: new Date() };
      if (editingId) { await updateDoc(doc(db, "projects", editingId), projectData); alert("Güncellendi!"); setEditingId(null); } 
      else { await addDoc(collection(db, "projects"), { ...projectData, createdAt: new Date() }); alert("Eklendi!"); }
      resetForm();
    } catch (error) { console.error("Hata:", error); alert("Hata oluştu."); } 
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', longDescription: '', image: '', githubUrl: '', liveUrl: '', linkedinUrl: '', isFeatured: false });
    setTags([]); setFeatures([]); setGallery([]);
  };

  const formatDate = (date: any) => {
      if (!date) return "";
      try {
        return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
      } catch (e) {
        return e;
      }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/10 pb-6 gap-4">
        <div><h1 className="text-3xl font-bold text-white">Yönetim Paneli</h1><p className="text-gray-400 text-sm mt-1">İçeriklerini ve gelen kutunu yönet.</p></div>
        <div className="flex items-center gap-4">
             <div className="flex bg-slate-800 p-1 rounded-lg border border-white/10">
                <button onClick={() => setActiveTab('projects')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'projects' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}><Star className="w-4 h-4" /> Projeler</button>
                <button onClick={() => setActiveTab('messages')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}><MessageSquare className="w-4 h-4" /> Mesajlar {messagesList.length > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{messagesList.length}</span>}</button>
             </div>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><LogOut className="w-4 h-4" /> Çıkış</button>
        </div>
      </div>

      {activeTab === 'projects' && (
          <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8 bg-slate-950 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">{editingId ? <><Edit2 className="w-5 h-5 text-yellow-500" /> Projeyi Düzenle</> : <><Plus className="w-5 h-5 text-blue-500" /> Yeni Proje Ekle</>}</h2>
                        {editingId && <button type="button" onClick={handleCancelEdit} className="text-sm text-gray-400 hover:text-white">İptal</button>}
                    </div>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div><label className="text-sm text-gray-400">Başlık</label><input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 outline-none" required /></div>
                                
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Kapak Resmi</label>
                                    <div className="flex items-center gap-4">
                                        <input type="file" id="coverImageInput" className="hidden" onChange={(e) => handleImageUpload(e, false)} accept="image/*" />
                                        <label htmlFor="coverImageInput" className={`flex-1 flex items-center justify-center gap-2 bg-slate-900 border border-dashed border-white/20 hover:border-blue-500 hover:bg-blue-500/10 rounded-lg p-8 cursor-pointer transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-500" /> : <><Upload className="w-6 h-6 text-gray-400" /><span className="text-sm text-gray-400">Dosya Seç</span></>}
                                        </label>
                                        {formData.image && (
                                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/10 relative group">
                                                <img src={formData.image} className="w-full h-full object-cover" alt="Kapak" />
                                                <button type="button" onClick={() => setFormData({...formData, image: ''})} className="absolute top-0 right-0 bg-red-600 p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3 text-white" /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div><label className="text-sm text-gray-400">Kısa Açıklama</label><input name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 outline-none" required /></div>
                                <div className="flex items-center gap-3 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 h-[52px] mt-6">
                                    <input type="checkbox" id="featured" checked={formData.isFeatured} onChange={handleFeaturedChange} className="w-5 h-5 accent-yellow-500" />
                                    <label htmlFor="featured" className="text-yellow-100 font-medium cursor-pointer text-sm">Ana Sayfada Öne Çıkar</label>
                                </div>
                            </div>
                        </div>

                        <div><label className="text-sm text-gray-400">Uzun Hikaye</label><textarea name="longDescription" value={formData.longDescription} onChange={handleChange} rows={5} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 outline-none" required /></div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Teknolojiler</h3>
                        <div className="flex flex-wrap gap-2 mb-4">{PREDEFINED_TAGS.map(tag => (<button key={tag} type="button" onClick={() => togglePredefinedTag(tag)} className={`px-3 py-1 text-xs rounded-full border transition-all ${tags.includes(tag) ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-gray-400 border-white/10'}`}>{tag}</button>))}</div>
                        <div className="flex gap-2"><input value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" placeholder="Diğer..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} /><button type="button" onClick={addTag} className="bg-blue-600 px-3 rounded-lg"><Plus className="w-5 h-5" /></button></div>
                        <div className="flex flex-wrap gap-2 mt-2">{tags.map((tag, i) => (<span key={i} className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded flex items-center gap-1">{tag} <button type="button" onClick={() => removeItem(i, tags, setTags)}><Trash2 className="w-3 h-3" /></button></span>))}</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div><h3 className="text-sm font-semibold text-gray-400 mb-2">Özellikler</h3><div className="flex gap-2 mb-2"><input value={currentFeature} onChange={(e) => setCurrentFeature(e.target.value)} className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} /><button type="button" onClick={addFeature} className="bg-purple-600 px-3 rounded-lg"><Plus className="w-4 h-4" /></button></div><ul className="max-h-32 overflow-y-auto space-y-1">{features.map((f, i) => (<li key={i} className="text-xs bg-slate-900 p-2 rounded flex justify-between">{f}<button type="button" onClick={() => removeItem(i, features, setFeatures)}><Trash2 className="w-3 h-3 text-red-400" /></button></li>))}</ul></div>
                        
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Galeri</h3>
                            <label className={`flex items-center justify-center gap-2 bg-slate-900 border border-dashed border-white/20 hover:border-green-500 hover:bg-green-500/10 rounded-lg p-3 cursor-pointer transition-all mb-4 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin text-green-500" /> : <><Upload className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-400">Çoklu Fotoğraf Ekle</span></>}
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, true)} multiple accept="image/*" />
                            </label>
                            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                                {gallery.map((url, i) => (
                                    <div key={i} className="relative group aspect-square bg-slate-900 rounded overflow-hidden">
                                        <img src={url} className="w-full h-full object-cover" alt={`Galeri ${i}`} />
                                        <button type="button" onClick={() => removeItem(i, gallery, setGallery)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-white" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" placeholder="GitHub URL" required />
                        <input name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" placeholder="Play Store URL" />
                        <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none" placeholder="LinkedIn Post URL" />
                    </div>

                    <div className="flex justify-end"><button type="submit" disabled={loading || uploading} className={`px-8 py-3 rounded-xl font-bold text-white transition-all ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50 disabled:cursor-not-allowed`}>{loading ? 'İşleniyor...' : uploading ? 'Resim Yükleniyor...' : editingId ? 'Güncellemeyi Kaydet' : 'Projeyi Yayınla'}</button></div>
                </form>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 sticky top-6">
                    <h2 className="text-xl font-bold text-white mb-4">Mevcut Projeler ({projectsList.length})</h2>
                    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                        {projectsList.map((project) => (
                            <div key={project.id} className={`p-4 rounded-xl border transition-all ${editingId === project.id ? 'bg-blue-900/30 border-blue-500' : 'bg-slate-900 border-white/5 hover:border-white/20'}`}>
                                <div className="flex gap-3 mb-3">
                                    <img src={project.image} className="w-16 h-16 rounded-lg object-cover bg-black" />
                                    <div><h4 className="font-bold text-white text-sm line-clamp-1">{project.title}</h4><div className="flex gap-2 mt-1">{project.isFeatured && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-500/30">Öne Çıkan</span>}</div></div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(project)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-blue-400 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"><Edit2 className="w-3 h-3" /> Düzenle</button>
                                    <button onClick={() => handleDelete(project.id, "projects")} className="flex-1 bg-slate-800 hover:bg-red-900/30 text-red-400 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"><Trash2 className="w-3 h-3" /> Sil</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
      )}

      {activeTab === 'messages' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center"><h2 className="text-xl font-bold text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-500" /> Gelen Mesajlar</h2><span className="text-gray-400 text-sm">Toplam {messagesList.length} mesaj</span></div>
                  {messagesList.length === 0 ? <div className="p-12 text-center text-gray-500"><MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>Henüz hiç mesajınız yok.</p></div> : 
                      <div className="divide-y divide-white/5">
                          {messagesList.map((msg) => (
                              <div key={msg.id} className="p-6 hover:bg-slate-900 transition-colors group">
                                  <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg">{msg.name?.charAt(0).toUpperCase()}</div><div><h4 className="font-bold text-white">{msg.name}</h4><div className="flex items-center gap-2 text-xs text-gray-400"><Mail className="w-3 h-3" /> {msg.email}</div></div></div>
                                      <div className="text-right"><div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Calendar className="w-3 h-3" /> {formatDate(msg.createdAtDate)}</div><a href={`mailto:${msg.email}?subject=Dönüş: Proje Hakkında&body=Merhaba ${msg.name},\n\nMesajını aldım...`} className="text-xs text-blue-400 hover:underline">Yanıtla</a></div>
                                  </div>
                                  <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-gray-300 text-sm leading-relaxed mb-3">{msg.message}</div>
                                  <div className="flex justify-end"><button onClick={() => handleDelete(msg.id, "messages")} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-red-500/10"><Trash2 className="w-3 h-3" /> Sil</button></div>
                              </div>
                          ))}
                      </div>
                  }
              </div>
          </div>
      )}
    </div>
  );
};

export default Admin;
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { auth, db, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Plus, Trash2, LogOut, Edit2, Star, MessageSquare,
  Upload, Loader2, X, Mail, Calendar, Globe,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Bilingual string stored in Firestore */
interface BilingualText {
  tr: string;
  en: string;
}

/** Bilingual string-array stored in Firestore */
interface BilingualList {
  tr: string[];
  en: string[];
}

interface ProjectData {
  id?: string;
  title: BilingualText;
  description: BilingualText;
  longDescription: BilingualText;
  features: BilingualList;
  tags: string[];          // language-independent
  image: string;           // language-independent
  gallery: string[];       // language-independent
  githubUrl: string;       // language-independent
  liveUrl: string;         // language-independent
  linkedinUrl: string;     // language-independent
  isFeatured: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface MessageData {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAtDate: Date;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PREDEFINED_TAGS = [
  'Kotlin', 'Java', 'Jetpack Compose', 'XML Views', 'Firebase',
  'Room DB', 'Retrofit', 'Hilt', 'Dagger', 'Coroutines', 'Flow',
  'MVVM', 'Clean Architecture', 'React', 'TypeScript', 'Tailwind CSS',
];

type ContentLang = 'tr' | 'en';

const EMPTY_BILINGUAL_TEXT: BilingualText = { tr: '', en: '' };
const EMPTY_BILINGUAL_LIST: BilingualList = { tr: [], en: [] };

const EMPTY_FORM: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt'> = {
  title: { ...EMPTY_BILINGUAL_TEXT },
  description: { ...EMPTY_BILINGUAL_TEXT },
  longDescription: { ...EMPTY_BILINGUAL_TEXT },
  features: { tr: [], en: [] },
  tags: [],
  image: '',
  gallery: [],
  githubUrl: '',
  liveUrl: '',
  linkedinUrl: '',
  isFeatured: false,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Admin: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'messages'>('projects');

  /**
   * contentLang: which language tab is active inside the form
   * (TR / EN bilingual field editing)
   */
  const [contentLang, setContentLang] = useState<ContentLang>('tr');

  // ── Data ──────────────────────────────────────────────────────────────────
  const [projectsList, setProjectsList] = useState<ProjectData[]>([]);
  const [messagesList, setMessagesList] = useState<MessageData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ── Form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [currentTag, setCurrentTag] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');

  // ---------------------------------------------------------------------------
  // Firestore listeners
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const qProjects = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      setProjectsList(
        snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ProjectData, 'id'>) })),
      );
    });

    const qMessages = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      setMessagesList(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<MessageData, 'id' | 'createdAtDate'>),
          createdAtDate: d.data().createdAt?.toDate
            ? d.data().createdAt.toDate()
            : new Date(),
        })),
      );
    });

    return () => {
      unsubProjects();
      unsubMessages();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const toggleUiLang = () => {
    const next = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(next);
  };

  const formatDate = (date: Date) => {
    if (!date) return '';
    try {
      return new Intl.DateTimeFormat(i18n.language, {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(date);
    } catch {
      return '';
    }
  };

  // ── Bilingual field helpers ───────────────────────────────────────────────

  /** Update a bilingual text field for the active content language */
  const handleBilingualChange = (
    field: 'title' | 'description' | 'longDescription',
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [contentLang]: value },
    }));
  };

  // ── Tags (language-independent) ───────────────────────────────────────────
  const togglePredefinedTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const addTag = () => {
    const trimmed = currentTag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // ── Features (bilingual, per contentLang) ─────────────────────────────────
  const addFeature = () => {
    const trimmed = currentFeature.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [contentLang]: [...prev.features[contentLang], trimmed],
      },
    }));
    setCurrentFeature('');
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [contentLang]: prev.features[contentLang].filter((_, i) => i !== index),
      },
    }));
  };

  // ── Gallery helpers ───────────────────────────────────────────────────────
  const removeGalleryItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isGallery = false,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) {
        alert(`"${files[i].name}" ${t('admin.form.validation.fileTooLarge')}`);
        return;
      }
    }

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const storageRef = ref(storage, `images/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      if (isGallery) {
        setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...uploadedUrls] }));
      } else {
        setFormData((prev) => ({ ...prev, image: uploadedUrls[0] }));
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : t('admin.form.validation.unknownError');
      alert(`${t('admin.form.validation.uploadFailed')}: ${errMsg}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
const handleEdit = (project: ProjectData) => {
  setActiveTab('projects');
  setEditingId(project.id!);

  setFormData({
    title: typeof project.title === 'string' 
      ? { tr: project.title, en: project.title } 
      : (project.title ?? { tr: '', en: '' }),

    description: typeof project.description === 'string'
      ? { tr: project.description, en: project.description }
      : (project.description ?? { tr: '', en: '' }),

    longDescription: typeof project.longDescription === 'string'
      ? { tr: project.longDescription, en: project.longDescription }
      : (project.longDescription ?? { tr: '', en: '' }),

    features: {
      tr: project.features?.tr ?? [],
      en: project.features?.en ?? []
    },

    tags: Array.isArray(project.tags) ? project.tags : [],
    image: project.image ?? '',
    gallery: Array.isArray(project.gallery) ? project.gallery : [],
    githubUrl: project.githubUrl ?? '',
    liveUrl: project.liveUrl ?? '',
    linkedinUrl: project.linkedinUrl ?? '',
    isFeatured: project.isFeatured ?? false,
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id: string, collectionName: string) => {
    if (window.confirm(t('admin.form.validation.deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch {
        alert(t('admin.form.validation.deleteError'));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const projectData: Omit<ProjectData, 'id' | 'createdAt'> = {
        ...formData,
        updatedAt: new Date(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), projectData as any);
        alert(t('admin.form.validation.updated'));
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: new Date(),
        });
        alert(t('admin.form.validation.added'));
      }
      resetForm();
    } catch {
      alert(t('admin.form.validation.error'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ ...EMPTY_FORM });
    setCurrentTag('');
    setCurrentFeature('');
  };

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  /** Get display title for the current UI language, with fallback */
const getDisplayTitle = (project: ProjectData): string => {
  const lang = i18n.language as ContentLang;
  
  if (typeof project.title === 'object' && project.title !== null) {
    return project.title[lang] || project.title.tr || project.title.en || '—';
  }
  return (project.title as unknown as string) || '—';
};

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.title')}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('admin.subtitle')}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Tab switcher */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'projects' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Star className="w-4 h-4" /> {t('admin.tabs.projects')}
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" /> {t('admin.tabs.messages')}
              {messagesList.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {messagesList.length}
                </span>
              )}
            </button>
          </div>

          {/* UI language toggle */}
          <button
            onClick={toggleUiLang}
            className="flex items-center gap-2 bg-slate-800 border border-white/10 text-gray-300 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
            title="Toggle UI language"
          >
            <Globe className="w-4 h-4" />
            {i18n.language.toUpperCase()}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" /> {t('admin.logout')}
          </button>
        </div>
      </div>

      {/* ── Projects Tab ────────────────────────────────────────────────── */}
      {activeTab === 'projects' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8 bg-slate-950 p-6 rounded-2xl border border-white/10">

              {/* Form header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {editingId
                    ? <><Edit2 className="w-5 h-5 text-yellow-500" /> {t('admin.form.editProject')}</>
                    : <><Plus className="w-5 h-5 text-blue-500" /> {t('admin.form.addProject')}</>}
                </h2>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="text-sm text-gray-400 hover:text-white">
                    {t('admin.form.cancel')}
                  </button>
                )}
              </div>

              {/* ── Content language tabs (TR / EN) ─────────────────────── */}
              <div className="flex bg-slate-800 p-1 rounded-lg border border-white/10 w-fit">
                {(['tr', 'en'] as ContentLang[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setContentLang(lang)}
                    className={`px-5 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${contentLang === lang ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {t(`admin.form.langTab.${lang}`)}
                    {/* Warn if this language has empty required fields */}
                    {(formData.title[lang] === '' || formData.description[lang] === '') && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400" title="Missing content" />
                    )}
                  </button>
                ))}
              </div>

              {/* ── Bilingual fields ──────────────────────────────────────── */}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">

                    {/* Title */}
                    <div>
                      <label className="text-sm text-gray-400">
                        {t('admin.form.fields.title')}
                        <LangBadge lang={contentLang} />
                      </label>
                      <input
                        value={formData.title[contentLang]}
                        onChange={(e) => handleBilingualChange('title', e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 outline-none mt-1"
                        required={contentLang === 'tr'}
                      />
                    </div>

                    {/* Cover image (language-independent) */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">
                        {t('admin.form.fields.coverImage')}
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          id="coverImageInput"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, false)}
                          accept="image/*"
                        />
                        <label
                          htmlFor="coverImageInput"
                          className={`flex-1 flex items-center justify-center gap-2 bg-slate-900 border border-dashed border-white/20 hover:border-blue-500 hover:bg-blue-500/10 rounded-lg p-8 cursor-pointer transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          {uploading
                            ? <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                            : <><Upload className="w-6 h-6 text-gray-400" /><span className="text-sm text-gray-400">{t('admin.form.fields.selectFile')}</span></>}
                        </label>
                        {formData.image && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/10 relative group">
                            <img src={formData.image} className="w-full h-full object-cover" alt="Cover" />
                            <button
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                              className="absolute top-0 right-0 bg-red-600 p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Short description */}
                    <div>
                      <label className="text-sm text-gray-400">
                        {t('admin.form.fields.shortDesc')}
                        <LangBadge lang={contentLang} />
                      </label>
                      <input
                        value={formData.description[contentLang]}
                        onChange={(e) => handleBilingualChange('description', e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 outline-none mt-1"
                        required={contentLang === 'tr'}
                      />
                    </div>

                    {/* Featured checkbox (language-independent) */}
                    <div className="flex items-center gap-3 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 h-[52px] mt-6">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                        className="w-5 h-5 accent-yellow-500"
                      />
                      <label htmlFor="featured" className="text-yellow-100 font-medium cursor-pointer text-sm">
                        {t('admin.form.fields.featured')}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Long description */}
                <div>
                  <label className="text-sm text-gray-400">
                    {t('admin.form.fields.longStory')}
                    <LangBadge lang={contentLang} />
                  </label>
                  <textarea
                    value={formData.longDescription[contentLang]}
                    onChange={(e) => handleBilingualChange('longDescription', e.target.value)}
                    rows={5}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 outline-none mt-1"
                    required={contentLang === 'tr'}
                  />
                </div>
              </div>

              {/* ── Tags (language-independent) ───────────────────────────── */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">
                  {t('admin.form.fields.technologies')}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {PREDEFINED_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => togglePredefinedTag(tag)}
                      className={`px-3 py-1 text-xs rounded-full border transition-all ${formData.tags.includes(tag) ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-gray-400 border-white/10'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none"
                    placeholder={t('admin.form.fields.otherTag')}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button type="button" onClick={addTag} className="bg-blue-600 px-3 rounded-lg">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.tags ?? []).map((tag, i) => (
                    <span key={i} className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(i)}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Features (bilingual) + Gallery ────────────────────────── */}
              <div className="grid md:grid-cols-2 gap-4">

                {/* Features */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    {t('admin.form.fields.features')}
                    <LangBadge lang={contentLang} />
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={currentFeature}
                      onChange={(e) => setCurrentFeature(e.target.value)}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button type="button" onClick={addFeature} className="bg-purple-600 px-3 rounded-lg">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <ul className="max-h-32 overflow-y-auto space-y-1">
                    {(formData.features?.[contentLang] ?? []).map((f, i) => (
                      <li key={i} className="text-xs bg-slate-900 p-2 rounded flex justify-between">
                        {f}
                        <button type="button" onClick={() => removeFeature(i)}>
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gallery (language-independent) */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    {t('admin.form.fields.gallery')}
                  </h3>
                  <label
                    className={`flex items-center justify-center gap-2 bg-slate-900 border border-dashed border-white/20 hover:border-green-500 hover:bg-green-500/10 rounded-lg p-3 cursor-pointer transition-all mb-4 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {uploading
                      ? <Loader2 className="w-5 h-5 animate-spin text-green-500" />
                      : <><Upload className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-400">{t('admin.form.fields.multiPhoto')}</span></>}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, true)}
                      multiple
                      accept="image/*"
                    />
                  </label>
                  <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                    {(formData.gallery ?? []).map((url, i) => (
                      <div key={i} className="relative group aspect-square bg-slate-900 rounded overflow-hidden">
                        <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(i)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── URLs (language-independent) ───────────────────────────── */}
              <div className="grid grid-cols-3 gap-2">
                <input
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                  className="bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none"
                  placeholder={t('admin.form.fields.githubUrl')}
                  required
                />
                <input
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))}
                  className="bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none"
                  placeholder={t('admin.form.fields.liveUrl')}
                />
                <input
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                  className="bg-slate-900 border border-white/10 rounded-lg p-2 text-sm outline-none"
                  placeholder={t('admin.form.fields.linkedinUrl')}
                />
              </div>

              {/* ── Submit ─────────────────────────────────────────────────── */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className={`px-8 py-3 rounded-xl font-bold text-white transition-all ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading
                    ? t('admin.form.submit.processing')
                    : uploading
                    ? t('admin.form.submit.uploading')
                    : editingId
                    ? t('admin.form.submit.update')
                    : t('admin.form.submit.publish')}
                </button>
              </div>
            </form>
          </div>

          {/* Project list sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {t('admin.projects.listTitle')} ({projectsList.length})
              </h2>
              <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                {projectsList.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-xl border transition-all ${editingId === project.id ? 'bg-blue-900/30 border-blue-500' : 'bg-slate-900 border-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex gap-3 mb-3">
                      <img src={project.image} className="w-16 h-16 rounded-lg object-cover bg-black" alt="" />
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">
                          {getDisplayTitle(project)}
                        </h4>
                        <div className="flex gap-2 mt-1">
                          {project.isFeatured && (
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-500/30">
                              {t('admin.projects.featured')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-blue-400 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" /> {t('admin.projects.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(project.id!, 'projects')}
                        className="flex-1 bg-slate-800 hover:bg-red-900/30 text-red-400 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> {t('admin.projects.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Messages Tab ────────────────────────────────────────────────── */}
      {activeTab === 'messages' && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" /> {t('admin.messages.title')}
              </h2>
              <span className="text-gray-400 text-sm">
                {t('admin.messages.total', { count: messagesList.length })}
              </span>
            </div>

            {messagesList.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>{t('admin.messages.empty')}</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {messagesList.map((msg) => (
                  <div key={msg.id} className="p-6 hover:bg-slate-900 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg">
                          {msg.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{msg.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Mail className="w-3 h-3" /> {msg.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" /> {formatDate(msg.createdAtDate)}
                        </div>
                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent(t('admin.messages.replySubject'))}&body=${encodeURIComponent(t('admin.messages.replyBody', { name: msg.name }))}`}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          {t('admin.messages.reply')}
                        </a>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-gray-300 text-sm leading-relaxed mb-3">
                      {msg.message}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(msg.id, 'messages')}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3 h-3" /> {t('admin.messages.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Small helper component: language badge next to field label
// ---------------------------------------------------------------------------
const LangBadge: React.FC<{ lang: ContentLang }> = ({ lang }) => (
  <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${lang === 'tr' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
    {lang.toUpperCase()}
  </span>
);

export default Admin;
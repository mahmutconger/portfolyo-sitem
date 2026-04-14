import React, { useState } from 'react';
import { Mail, CheckCircle, Copy, Loader2, Lock, ArrowRight, Github, Linkedin, FileText, ExternalLink } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'form' | 'verify' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const PUBLIC_KEY = "NVd_00kA9C2KrM8gL"; 
  const SERVICE_ID = "service_qrqlzfe"; 
  const TEMPLATE_VERIFY_ID = "template_ftdoyq1"; 
  const TEMPLATE_ADMIN_ID = "template_xdwo66g";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("mahmutconger@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_VERIFY_ID, {
        to_name: formData.name,
        to_email: formData.email,
        code: code
      }, PUBLIC_KEY);

      setLoading(false);
      setStep('verify');
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(t('contact.error_send'));
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userCode !== generatedCode) {
      setError(t('contact.error_code'));
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: new Date(),
        isRead: false,
        verified: true
      });

      const now = new Date();
      await emailjs.send(SERVICE_ID, TEMPLATE_ADMIN_ID, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        time: now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR'),
        to_email: "mahmutconger@gmail.com"
      }, PUBLIC_KEY);
      
      setLoading(false);
      setStep('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => { setStep('form'); setUserCode(''); }, 5000);

    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(t('contact.error_db'));
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-blue-400 font-semibold tracking-wide uppercase mb-2">{t('contact.label')}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('contact.title')}</h3>
          <p className="text-gray-400 max-w-xl mx-auto">{t('contact.desc')}</p>
        </div>

        <div className="grid md:grid-cols-5 gap-12 bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl">
          <div className="md:col-span-2 space-y-8 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold text-white mb-4">{t('contact.channels')}</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{t('contact.channels_desc')}</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <a href="https://github.com/mahmutconger" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-white/5 hover:bg-slate-700 transition-all group">
                  <div className="p-2 bg-slate-900 rounded-lg text-white group-hover:scale-110 transition-transform"><Github className="w-5 h-5" /></div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white">GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/mahmut-can-conger-4305b1299/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-white/5 hover:bg-[#0077b5] transition-all group">
                  <div className="p-2 bg-slate-900 rounded-lg text-blue-400 group-hover:text-white group-hover:bg-white/20 group-hover:scale-110 transition-transform"><Linkedin className="w-5 h-5" /></div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white">LinkedIn</span>
                </a>
                <a href="/CV-TR.pdf" download="Mahmut_Can_Conger_CV.pdf" className="col-span-2 flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-white/5 hover:bg-green-600/90 transition-all group">
                  <div className="p-2 bg-slate-900 rounded-lg text-green-400 group-hover:text-white group-hover:bg-white/20 group-hover:scale-110 transition-transform"><FileText className="w-5 h-5" /></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">{t('contact.cv_btn')}</span>
                    <span className="text-[10px] text-gray-500 group-hover:text-green-100">{t('contact.cv_format')}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 ml-auto group-hover:text-white" />
                </a>
              </div>
            </div>

            <div className="bg-slate-800 p-5 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Mail className="w-5 h-5" /></div>
                <span className="text-sm font-medium text-white">{t('contact.direct_mail')}</span>
              </div>
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-white/10 relative overflow-hidden">
                <span className="text-gray-300 text-sm font-mono z-10">mahmutconger@gmail.com</span>
                <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white z-10">
                  {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <div className={`absolute inset-0 bg-green-500/10 transition-transform duration-500 origin-left ${copied ? 'scale-x-100' : 'scale-x-0'}`}></div>
              </div>
              <p className={`text-xs mt-2 text-right transition-all ${copied ? 'text-green-400 opacity-100' : 'opacity-0'}`}>{t('contact.copy_success')}</p>
            </div>
          </div>

          <div className="md:col-span-3 bg-slate-800/50 p-6 rounded-2xl border border-white/5 relative">
            {step === 'form' && (
              <form onSubmit={handleSendCode} className="space-y-5 animate-in fade-in slide-in-from-right-4">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">{t('contact.form_name')}</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all" placeholder={t('contact.form_name')} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">{t('contact.form_email')}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all" placeholder="ornek@mail.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">{t('contact.form_msg')}</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={6} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 resize-none" placeholder={t('contact.form_msg') + "..."} required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('contact.sending')}</> : <><Lock className="w-5 h-5" /> {t('contact.send_code')}</>}
                </button>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={handleVerifyAndSubmit} className="space-y-6 text-center animate-in fade-in zoom-in py-8">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4"><Mail className="w-8 h-8" /></div>
                <div>
                  <h4 className="text-xl font-bold text-white">{t('contact.verify_title')}</h4>
                  <p className="text-gray-400 text-sm mt-2"><span className="text-white font-mono">{formData.email}</span> {t('contact.verify_desc')}</p>
                </div>
                <input value={userCode} onChange={(e) => setUserCode(e.target.value)} className="w-40 bg-slate-950 border border-blue-500/50 rounded-xl p-4 text-center text-2xl font-bold text-white tracking-widest outline-none focus:ring-2 focus:ring-blue-500 mx-auto block" placeholder="000000" maxLength={6} autoFocus />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep('form')} className="flex-1 py-3 text-gray-400 hover:text-white transition-colors">{t('contact.back_btn')}</button>
                  <button type="submit" disabled={loading} className="flex-[2] bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('contact.verify_btn')} <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{error}</p>}
              </form>
            )}

            {step === 'success' && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-green-500/5 rounded-xl border border-green-500/20 animate-in fade-in zoom-in">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20"><CheckCircle className="w-8 h-8" /></div>
                <h4 className="text-xl font-bold text-white mb-2">{t('contact.success_title')}</h4>
                <p className="text-green-300 text-sm">{t('contact.success_desc')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
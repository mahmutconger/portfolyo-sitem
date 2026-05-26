import React, { useState } from 'react';
import {
  Mail, CheckCircle, Copy, Loader2, Lock, ArrowRight,
  Github, Linkedin, FileText, ExternalLink,
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';

const PUBLIC_KEY       = 'NVd_00kA9C2KrM8gL';
const SERVICE_ID       = 'service_qrqlzfe';
const TEMPLATE_VERIFY  = 'template_ftdoyq1';
const TEMPLATE_ADMIN   = 'template_xdwo66g';

const Contact = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'form' | 'verify' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const copyEmail = () => {
    navigator.clipboard.writeText('mahmutconger@gmail.com');
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
      await emailjs.send(SERVICE_ID, TEMPLATE_VERIFY, {
        to_name: formData.name,
        to_email: formData.email,
        code,
      }, PUBLIC_KEY);
      setLoading(false);
      setStep('verify');
    } catch {
      setLoading(false);
      setError(t('contact.sending'));
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userCode !== generatedCode) {
      setError(t('contact.verify_btn'));
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: new Date(),
        isRead: false,
        verified: true,
      });
      const now = new Date();
      await emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        time: `${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR')}`,
        to_email: 'mahmutconger@gmail.com',
      }, PUBLIC_KEY);
      setLoading(false);
      setStep('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => { setStep('form'); setUserCode(''); }, 5000);
    } catch {
      setLoading(false);
      setError('Bir hata oluştu.');
    }
  };

  const inputCls = [
    'w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3',
    'text-white text-sm outline-none placeholder-zinc-600',
    'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40',
    'transition-all duration-200',
  ].join(' ');

  return (
    <section id="contact" className="py-28 bg-zinc-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-indigo-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="mb-14">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            {t('contact.label')}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
            {t('contact.title')}
          </h2>
          <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
            {t('contact.desc')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* ── Left: contact info ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-[0.18em] mb-5">
              {t('contact.channels')}
            </p>

            {/* GitHub */}
            <a
              href="https://github.com/mahmutconger"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl hover:border-zinc-600 hover:bg-zinc-800 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">GitHub</p>
                <p className="text-xs text-zinc-500">@mahmutconger</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-600 ml-auto shrink-0" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/mahmut-can-conger-4305b1299/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl hover:border-[#0077b5]/50 hover:bg-zinc-800 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-[#0077b5] transition-colors">
                <Linkedin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">LinkedIn</p>
                <p className="text-xs text-zinc-500">Mahmut Can Çönger</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-600 ml-auto shrink-0" />
            </a>

            {/* CV Download */}
            <a
              href="/CV_TR.pdf"
              download="Mahmut_Can_Conger_CV.pdf"
              className="flex items-center gap-3 p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl hover:border-emerald-500/40 hover:bg-zinc-800 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">{t('contact.cv_btn')}</p>
                <p className="text-xs text-zinc-500">{t('contact.cv_format')}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-600 ml-auto shrink-0" />
            </a>

            {/* Direct email */}
            <div className="p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-400">{t('contact.direct_mail')}</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-900 rounded-lg px-3 py-2.5 border border-zinc-800">
                <span className="text-xs font-mono text-zinc-300 truncate">
                  mahmutconger@gmail.com
                </span>
                <button
                  onClick={copyEmail}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white ml-2 shrink-0"
                >
                  {copied
                    ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                    : <Copy className="w-4 h-4" />
                  }
                </button>
              </div>
              {copied && (
                <p className="text-[11px] text-emerald-400 text-right mt-1.5">
                  {t('contact.copy_success')}
                </p>
              )}
            </div>
          </div>

          {/* ── Right: form ────────────────────────────────────── */}
          <div className="lg:col-span-3 bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-6 md:p-8">

            {/* Step 1 — Form */}
            {step === 'form' && (
              <form
                onSubmit={handleSendCode}
                className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300"
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">
                      {t('contact.form_name')}
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder={t('contact.form_name')}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">
                      {t('contact.form_email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder="ornek@mail.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">
                    {t('contact.form_msg')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`${inputCls} resize-none`}
                    placeholder={`${t('contact.form_msg')}…`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('contact.sending')}</>
                    : <><Lock className="w-4 h-4" /> {t('contact.send_code')}</>
                  }
                </button>

                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}
              </form>
            )}

            {/* Step 2 — Verify */}
            {step === 'verify' && (
              <form
                onSubmit={handleVerifyAndSubmit}
                className="space-y-6 text-center py-8 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Mail className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {t('contact.verify_title')}
                  </h4>
                  <p className="text-zinc-400 text-sm">
                    <span className="font-mono text-white">{formData.email}</span>{' '}
                    {t('contact.verify_desc')}
                  </p>
                </div>

                <input
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-40 bg-zinc-950 border border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 rounded-xl p-4 text-center text-2xl font-bold text-white tracking-widest outline-none mx-auto block transition-all"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="flex-1 py-3 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {t('contact.back_btn')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    {loading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <>{t('contact.verify_btn')} <ArrowRight className="w-4 h-4" /></>
                    }
                  </button>
                </div>

                {error && (
                  <p className="text-red-400 text-xs bg-red-500/10 p-2 rounded-lg">{error}</p>
                )}
              </form>
            )}

            {/* Step 3 — Success */}
            {step === 'success' && (
              <div className="flex flex-col items-center justify-center text-center py-16 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {t('contact.success_title')}
                </h4>
                <p className="text-emerald-400 text-sm">{t('contact.success_desc')}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import React, { useState } from "react";
import {
  Mail,
  CheckCircle,
  Copy,
  Loader2,
  Lock,
  ArrowRight,
  Github,
  Linkedin,
  FileText,
  ExternalLink,
} from "../components/ui/icons";
import { collection, addDoc } from "firebase/firestore";
import { db, firebaseConfigured } from "../firebase";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import { useAnalytics } from "../hooks/useAnalytics";

const PUBLIC_KEY = "NVd_00kA9C2KrM8gL";
const SERVICE_ID = "service_qrqlzfe";
const TEMPLATE_VERIFY = "template_ftdoyq1";
const TEMPLATE_ADMIN = "template_xdwo66g";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const tr = i18n.language.startsWith("tr");
  const { trackEvent } = useAnalytics();
  const [step, setStep] = useState<"form" | "verify" | "success">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("mahmutconger@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        tr
          ? "E-posta kopyalanamadı: mahmutconger@gmail.com"
          : "Could not copy: mahmutconger@gmail.com",
      );
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseConfigured) {
      setError(
        tr
          ? "Form şu anda kullanılamıyor. Bana doğrudan e-posta gönderebilirsiniz."
          : "The form is unavailable. You can email me directly.",
      );
      return;
    }
    setLoading(true);
    setError("");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_VERIFY,
        {
          to_name: formData.name,
          to_email: formData.email,
          code,
        },
        PUBLIC_KEY,
      );
      setLoading(false);
      setStep("verify");
    } catch {
      setLoading(false);
      setError(
        tr
          ? "Kod gönderilemedi. Lütfen tekrar deneyin."
          : "Could not send the code. Please try again.",
      );
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userCode !== generatedCode) {
      setError(
        tr
          ? "Doğrulama kodu eşleşmiyor. Lütfen kontrol edin."
          : "The code does not match. Please check it.",
      );
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: new Date(),
        isRead: false,
        verified: true,
      });
      const now = new Date();
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ADMIN,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          time: `${now.toLocaleDateString("tr-TR")} ${now.toLocaleTimeString("tr-TR")}`,
          to_email: "mahmutconger@gmail.com",
        },
        PUBLIC_KEY,
      );
      setLoading(false);
      setStep("success");
      trackEvent("contact_submit");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => {
        setStep("form");
        setUserCode("");
      }, 5000);
    } catch {
      setLoading(false);
      setError(tr ? "Bir hata oluştu." : "Something went wrong.");
    }
  };

  const inputCls = [
    "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3",
    "text-white text-sm outline-none placeholder-zinc-600",
    "focus:border-[#2C74B3] focus:ring-1 focus:ring-[#2C74B3]/40",
    "transition-all duration-200",
  ].join(" ");

  return (
    <section
      id="contact"
      className="py-28 bg-zinc-900 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-[#205295]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Bölüm başlığı */}
        <div className="mb-14">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            {t("contact.label")}
          </p>
          <h1
            tabIndex={-1}
            data-section-heading
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3"
          >
            {t("contact.title")}
          </h1>
          <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
            {t("contact.desc")}
          </p>
        </div>

        <div className="contact-layout grid lg:grid-cols-5 gap-10">
          {/* İletişim kanalları */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-[0.18em] mb-5">
              {t("contact.channels")}
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
              className="flex items-center gap-3 p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl hover:border-[#2C74B3]/50 hover:bg-zinc-800 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-[#9BC7E8] transition-colors">
                <Linkedin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">LinkedIn</p>
                <p className="text-xs text-zinc-500">Mahmut Can Çönger</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-600 ml-auto shrink-0" />
            </a>

            {/* CV indirme */}
            <a
              href="/Mahmut_Can_CONGER_CV.pdf"
              download="Mahmut_Can_Conger_CV.pdf"
              onClick={() => trackEvent("cv_download", "contact")}
              className="flex items-center gap-3 p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl hover:border-[#2C74B3]/40 hover:bg-zinc-800 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-[#9BC7E8] transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">
                  {t("contact.cv_btn")}
                </p>
                <p className="text-xs text-zinc-500">
                  {t("contact.cv_format")}
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-600 ml-auto shrink-0" />
            </a>

            {/* Doğrudan e-posta */}
            <div className="p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-400">
                  {t("contact.direct_mail")}
                </span>
              </div>
              <div className="flex items-center justify-between bg-zinc-900 rounded-lg px-3 py-2.5 border border-zinc-800">
                <a
                  href="mailto:mahmutconger@gmail.com"
                  className="text-xs font-mono text-zinc-300 truncate"
                >
                  mahmutconger@gmail.com
                </a>
                <button
                  onClick={copyEmail}
                  aria-label={
                    copied
                      ? tr
                        ? "E-posta kopyalandı"
                        : "Email copied"
                      : tr
                        ? "E-postayı kopyala"
                        : "Copy email"
                  }
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white ml-2 shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-[#9BC7E8]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-[11px] text-[#9BC7E8] text-right mt-1.5">
                  {t("contact.copy_success")}
                </p>
              )}
            </div>
          </div>

          {/* Mesaj formu */}
          <div className="lg:col-span-3 bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-6 md:p-8">
            {/* Birinci adım: form */}
            {step === "form" && (
              <form
                onSubmit={handleSendCode}
                className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300"
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-medium text-zinc-400"
                    >
                      {t("contact.form_name")}
                    </label>
                    <input
                      id="contact-name"
                      autoComplete="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder={t("contact.form_name")}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-medium text-zinc-400"
                    >
                      {t("contact.form_email")}
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      autoComplete="email"
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
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-medium text-zinc-400"
                  >
                    {t("contact.form_msg")}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`${inputCls} resize-none`}
                    placeholder={`${t("contact.form_msg")}…`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2C74B3] hover:bg-[#205295] disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />{" "}
                      {t("contact.sending")}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> {t("contact.send_code")}
                    </>
                  )}
                </button>

                {error && (
                  <p role="alert" className="text-red-400 text-xs text-center">
                    {error}
                  </p>
                )}
              </form>
            )}

            {/* İkinci adım: doğrulama */}
            {step === "verify" && (
              <form
                onSubmit={handleVerifyAndSubmit}
                className="space-y-6 text-center py-8 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="w-14 h-14 bg-[#2C74B3]/10 text-[#9BC7E8] rounded-2xl flex items-center justify-center mx-auto">
                  <Mail className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {t("contact.verify_title")}
                  </h4>
                  <p className="text-zinc-400 text-sm">
                    <span className="font-mono text-white">
                      {formData.email}
                    </span>{" "}
                    {t("contact.verify_desc")}
                  </p>
                </div>

                <input
                  aria-label={tr ? "Doğrulama kodu" : "Verification code"}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-40 bg-zinc-950 border border-zinc-700 focus:border-[#2C74B3] focus:ring-1 focus:ring-[#2C74B3]/40 rounded-xl p-4 text-center text-2xl font-bold text-white tracking-widest outline-none mx-auto block transition-all"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="flex-1 py-3 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {t("contact.back_btn")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-[#2C74B3] hover:bg-[#205295] text-white py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {t("contact.verify_btn")}{" "}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="text-red-400 text-xs bg-red-500/10 p-2 rounded-lg"
                  >
                    {error}
                  </p>
                )}
              </form>
            )}

            {/* Üçüncü adım: başarı */}
            {step === "success" && (
              <div className="flex flex-col items-center justify-center text-center py-16 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-[#2C74B3] text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-[#2C74B3]/20">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {t("contact.success_title")}
                </h4>
                <p className="text-[#9BC7E8] text-sm">
                  {t("contact.success_desc")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

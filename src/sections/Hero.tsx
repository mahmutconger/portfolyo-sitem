import { Github, Linkedin, Mail, ArrowRight, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../hooks/useAnalytics';

const Hero = () => {
  const { t } = useTranslation();
  const { trackEvent } = useAnalytics();

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a18_1px,transparent_1px),linear-gradient(to_bottom,#27272a18_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Radial glow blobs */}
      <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-indigo-600/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/6 w-[500px] h-[500px] bg-purple-700/6 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center gap-16 pt-20 pb-16">

        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left">

          

          {/* Name */}
          <h1 className="text-5xl md:text-[68px] font-bold tracking-tight text-white mb-5 leading-[1.05]">
            Mahmut Can{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
              ÇÖNGER
            </span>
          </h1>

          {/* Description */}
          <p className="text-zinc-400 text-[17px] leading-relaxed mb-10 max-w-lg mx-auto md:mx-0">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start mb-10">
            <a
              href="#projects"
              onClick={scrollToProjects}
              className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5"
            >
              {t('hero.projects_btn')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="/Mahmut_Can_CONGER_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('cv_download', 'hero')}
              className="flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-white/5 text-white text-sm font-semibold rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              {t('hero.cv_download')}
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2.5 justify-center md:justify-start">
            {[
              { href: 'https://github.com/mahmutconger', icon: <Github className="w-[18px] h-[18px]" />, label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/mahmut-can-conger-4305b1299/', icon: <Linkedin className="w-[18px] h-[18px]" />, label: 'LinkedIn' },
              { href: 'mailto:mahmutconger@gmail.com', icon: <Mail className="w-[18px] h-[18px]" />, label: 'Email' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={item.label}
                onClick={() => trackEvent('social_click', item.label.toLowerCase())}
                className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200 hover:-translate-y-0.5"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right: Profile photo */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative group">
            {/* Animated gradient ring */}
            <div className="absolute -inset-[3px] bg-gradient-to-br from-indigo-500 via-purple-600 to-zinc-800 rounded-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 blur-[3px]" />

            {/* Photo */}
            <div className="relative w-64 h-64 md:w-[300px] md:h-[300px] rounded-3xl overflow-hidden border border-white/5">
              <img
                src="/profile.jpg"
                alt="Mahmut Can Çönger"
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/30 via-transparent to-transparent" />
            </div>

            {/* Floating terminal card */}
            <div className="absolute -bottom-4 -left-5 bg-zinc-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-zinc-700/60 shadow-2xl">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <code className="text-[11px] font-mono text-indigo-300">&lt;Android /&gt;</code>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
        <span className="text-[10px] uppercase tracking-[0.25em]">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;

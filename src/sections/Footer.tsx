import { Mail, Github, Linkedin, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo + copyright */}
          <div className="text-center md:text-left">
            <span className="font-mono font-bold text-base tracking-tighter">
              <span className="text-white">Can</span>
              <span className="text-indigo-400">.kt</span>
            </span>
            <p className="text-zinc-600 text-xs mt-0.5">© 2025 {t('footer.rights')}</p>
          </div>

          {/* CTA link */}
          <a
            href="mailto:mahmutconger@gmail.com"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors duration-200"
          >
            <Mail className="w-4 h-4" />
            {t('footer.mail_btn')}
          </a>

          {/* Social + scroll-to-top */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/mahmutconger"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/mahmut-can-conger-4305b1299/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-[#0077b5] transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-500 hover:text-white transition-all duration-200 group"
              aria-label="Yukarı çık"
            >
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

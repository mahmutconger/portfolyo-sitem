import { Mail, Github, Linkedin, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 py-12 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t('footer.cta')}
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                {t('footer.cta_desc')}
            </p>
            
            <a 
                href="mailto:mahmutconger@gmail.com" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
                <Mail className="w-5 h-5" />
                {t('footer.mail_btn')}
            </a>
        </div>

        <div className="w-full h-px bg-white/10 mb-8"></div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="text-center md:text-left">
                <span className="text-xl font-bold font-mono tracking-tighter cursor-default">
                    <span className="text-white">Can</span>
                    <span className="text-purple-400">.kt</span>
                </span>
                <p className="text-gray-500 text-sm mt-1">© 2025 {t('footer.rights')}</p>
            </div>

            <div className="flex items-center gap-6">
                <a href="https://github.com/mahmutconger" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Github className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/mahmut-can-conger-4305b1299/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Linkedin className="w-6 h-6" />
                </a>
            </div>

            <button 
                onClick={scrollToTop}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors group"
                aria-label={t('nav.home')}
            >
                <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
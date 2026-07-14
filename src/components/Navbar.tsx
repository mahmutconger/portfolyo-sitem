import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (isHomePage) {
        const sections = ['home', 'about', 'tech', 'projects', 'articles', 'contact'];
        for (const section of [...sections].reverse()) {
          const el = document.getElementById(section);
          if (el && el.getBoundingClientRect().top <= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navItems = [
    { name: t('nav.home'), to: 'home' },
    { name: t('nav.about'), to: 'about' },
    { name: t('nav.tech'), to: 'tech' },
    { name: t('nav.projects'), to: 'projects' },
    { name: t('nav.articles'), to: 'articles' },
    { name: t('nav.contact'), to: 'contact' },
  ];

  const scrollToElement = (id: string) => {
    setIsOpen(false);
    if (isHomePage) {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }, 150);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono font-bold text-[17px] tracking-tighter"
          >
            <span className="text-white">Can</span>
            <span className="text-indigo-400">.kt</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.to}
                onClick={() => scrollToElement(item.to)}
                className={`relative px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isHomePage && activeSection === item.to
                    ? 'text-white font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.name}
                {isHomePage && activeSection === item.to && (
                  <span className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-indigo-400" />
                )}
              </button>
            ))}
          </div>

          {/* Right: flags + mobile toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pl-4 border-l border-white/5">
              <button
                onClick={() => changeLanguage('tr')}
                className={`transition-all duration-200 ${i18n.language === 'tr' ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-70'}`}
                title="Türkçe"
              >
                <img src="https://flagcdn.com/w20/tr.png" alt="TR" className="w-5 h-auto rounded-sm" />
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`transition-all duration-200 ${i18n.language === 'en' ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-70'}`}
                title="English"
              >
                <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5 h-auto rounded-sm" />
              </button>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-6xl mx-auto px-6 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.to}
                onClick={() => scrollToElement(item.to)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isHomePage && activeSection === item.to
                    ? 'text-white bg-white/[0.06]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

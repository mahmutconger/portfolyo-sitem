import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { Menu, X, Globe } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';

// 1. ALT BİLEŞENLERİ DIŞARIDA TANIMLIYORUZ (Hatanın çözümü burada)
const LanguageSwitcher = ({ 
  mobile = false, 
  currentLang, 
  onChange 
}: { 
  mobile?: boolean, 
  currentLang: string, 
  onChange: (lng: string) => void 
}) => (
  <div className={`flex items-center gap-3 ${mobile ? 'mt-4 px-3' : 'ml-6 border-l border-white/10 pl-6'}`}>
    <button 
      onClick={() => onChange('tr')}
      className={`transition-all ${currentLang === 'tr' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80'}`}
      title="Türkçe"
    >
      <img src="https://flagcdn.com/w20/tr.png" alt="TR" className="w-5 h-auto rounded-sm shadow-sm" />
    </button>
    <button 
      onClick={() => onChange('en')}
      className={`transition-all ${currentLang === 'en' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80'}`}
      title="English"
    >
      <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5 h-auto rounded-sm shadow-sm" />
    </button>
  </div>
);

const NavItem = ({ 
  to, 
  name, 
  mobile = false, 
  isActive, 
  isHomePage, 
  onClick 
}: { 
  to: string, 
  name: string, 
  mobile?: boolean, 
  isActive: boolean, 
  isHomePage: boolean,
  onClick: (id: string) => void
}) => {
  const baseClasses = mobile 
    ? "block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer"
    : "cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-all hover:text-white";

  const inactiveClass = "text-gray-300 hover:bg-white/10";
  const activeClass = "text-blue-400 bg-white/10 font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)]";

  return (
    <button
      onClick={() => onClick(to)}
      className={`${baseClasses} ${isHomePage && isActive ? activeClass : inactiveClass}`}
    >
      {name}
    </button>
  );
};

// 2. ANA NAVBAR BİLEŞENİ
const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); 
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);

      if (isHomePage) {
        const sections = ['home', 'about', 'tech', 'projects', 'contact'];
        const reversedSections = [...sections].reverse();
        
        for (const section of reversedSections) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 150) { 
                    setActiveSection(section);
                    break; 
                }
            }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navItems = [
    { name: t('nav.home'), to: "home" },
    { name: t('nav.about'), to: "about" },
    { name: t('nav.tech'), to: "tech" },
    { name: t('nav.projects'), to: "projects" },
    { name: t('nav.contact'), to: "contact" },
  ];

  const scrollToElement = (id: string) => {
    if (isHomePage) {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    } else {
        navigate("/");
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 150);
    }
    setIsOpen(false); 
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div 
            className="flex-shrink-0 cursor-pointer group flex items-center gap-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="text-xl font-bold font-mono tracking-tighter">
              <span className="text-white">Can</span>
              <span className="text-purple-400">.kt</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <div className="flex items-baseline space-x-2">
              {navItems.map((item) => (
                <NavItem 
                  key={item.to} 
                  to={item.to} 
                  name={item.name} 
                  isActive={activeSection === item.to}
                  isHomePage={isHomePage}
                  onClick={scrollToElement}
                />
              ))}
            </div>
            <LanguageSwitcher 
              currentLang={i18n.language} 
              onChange={changeLanguage} 
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
            {navItems.map((item) => (
                <NavItem 
                  key={item.to} 
                  to={item.to} 
                  name={item.name} 
                  mobile={true} 
                  isActive={activeSection === item.to}
                  isHomePage={isHomePage}
                  onClick={scrollToElement}
                />
            ))}
            <div className="pt-4 border-t border-white/5">
              <p className="px-3 text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Globe size={12} /> {t('nav.select_language')}
              </p>
              <LanguageSwitcher 
                mobile={true} 
                currentLang={i18n.language} 
                onChange={changeLanguage} 
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { Menu, X } from 'lucide-react'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); // Hangi bölümdeyiz?
  
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  // Scroll dinleyicisi (Hem Navbar stili hem de Active Section için)
  useEffect(() => {
    const handleScroll = () => {
      // 1. Navbar Arkaplanı
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);

      // 2. Active Section (Spy) Mantığı
      if (isHomePage) {
        const sections = ['home', 'about', 'tech', 'projects', 'contact'];
        
        // Tersten kontrol ediyoruz ki en alttaki önce yakalansın
        for (const section of sections.reverse()) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                // Eğer bölümün üst kısmı ekranın üst yarısındaysa (veya biraz altındaysa) aktiftir
                if (rect.top <= 150) { 
                    setActiveSection(section);
                    break; // Bulunca döngüden çık
                }
            }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navItems = [
    { name: "Ana Sayfa", to: "home" },
    { name: "Hakkımda", to: "about" },
    { name: "Yetenekler", to: "tech" },
    { name: "Projeler", to: "projects" },
    { name: "İletişim", to: "contact" },
  ];

  // Yumuşak Kaydırma Fonksiyonu
  const scrollToElement = (id: string) => {
    if (isHomePage) {
        const element = document.getElementById(id);
        if (element) {
            // Navbar yüksekliği (80px) kadar pay bırakarak kaydır
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    } else {
        navigate("/");
        // Sayfa değiştikten sonra kaydır
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 100);
    }
    setIsOpen(false); // Mobilde menüyü kapat
  };

  const NavItem = ({ to, name, mobile = false }: { to: string, name: string, mobile?: boolean }) => {
    const baseClasses = mobile 
      ? "block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer"
      : "cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-all hover:text-white";

    const isActive = activeSection === to;
    
    // Aktiflik Stilleri
    const inactiveClass = "text-gray-300 hover:bg-white/10";
    const activeClass = "text-blue-400 bg-white/10 font-bold shadow-[0_0_10px_rgba(59,130,246,0.5)]";

    return (
      <button
        onClick={() => scrollToElement(to)}
        className={`${baseClasses} ${isHomePage && isActive ? activeClass : inactiveClass}`}
      >
        {name}
      </button>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Kısmı */}
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
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavItem key={item.name} to={item.to} name={item.name} />
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
                <NavItem key={item.name} to={item.to} name={item.name} mobile={true} />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
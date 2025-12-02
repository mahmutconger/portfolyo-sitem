import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll'; // Kaydırma için
import { useLocation, useNavigate } from 'react-router-dom'; // Sayfa kontrolü için
import { Menu, X } from 'lucide-react'; // Hamburger menü ikonları

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobil menü durumu
  const [scrolled, setScrolled] = useState(false); // Navbar arkaplanı için
  
  const location = useLocation();
  const navigate = useNavigate();

  // Şu an Ana Sayfada mıyız kontrolü
  const isHomePage = location.pathname === "/";

  // Scroll dinleyicisi (Navbar arkaplanını koyulaştırmak için)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menü Elemanları
  const navItems = [
    { name: "Ana Sayfa", to: "home" },
    { name: "Hakkımda", to: "about" },
    { name: "Yetenekler", to: "tech" },
    { name: "Projeler", to: "projects" },
    { name: "İletişim", to: "contact" },
  ];

  // Link Bileşeni (Custom Link)
  const NavItem = ({ to, name, mobile = false }: { to: string, name: string, mobile?: boolean }) => {
    const baseClasses = mobile 
      ? "block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer"
      : "cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-all hover:text-white";

    const inactiveClass = "text-gray-300 hover:bg-white/10";
    const activeClass = "text-blue-400 bg-white/10 font-bold shadow-[0_0_10px_rgba(59,130,246,0.5)]"; // Aktif olduğunda parlasın

    // Eğer ANA SAYFADAYSAK -> ScrollLink kullan (Kayarak git + Spy)
    if (isHomePage) {
      return (
        <ScrollLink
          to={to}
          smooth={true}     // Kayarak git
          duration={800}    // Ne kadar sürsün (ms)
          spy={true}        // Casus: Görünürde mi kontrol et
          offset={-80}      // Navbar yüksekliği kadar pay bırak (Üstüne binmesin)
          activeClass={activeClass} // Aktif olunca bu class'ı ekle
          className={`${baseClasses} ${!mobile ? "text-gray-300" : ""}`} // Varsayılan class
          onClick={() => setIsOpen(false)} // Mobilde tıklayınca menüyü kapat
        >
          {name}
        </ScrollLink>
      );
    } 
    
    // Eğer BAŞKA SAYFADAYSAK -> Normal yönlendirme yap
    else {
      return (
        <button
          onClick={() => {
            navigate("/"); // Önce ana sayfaya git
            // Biraz bekle sonra oraya kaydır (Opsiyonel karmaşık mantık yerine direkt /'a atıyoruz)
            setTimeout(() => {
                const element = document.getElementById(to);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            setIsOpen(false);
          }}
          className={`${baseClasses} ${inactiveClass}`}
        >
          {name}
        </button>
      );
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
         {/* Logo / İsim Kısmı */}
          <div 
            className="flex-shrink-0 cursor-pointer group flex items-center gap-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* 1. Opsiyon: Android Robot İkonu (Yeşil) */}
            {/* <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                <Smartphone className="w-5 h-5" />
            </div> */}

            {/* 2. Opsiyon: Text Logo (Benim Önerim: Kotlin Tarzı) */}
            <span className="text-xl font-bold font-mono tracking-tighter">
              <span className="text-white">Can</span>
              <span className="text-purple-400">.kt</span> {/* Kotlin rengi mor/mavi */}
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

      {/* Mobile Menu (Açılır/Kapanır) */}
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
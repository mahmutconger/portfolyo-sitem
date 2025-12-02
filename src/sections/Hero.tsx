import React from 'react';
import { Github, Linkedin, Mail, ArrowRight, Smartphone, Terminal, Cpu, Code2, Download } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden bg-slate-950">
      
      {/* --- 1. ARKA PLAN EFEKTLERİ --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <style>{`
            @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
            @keyframes float-delayed { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(20px) rotate(-5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
          `}</style>
          <div className="absolute top-20 left-10 text-slate-800/50 animate-[float_6s_ease-in-out_infinite]"><Terminal size={64} /></div>
          <div className="absolute bottom-20 right-10 text-slate-800/50 animate-[float-delayed_7s_ease-in-out_infinite]"><Smartphone size={80} /></div>
          <div className="absolute top-32 right-20 text-blue-900/20 animate-[float_8s_ease-in-out_infinite]"><Cpu size={56} /></div>
          <div className="absolute bottom-32 left-20 text-purple-900/20 animate-[float-delayed_9s_ease-in-out_infinite]"><Code2 size={48} /></div>
      </div>

      {/* --- 2. ANA İÇERİK --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center gap-12 relative z-10">
        
        {/* SOL: Yazılar */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Full Stack Android Developer
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Mahmut Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 animate-gradient">ÇÖNGER</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            Fikirleri, <strong className="text-white">Kotlin</strong> ve <strong className="text-white">Jetpack Compose</strong> gücüyle yaşayan mobil deneyimlere dönüştürüyorum. 
            Modern mimari, temiz kod ve yüksek performans odaklı çözümler üretiyorum.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <a href="#projects" className="group relative px-8 py-3 bg-blue-600 rounded-full text-white font-medium overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="flex items-center gap-2 relative">
                Projelerimi İncele <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <div className="flex items-center gap-3 ml-0 sm:ml-4">
              <SocialButton href="https://github.com/mahmutconger" icon={<Github className="w-5 h-5" />} label="GitHub" />
              <SocialButton href="https://www.linkedin.com/in/mahmut-can-conger-4305b1299/" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
              <SocialButton href="mailto:mahmutconger@gmail.com" icon={<Mail className="w-5 h-5" />} label="Email" />
              <a href="/CV-TR.pdf" target="_blank" className="p-3 bg-slate-800 rounded-full text-gray-400 hover:text-green-400 hover:bg-slate-700 transition-all border border-white/5 hover:border-green-500/30 group" title="CV'yi İndir">
                 <Download className="w-5 h-5 group-hover:animate-bounce" />
               </a>
            </div>
          </div>
        </div>

        {/* SAĞ: Profil Resmi */}
        <div className="flex-1 relative group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-blue-500 via-purple-500 to-transparent rounded-full opacity-50 blur-xl animate-[spin_10s_linear_infinite]"></div>
            
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl z-10">
                {/* GÜNCELLEME BURADA: 
                    src kısmını kendi fotoğrafınızın adıyla değiştirdim.
                    Eğer dosya adınız farklıysa (örn: resim.png), aşağıyı "/resim.png" yapın.
                */}
                <img 
                    src="/profile.jpg" 
                    alt="Mahmut Can Çönger" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="absolute -bottom-4 right-10 md:right-20 bg-slate-800/90 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl animate-[float_4s_ease-in-out_infinite] z-20">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mt-2 text-xs font-mono text-blue-300">
                    &lt;Android /&gt;
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

const SocialButton = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="p-3 bg-slate-800 rounded-full text-gray-400 hover:text-white hover:bg-slate-700 transition-all border border-white/5 hover:border-blue-500/30 hover:-translate-y-1"
        aria-label={label}
    >
        {icon}
    </a>
);

export default Hero;
import React from 'react';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Sol Taraf: Yazılar (Text Content) */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-blue-400 font-semibold tracking-wide uppercase mb-4">
            Merhaba, Ben
          </h2>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Çonger</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto md:mx-0">
            Modern ve performanslı mobil uygulamalar geliştiren bir Android Geliştiricisiyim. 
            Kotlin ve Jetpack Compose teknolojileriyle kullanıcı deneyimini ön planda tutuyorum.
          </p>

          {/* Butonlar Grubu */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            
            {/* Projelerime Git Butonu (Primary Action) */}
            <a href="#projects" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2">
              Projelerimi Gör
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Sosyal Medya İkonları */}
            <div className="flex items-center gap-4 ml-0 sm:ml-4">
              <a href="https://github.com/mahmutconger" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors border border-white/10">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-blue-400 transition-colors border border-white/10">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:email@adresiniz.com" className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-red-400 transition-colors border border-white/10">
                <Mail className="w-5 h-5" />
              </a>
            </div>

          </div>
        </div>

        {/* Sağ Taraf: Profil Resmi (Image Content) */}
        <div className="flex-1 relative">
            {/* Arkadaki Parlama Efekti (Blur) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            {/* Resim Çerçevesi */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl">
                <img 
                    src="https://ui-avatars.com/api/?name=Can+Conger&background=0D8ABC&color=fff&size=512" 
                    alt="Can Çonger" 
                    className="w-full h-full object-cover"
                />
            </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
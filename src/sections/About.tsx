import React from 'react';
import { 
  GitBranch, 
  Users, 
  Terminal, 
  Award, 
  GraduationCap, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-slate-950 relative overflow-hidden">
      
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Üst Kısım: Başlık ve Giriş */}
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <h2 className="text-blue-400 font-semibold tracking-wide uppercase mb-2">Profesyonel Profil</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Mühendislik Disipliniyle <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Modern Çözümler</span>
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Merhaba, ben Mahmut Can Çönger. Manisa'da yaşayan, <strong>Manisa Celal Bayar Üniversitesi Yazılım Mühendisliği</strong> öğrencisiyim. 
              Lise eğitimimden bu yana veri tabanı ve yazılım üzerine odaklanmış bir geçmişe sahibim. 
              Sadece kod yazmayı değil, <strong>Clean Architecture</strong> prensiplerine uygun, sürdürülebilir ve ölçeklenebilir sistemler kurmayı hedefliyorum.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          
          {/* SOL TARAF: Mühendislik Prensipleri (İstediğiniz Özellikler) */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Terminal className="w-6 h-6 text-green-400" /> Çalışma Prensibim
            </h4>

            {/* Prensip 1: Git & Versiyonlama */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all group">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-400 group-hover:scale-110 transition-transform">
                        <GitBranch className="w-6 h-6" />
                    </div>
                    <div>
                        <h5 className="text-lg font-bold text-white mb-1">İleri Seviye Git & Versiyonlama</h5>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Projelerimde rastgele commit atmak yerine <strong>"Atomic Commit"</strong> prensibini uygularım. 
                            Her projemi <code>v0.1</code>, <code>v1.0</code> gibi anlamsal versiyonlama (Semantic Versioning) ile yönetir, 
                            dal (branch) yapısını profesyonel standartlarda tutarım.
                        </p>
                    </div>
                </div>
            </div>

            {/* Prensip 2: Ekip Çalışması */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h5 className="text-lg font-bold text-white mb-1">Ekip Çalışması & Adaptasyon</h5>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Agile/Scrum metodolojilerine aşinayım. Takım içi iletişimde şeffaflığa önem verir, 
                            yeni teknolojilere ve değişen gereksinimlere hızla adapte olurum. 
                            Benim için kodun kalitesi kadar ekibin uyumu da önemlidir.
                        </p>
                    </div>
                </div>
            </div>

            {/* Prensip 3: Sürekli Gelişim */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h5 className="text-lg font-bold text-white mb-1">Teknoloji Tutkusu</h5>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Android ekosistemini ve güncel trendleri (Jetpack Compose, AI Entegrasyonu, KMP) yakından takip ederim. 
                            Öğrendiklerimi sadece uygulamakla kalmaz, teknik blog yazılarıyla toplulukla paylaşırım.
                        </p>
                    </div>
                </div>
            </div>

          </div>

          {/* SAĞ TARAF: Eğitim ve Sertifikalar */}
          <div className="space-y-8">
            
            {/* Eğitim */}
            <div>
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-blue-400" /> Eğitim Geçmişim
                </h4>
                <div className="relative border-l-2 border-slate-800 ml-3 space-y-8">
                    
                    {/* Üniversite */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-950"></div>
                        <h5 className="text-white font-bold text-lg">Yazılım Mühendisliği</h5>
                        <div className="text-blue-400 text-sm mb-1">Manisa Celal Bayar Üniversitesi | 2023 - 2027</div>
                        <p className="text-gray-400 text-sm">
                            Yazılım yaşam döngüsü, Çevik metodolojiler, Java, C, MSSQL ve Makine Öğrenmesi üzerine kapsamlı mühendislik eğitimi.
                        </p>
                    </div>

                    {/* Lise */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700 border-4 border-slate-950"></div>
                        <h5 className="text-gray-200 font-bold text-lg">Veri Bilimi ve Depolama</h5>
                        <div className="text-gray-500 text-sm mb-1">Sivas Bilişim Teknolojileri Lisesi | 2019 - 2023</div>
                        <p className="text-gray-400 text-sm">
                            Veri tabanı sistemleri (C#, MSSQL) ve masaüstü uygulamaları üzerine teknik altyapı eğitimi.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sertifikalar */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-500" /> Sertifikalar & Yetkinlikler
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        "Git & GitHub (Advanced)",
                        "Jetpack Compose UI",
                        "Firebase Backend",
                        "İleri Seviye Kotlin",
                        "Versiyon Kontrol Sistemleri"
                    ].map((cert, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300 text-sm p-2 bg-white/5 rounded-lg border border-white/5">
                            <ArrowRight className="w-3 h-3 text-yellow-500" /> {cert}
                        </div>
                    ))}
                </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
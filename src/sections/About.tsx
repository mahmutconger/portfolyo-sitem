import React from 'react';
import { MapPin, Code, Coffee, Sparkles, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-slate-950 relative overflow-hidden">
      
      {/* Arka Plan Süslemeleri (Dekoratif) */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Sol Taraf: Hikaye ve Metin */}
          <div>
            <h2 className="text-blue-400 font-semibold tracking-wide uppercase mb-2">
              Hakkımda
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Kodun Arkasındaki <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Hikaye</span>
            </h3>
            
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                Merhaba! Ben Mahmut Can Çönger. <strong className="text-white">Manisa</strong>'da yaşayan, teknolojiyi sadece tüketmeyi değil, üretmeyi seven bir Yazılım Geliştiricisiyim.
              </p>
              <p>
                Android ekosistemindeki yenilikleri yakından takip ediyorum. Özellikle <strong className="text-blue-300">Jetpack Compose</strong> ile modern arayüzler tasarlamak ve <strong className="text-blue-300">Clean Architecture</strong> prensiplerine sadık kalarak sürdürülebilir kodlar yazmak en büyük tutkum.
              </p>
              <p>
                Sadece kod yazmakla kalmıyor, uygulamalarımı <strong className="text-purple-300">Yapay Zeka (AI)</strong> entegrasyonlarıyla güçlendirmeye çalışıyorum. Boş zamanlarımda teknik blog yazıları yazarak öğrendiklerimi pekiştirmeyi ve toplulukla paylaşmayı seviyorum.
              </p>
            </div>

            {/* İstatistik / Özet Kartları */}
            <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-slate-900 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                    <MapPin className="w-6 h-6 text-blue-400 mb-2" />
                    <h4 className="text-white font-medium">Konum</h4>
                    <p className="text-sm text-gray-500">Manisa, Türkiye</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                    <BookOpen className="w-6 h-6 text-purple-400 mb-2" />
                    <h4 className="text-white font-medium">Öğrenim</h4>
                    <p className="text-sm text-gray-500">Sürekli Gelişim</p>
                </div>
            </div>
          </div>

          {/* Sağ Taraf: Görsel / Yetenek Kartları */}
          <div className="relative">
            {/* Büyük bir kart grubu (Grid Layout) */}
            <div className="grid gap-6">
                
                {/* Kart 1: İlgi Alanı */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                            <Code className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white">Temiz Kod</h4>
                            <p className="text-xs text-gray-400">Clean Architecture & SOLID</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Test edilebilir, ölçeklenebilir ve bakımı kolay kod yapıları kurmaya özen gösteriyorum.
                        "Atomic Commit" prensibiyle çalışırım.
                    </p>
                </div>

                {/* Kart 2: İlgi Alanı */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl hover:-translate-y-1 transition-transform translate-x-4 md:translate-x-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white">UI/UX Tasarım</h4>
                            <p className="text-xs text-gray-400">Kullanıcı Odaklı Deneyim</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Sadece fonksiyonel değil, göze hitap eden ve kullanımı kolay arayüzler geliştirmeye ilgi duyuyorum.
                    </p>
                </div>

                 {/* Kart 3: İlgi Alanı */}
                 <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                            <Coffee className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white">Blog & Paylaşım</h4>
                            <p className="text-xs text-gray-400">Bilgi paylaştıkça çoğalır</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Teknik konularda makaleler yazarak hem kendimi geliştiriyor hem de ekosisteme katkı sağlamaya çalışıyorum.
                    </p>
                </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
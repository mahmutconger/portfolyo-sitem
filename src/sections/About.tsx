import { 
  GitBranch, 
  Users, 
  Terminal, 
  Award, 
  GraduationCap, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <h2 className="text-blue-400 font-semibold tracking-wide uppercase mb-2">{t('about.profile')}</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('about.title_main')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{t('about.title_sub')}</span>
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t('about.description')}
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Terminal className="w-6 h-6 text-green-400" /> {t('about.principles')}
            </h4>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all group">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-400 group-hover:scale-110 transition-transform">
                        <GitBranch className="w-6 h-6" />
                    </div>
                    <div>
                        <h5 className="text-lg font-bold text-white mb-1">{t('about.git_title')}</h5>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t('about.git_desc')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h5 className="text-lg font-bold text-white mb-1">{t('about.team_title')}</h5>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t('about.team_desc')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h5 className="text-lg font-bold text-white mb-1">{t('about.passion_title')}</h5>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t('about.passion_desc')}
                        </p>
                    </div>
                </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-blue-400" /> {t('about.edu_title')}
                </h4>
                <div className="relative border-l-2 border-slate-800 ml-3 space-y-8">
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-950"></div>
                        <h5 className="text-white font-bold text-lg">{t('about.uni')}</h5>
                        <div className="text-blue-400 text-sm mb-1">Manisa Celal Bayar Üniversitesi | 2023 - 2027</div>
                        <p className="text-gray-400 text-sm">
                            {t('about.uni_desc')}
                        </p>
                    </div>

                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700 border-4 border-slate-950"></div>
                        <h5 className="text-gray-200 font-bold text-lg">{t('about.high')}</h5>
                        <div className="text-gray-500 text-sm mb-1">Sivas Bilişim Teknolojileri Lisesi | 2019 - 2023</div>
                        <p className="text-gray-400 text-sm">
                            {t('about.high_desc')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-500" /> {t('about.certs_title')}
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
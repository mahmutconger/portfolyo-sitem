import { GitBranch, Users, BookOpen, GraduationCap, Award, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const certificates = [
  'Git & GitHub (Advanced)',
  'Jetpack Compose UI',
  'Firebase Backend',
  'İleri Seviye Kotlin',
  'Versiyon Kontrol Sistemleri',
];

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-28 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            {t('about.profile')}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {t('about.title_main')}{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t('about.title_sub')}
            </span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Card 1 — Bio (spans 2 cols on lg) */}
          <div className="lg:col-span-2 relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 overflow-hidden hover:border-zinc-700 transition-colors duration-300 group">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/15 transition-colors duration-500" />
            <p className="relative text-zinc-300 text-[17px] leading-relaxed">
              {t('about.description')}
            </p>
          </div>

          {/* Card 2 — Git Principle */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 group hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(52,211,153,0.05)] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5">
              <GitBranch className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="text-white font-semibold mb-2 text-sm">{t('about.git_title')}</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">{t('about.git_desc')}</p>
          </div>

          {/* Card 3 — Education Timeline */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <h4 className="text-white font-semibold text-sm">{t('about.edu_title')}</h4>
            </div>

            <div className="space-y-5 relative">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gradient-to-b from-indigo-500 via-zinc-700 to-zinc-800" />

              {/* University */}
              <div className="pl-6 relative">
                <div className="absolute left-0 top-[4px] w-[15px] h-[15px] rounded-full border-2 border-indigo-500 bg-zinc-900 flex items-center justify-center">
                  <div className="w-[5px] h-[5px] rounded-full bg-indigo-400" />
                </div>
                <p className="text-white font-medium text-sm">{t('about.uni')}</p>
                <p className="text-indigo-400 text-xs mt-0.5 mb-1.5">
                  Manisa Celal Bayar Üni. · 2023–2027
                </p>
                <p className="text-zinc-500 text-xs leading-relaxed">{t('about.uni_desc')}</p>
              </div>

              {/* High school */}
              <div className="pl-6 relative">
                <div className="absolute left-0 top-[4px] w-[15px] h-[15px] rounded-full border-2 border-zinc-600 bg-zinc-900" />
                <p className="text-zinc-300 font-medium text-sm">{t('about.high')}</p>
                <p className="text-zinc-500 text-xs mt-0.5 mb-1.5">
                  Sivas Bilişim Tek. Lisesi · 2019–2023
                </p>
                <p className="text-zinc-500 text-xs leading-relaxed">{t('about.high_desc')}</p>
              </div>
            </div>
          </div>

          {/* Card 4 — Team Principle */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 group hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.05)] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="text-white font-semibold mb-2 text-sm">{t('about.team_title')}</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">{t('about.team_desc')}</p>
          </div>

          {/* Card 5 — Passion */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 group hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.05)] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-5">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="text-white font-semibold mb-2 text-sm">{t('about.passion_title')}</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">{t('about.passion_desc')}</p>
          </div>

          {/* Card 6 — Certificates (full width) */}
          <div className="md:col-span-2 lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-amber-400" />
              <h4 className="text-white font-semibold text-sm">{t('about.certs_title')}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {certificates.map((cert, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300 hover:border-amber-500/40 hover:text-amber-300 transition-all duration-200 cursor-default"
                >
                  <ArrowRight className="w-3 h-3 text-amber-500/60 shrink-0" />
                  {cert}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;

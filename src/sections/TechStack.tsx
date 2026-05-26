import { Code2, Layout, Cpu, GitBranch } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const technologies = [
  { name: 'Android SDK', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/android/android-original-wordmark.svg' },
  { name: 'Kotlin', icon: 'https://www.vectorlogo.zone/logos/kotlinlang/kotlinlang-icon.svg' },
  { name: 'Jetpack Compose', icon: 'https://raw.githubusercontent.com/devicons/devicon/develop/icons/jetpackcompose/jetpackcompose-original.svg' },
  { name: 'Java', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg' },
  { name: 'Firebase', icon: 'https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg' },
  { name: 'SQLite', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original-wordmark.svg' },
  { name: 'Git', icon: 'https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg' },
  { name: 'C#', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg' },
];

const TechStack = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t('tech.clean_title'),
      desc: t('tech.clean_desc'),
      icon: <Layout className="w-5 h-5 text-indigo-400" />,
      accent: 'border-l-indigo-500',
    },
    {
      title: t('tech.compose_title'),
      desc: t('tech.compose_desc'),
      icon: <Code2 className="w-5 h-5 text-emerald-400" />,
      accent: 'border-l-emerald-500',
    },
    {
      title: t('tech.async_title'),
      desc: t('tech.async_desc'),
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      accent: 'border-l-purple-500',
    },
    {
      title: t('tech.atomic_title'),
      desc: t('tech.atomic_desc'),
      icon: <GitBranch className="w-5 h-5 text-orange-400" />,
      accent: 'border-l-orange-500',
    },
  ];

  return (
    <section id="tech" className="py-28 bg-zinc-900 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Stack</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            {t('tech.title')}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
            {t('tech.subtitle')}
          </p>
        </div>

        {/* Tech icon cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="group flex flex-col items-center gap-3 p-5 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl hover:border-indigo-500/40 hover:bg-zinc-800 hover:shadow-[0_0_24px_rgba(99,102,241,0.08)] transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-200 transition-colors duration-200 text-center">
                {tech.name}
              </span>
            </div>
          ))}
        </div>

        {/* Principle cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={`flex items-start gap-4 p-5 bg-zinc-800/40 border border-zinc-700/50 border-l-[3px] ${feat.accent} rounded-xl hover:bg-zinc-800/70 transition-colors duration-200`}
            >
              <div className="mt-0.5 shrink-0">{feat.icon}</div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">{feat.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TechStack;

// React default import not required with the new JSX transform
import { Code2, Layout, Cpu, GitBranch } from 'lucide-react';
const technologies = [
  { name: "Android SDK", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/android/android-original-wordmark.svg" },
  { name: "Kotlin", icon: "https://www.vectorlogo.zone/logos/kotlinlang/kotlinlang-icon.svg" },
  { name: "Jetpack Compose", icon: "https://raw.githubusercontent.com/devicons/devicon/develop/icons/jetpackcompose/jetpackcompose-original.svg" },
  { name: "Java", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" },
  { name: "Firebase", icon: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" },
  { name: "SQLite", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original-wordmark.svg" },
  { name: "Git", icon: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" },
  { name: "C#", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg" },
];

const features = [
  { title: "Clean Architecture", desc: "Sürdürülebilir ve test edilebilir kod yapısı", icon: <Layout className="w-6 h-6 text-blue-400" /> },
  { title: "Jetpack Compose", desc: "Modern UI geliştirme yaklaşımı", icon: <Code2 className="w-6 h-6 text-green-400" /> },
  { title: "Async Programming", desc: "Coroutines & Flow ile verimli işlemler", icon: <Cpu className="w-6 h-6 text-purple-400" /> },
  { title: "Atomic Commits", desc: "Düzenli ve takip edilebilir Git geçmişi", icon: <GitBranch className="w-6 h-6 text-orange-400" /> },
];

const TechStack = () => {
  return (
    <section id="tech" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bölüm Başlığı */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Teknoloji & Yetenekler
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Geliştirme sürecimde kullandığım modern araçlar ve benimsediğim yazılım prensipleri.
          </p>
        </div>

        {/* 1. Kısım: İkon Grid (RecyclerView Grid Layout gibi) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="group bg-slate-900/50 p-6 rounded-xl border border-white/5 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 flex flex-col items-center justify-center gap-4 hover:-translate-y-2"
            >
              <div className="w-16 h-16 p-3 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-300">
                <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-gray-300 font-medium group-hover:text-white">{tech.name}</span>
            </div>
          ))}
        </div>

        {/* 2. Kısım: Prensipler (Features) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-slate-900 rounded-lg border-l-4 border-blue-500 hover:bg-slate-800 transition-colors">
                    <div className="p-2 bg-slate-800 rounded-lg">
                        {feature.icon}
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default TechStack;
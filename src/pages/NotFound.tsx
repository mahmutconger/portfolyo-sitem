import { useNavigate } from 'react-router-dom';
import { Home, Terminal, AlertTriangle } from '../components/ui/icons';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0A2647] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2C74B3]/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="text-center relative z-10">
        <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-[#2C74B3]/30 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative p-8 bg-[#144272]/70 rounded-3xl border border-white/10 backdrop-blur-xl">
                <Terminal className="w-24 h-24 text-[#A3D0EF] relative z-10" />
                <div className="absolute -top-2 -right-2 bg-[#2C74B3] rounded-full p-2 shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-bounce">
                    <AlertTriangle className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>

        <h1 className="text-8xl font-bold text-white mb-4 tracking-tighter">
            4<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2C74B3] to-[#A3D0EF]">0</span>4
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-6 font-mono">
            {t('notfound.subtitle')}
        </h2>
        
        <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed text-lg">
            {t('notfound.description')}
        </p>

        <button 
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 bg-[#2C74B3] hover:bg-[#205295] text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(44,116,179,0.4)]"
        >
            <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            {t('notfound.back_home')}
        </button>
      </div>
    </div>
  );
};

export default NotFound;
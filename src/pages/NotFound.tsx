import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Terminal, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        
        {/* Android Bugdroid veya Terminal Havası */}
        <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <Terminal className="w-32 h-32 text-blue-500 relative z-10 animate-pulse" />
            <AlertTriangle className="w-12 h-12 text-yellow-500 absolute -top-2 -right-2 z-20 animate-bounce" />
        </div>

        <h1 className="text-6xl font-bold text-white mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">
            Activity Not Found Exception!
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
            Aradığınız sayfa derlenemedi veya garbage collector tarafından temizlendi. 
            Lütfen ana thread'e geri dönün.
        </p>

        <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-900/30"
        >
            <Home className="w-5 h-5" />
            Ana Sayfaya Dön
        </button>

      </div>
    </div>
  );
};

export default NotFound;

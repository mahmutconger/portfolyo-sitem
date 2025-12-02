import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // İkonu ekledik

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (error) {
      console.error(error);
      setError('Giriş başarısız. Bilgileri kontrol edin.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative">
      
      {/* SOL ÜST KÖŞE: ANA SAYFAYA DÖN BUTONU */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <div className="p-2 bg-slate-900 rounded-full border border-white/10 group-hover:border-white/30 transition-all">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="font-medium hidden sm:block">Ana Sayfaya Dön</span>
      </button>

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Girişi</h2>
        
        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm text-center border border-red-500/20">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="admin@mail.com"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-900/20">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
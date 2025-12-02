import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Sayfa yönlendirmesi için (Intent gibi)

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Firebase Auth ile giriş yap
      await signInWithEmailAndPassword(auth, email, password);
      // Başarılıysa Admin paneline git
      navigate('/admin');
    } catch (error) { 
      // 1. 'err: any' yerine 'error' dedik.
      // 2. Hatayı konsola yazdırarak 'unused variable' hatasını çözdük.
      console.error(error); 
      setError('Giriş başarısız. Bilgileri kontrol edin.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Girişi</h2>
        
        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Mail Adresi Giriniz!"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
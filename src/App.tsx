import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth'; // 1. User tipini buraya ekledik
import { auth } from './firebase';

// Sayfalar
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AllProjects from './pages/AllProjects';

// --- GÜVENLİK KORUMASI (Guard) ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // 2. Burada 'any' yerine 'User | null' kullandık.
  // Kullanıcı ya 'User' tipindedir ya da henüz giriş yapmamıştır (null).
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Yükleniyor...</div>;
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/all-projects" element={<AllProjects />} /> {/* YENİ */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
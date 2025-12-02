import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

// Sayfalar
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AllProjects from './pages/AllProjects';
// Contact importunu buradan kaldırdık çünkü Home.tsx içinde kullanacağız.

// --- GÜVENLİK KORUMASI (Guard) ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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
      <Route path="/all-projects" element={<AllProjects />} />
      
      {/* Admin Rotası */}
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
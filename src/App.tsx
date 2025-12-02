import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// DÜZELTME: 'User' sadece bir tip olduğu için 'type User' olarak import edilmeli
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase';

import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AllProjects from './pages/AllProjects';

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
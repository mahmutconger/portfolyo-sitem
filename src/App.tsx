import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About"; // 1. İçe Aktar
import TechStack from "./sections/TechStack";
import Projects from "./sections/Projects";
import Footer from "./sections/Footer";

function App() {
  return (
    <div className="bg-slate-900 min-h-screen text-white selection:bg-blue-500 selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        <About />     {/* 2. Hero'dan hemen sonra buraya ekledik */}
        <TechStack />
        <Projects />
      </main>

      <Footer />
    </div>
  )
}

export default App
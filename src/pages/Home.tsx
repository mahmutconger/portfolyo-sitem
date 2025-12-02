import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import TechStack from "../sections/TechStack";
import Projects from "../sections/Projects";
import Contact from "../sections/Contact"; // 1. Buraya Import Edin
import Footer from "../sections/Footer";

function Home() {
  return (
    <div className="bg-slate-900 min-h-screen text-white selection:bg-blue-500 selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <TechStack />
        {/* Ana sayfada sadece öne çıkanları göster (isFullList={false}) */}
        <Projects isFullList={false} />
        <Contact /> {/* 2. Projelerden sonra buraya ekleyin */}
      </main>

      <Footer />
    </div>
  )
}

export default Home;
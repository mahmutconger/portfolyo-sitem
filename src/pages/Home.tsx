import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import TechStack from "../sections/TechStack";
import Projects from "../sections/Projects";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

const Home = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-white selection:bg-blue-500 selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects isFullList={false} />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
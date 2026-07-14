import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import TechStack from "../sections/TechStack";
import Projects from "../sections/Projects";
import Articles from "../sections/Articles";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

const Home = () => {
  return (
    <div className="bg-zinc-950 min-h-screen text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects isFullList={false} />
        <Articles />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
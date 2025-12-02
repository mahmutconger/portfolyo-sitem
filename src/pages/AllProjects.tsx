// React default import not required with the new JSX transform
import Navbar from '../components/Navbar';
import Footer from '../sections/Footer';
import Projects from '../sections/Projects';

const AllProjects = () => {
  return (
    <div className="bg-slate-900 min-h-screen">
      <Navbar /> {/* Menü her sayfada olsun */}
      
      {/* isFullList=true diyerek filtrelemeden hepsini istiyoruz */}
      <Projects isFullList={true} />
      
      <Footer />
    </div>
  );
};

export default AllProjects;
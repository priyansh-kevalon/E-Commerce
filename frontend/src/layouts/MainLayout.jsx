import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Newsletter from '../components/common/Newsletter.jsx';
import Footer from '../components/common/Footer.jsx';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="theme-store flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <div className="border-t border-secondary-100 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 pt-10 pb-4">
          <Newsletter />
        </div>
      </div>
      <Footer />
    </div>
  );
}

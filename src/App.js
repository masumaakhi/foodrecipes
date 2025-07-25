// 
import './App.css';
import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import f1 from "./assets/product/f1.jpg"
import f2 from "./assets/product/f2.jpg"
import sa1 from "./assets/product/sa1.jpg"

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-30 to-amber-100 overflow-hidden">
      {/* Blurred Food Images */}
      <img src={f1} alt="salad" className="absolute top-10 left-0 opacity-30 blur-3xl  pointer-events-none" />
      <img src={f2} alt="pasta" className="absolute bottom-0 right-0 opacity-30 blur-2xl  pointer-events-none" />
      <img src={sa1} alt="pasta" className="absolute left-0 top-0 w-full h-full object-cover opacity-30 blur-2xl  pointer-events-none" />
      <div className='bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl'></div>
      {/* Vignette Effect
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/5"></div> */}
      <div>
        <Nav />
      <Outlet />
      <Footer />
      </div>

    </div>
  );
}

export default App;

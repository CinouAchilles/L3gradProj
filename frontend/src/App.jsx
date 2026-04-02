import { GlowBackground } from "./components/common/GlowBackground";
import { Navbar } from "./components/navigation/Navbar";
import { Outlet, Route, Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HeroSection } from "./components/home/HeroSection";

function App() {
  return (
    <div className="drawer drawer-end">
      <GlowBackground />
      <input id="cart-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content relative min-h-screen">
        <Navbar />
        
        <main className="mx-auto w-[95%] max-w-7xl py-8 md:py-12 top-4 text-white">
          <Routes>
            <Route path="/" element={<HeroSection />} />
          </Routes>
        </main>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </div>
    </div>
  );
}

export default App;

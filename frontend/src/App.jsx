import { Route, Routes } from "react-router-dom";
import { HeroSection } from "./components/home/HeroSection.jsx";
import HomeLayout from "./pages/home/Homelayout.jsx";
import { NotFound } from "./pages/NotFound.jsx";

function App() {
  return (
    <HomeLayout>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        {"not found route"}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HomeLayout>
  );
}

export default App;

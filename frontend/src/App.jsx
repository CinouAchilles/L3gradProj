import { Route, Routes } from "react-router-dom";
import { HeroSection } from "./components/home/HeroSection.jsx";
import HomeLayout from "./pages/home/Homelayout.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import Login from "./pages/Auth/Login.jsx";
import TrackOrder from "./pages/Track/TrackOrder.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Shop from "./pages/cart/Shop.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";

function App() {
  return (
    <HomeLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/track/:trackingCode" element={<TrackOrder/>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/shop" element={<Shop />} />
        {"not found route"}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HomeLayout>
  );
}

export default App;

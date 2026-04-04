import { Route, Routes } from "react-router-dom";
import { HeroSection } from "./components/home/HeroSection.jsx";
import HomeLayout from "./pages/home/Homelayout.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import Login from "./pages/Auth/Login.jsx";
import TrackOrder from "./pages/Track/TrackOrder.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

function App() {
  return (
    <HomeLayout>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/track/:trackingCode" element={<TrackOrder/>} />
        <Route path="/admin" element={<AdminDashboard />} />
        {"not found route"}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HomeLayout>
  );
}

export default App;

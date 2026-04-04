import { GlowBackground } from "../../components/common/GlowBackground";
import { Navbar } from "../../components/navigation/Navbar";
import { Toaster } from "react-hot-toast";
import Categories from "../../components/home/Categories";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Footer from "../../components/home/Footer";
import { CartDrawer } from "../cart/CartDrawer";

function HomeLayout({ children }) {
  return (
    <div className="drawer drawer-end">
      <GlowBackground />
      <input id="cart-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content relative min-h-screen">
        <Navbar />

        <main className="mx-auto w-[95%] max-w-7xl py-8 md:py-12 top-4 text-white">
          {children}
          <Categories />
          <WhyChooseUs />
        </main>

        <Footer />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </div>

      <CartDrawer />
    </div>
  );
}
export default HomeLayout;

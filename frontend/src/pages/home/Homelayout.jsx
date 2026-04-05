import { GlowBackground } from "../../components/common/GlowBackground";
import { Navbar } from "../../components/navigation/Navbar";
import { Toaster } from "react-hot-toast";
import Categories from "../../components/home/Categories";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Footer from "../../components/home/Footer";
import { useLocation } from "react-router-dom";
import { CartDrawer } from "../cart/CartDrawer";
import FeaturedProducts from "../../components/home/FeaturedProducts";

function HomeLayout({ children }) {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <div className="drawer drawer-end">
      <GlowBackground />
      <input id="cart-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content relative min-h-screen">
        <Navbar />

        <main
          className="mx-auto w-[95%] max-w-7xl py-8 md:py-12 top-4 text-white"
          role="main"
        >
          {children}

          {isHomePage && (
            <div>
              <section aria-label="Featured products" className="mt-8 md:mt-12">
                <FeaturedProducts />
              </section>
              <section aria-label="Product categories" className="mt-6 md:mt-8">
                <Categories />
              </section>
              <section aria-label="Why choose us" className="mt-6 md:mt-8">
                <WhyChooseUs />
              </section>
            </div>
          )}
        </main>

        <Footer />
      </div>

      <CartDrawer />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(24, 230, 245, 0.1)",
            color: "#18e6f5",
            border: "1px solid rgba(24, 230, 245, 0.3)",
            backdropFilter: "blur(12px)",
            fontFamily: "var(--font-main)",
            fontWeight: 600,
            padding: "12px 16px",
            boxShadow: "0 0 12px rgba(24, 230, 245, 0.25)",
          },
          error: {
            style: {
              background: "rgba(255, 50, 50, 0.15)",
              color: "#ff5555",
              border: "1px solid rgba(255, 50, 50, 0.3)",
              boxShadow: "0 0 12px rgba(255, 50, 50, 0.25)",
            },
          },
        }}
      />
    </div>
  );
}

export default HomeLayout;

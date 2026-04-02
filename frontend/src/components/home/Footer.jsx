import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const footerLinks = {
  Shop: [
    { label: "All Products", to: "/shop" },
    { label: "Featured", to: "/shop?filter=featured" },
    { label: "Categories", to: "/shop" },
  ],
  Support: [
    { label: "Track Order", to: "/track" },
    { label: "Contact", to: "/contact" },
    { label: "FAQ", to: "/faq" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-700 " style={{backgroundColor: "#0f15244d !important"}}>
      <div className="container-main section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary-sm">
                <span className="text-primary-foreground font-display font-bold text-sm">HX</span>
              </div>
              <span className="font-display font-bold text-lg tracking-wider">
                HARD<span className="text-gradient">WORX</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Premium hardware for gamers and builders. Performance parts, expert picks, fast delivery.
            </p>
            <div className="flex gap-3 mt-5">
              {[FaFacebook, FaInstagram, FaTwitter].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-primary/5 hover:bg-primary/20 transition-colors">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-semibold tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 HardWorx. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <HiOutlineMail className="w-3.5 h-3.5" /> support@hardworx.com
          </div>
        </div>
      </div>
    </footer>
  );
}

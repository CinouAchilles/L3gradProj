import { motion } from "framer-motion";
import { HiOutlineTruck, HiOutlineShieldCheck, HiOutlineCurrencyDollar, HiOutlineSupport } from "react-icons/hi";

const features = [
  { icon: HiOutlineTruck, title: "Fast Delivery", desc: "Get your parts shipped within 24 hours across the country." },
  { icon: HiOutlineShieldCheck, title: "Genuine Products", desc: "All hardware is 100% authentic with manufacturer warranty." },
  { icon: HiOutlineCurrencyDollar, title: "Best Prices", desc: "Competitive pricing on all components, guaranteed." },
  { icon: HiOutlineSupport, title: "Expert Support", desc: "Our tech team is ready to help you pick the right parts." },
];
const MotionDiv = motion.div;

export default function WhyChooseUs() {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-radial-accent opacity-30" />
      <div className="container-main relative z-10">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Why <span className="text-gradient">HardWorx</span>?
          </h2>
        </MotionDiv>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <MotionDiv
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-gaming p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-sm font-semibold mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

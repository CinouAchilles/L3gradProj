import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiOutlineCpuChip } from "react-icons/hi2";
import {
  BsGpuCard,
  BsMemory,
  BsMotherboard,
  BsDeviceSsd,
  BsDisplay,
} from "react-icons/bs";
import { GiComputerFan } from "react-icons/gi";
import { FaKeyboard } from "react-icons/fa6";

const MotionDiv = motion.div;

const categories = [
  { name: "GPUs", icon: BsGpuCard, slug: "gpu" },
  { name: "CPUs", icon: HiOutlineCpuChip, slug: "cpu" },
  { name: "RAM", icon: BsMemory, slug: "ram" },
  { name: "Motherboards", icon: BsMotherboard, slug: "motherboard" },
  { name: "Storage", icon: BsDeviceSsd, slug: "storage" },
  { name: "Monitors", icon: BsDisplay, slug: "monitor" },
  { name: "Cooling", icon: GiComputerFan, slug: "cooling" },
  { name: "Peripherals", icon: FaKeyboard, slug: "peripherals" },
];

export default function Categories() {
  return (
    <section className="section-padding">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Find exactly what your build needs
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="card-gaming flex flex-col items-center justify-center p-5 gap-3 text-center aspect-square"
              >
                <cat.icon className="w-7 h-7 text-accent" />
                <span className="text-xs font-medium text-foreground">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

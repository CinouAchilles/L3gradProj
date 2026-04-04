import { motion } from "framer-motion";

export const MotionWrapperAuth = ({ as = "div", children, ...props }) => {
  const MotionComponent = as === "form" ? motion.form : motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
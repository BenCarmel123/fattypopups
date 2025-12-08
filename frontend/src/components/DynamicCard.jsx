import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";

export default function DynamicCard({ children }) {
  const ref = useRef(null);
  const isTouch =
    typeof window !== "undefined" && "ontouchstart" in window;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // smoother version of your y transform
  const yTransform = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const smoothY = useSpring(yTransform, {
    stiffness: 50,
    damping: 20,
    mass: 0.3,
  });

  const [isFrozen, setIsFrozen] = useState(false);

  const handleEnter = () => {
    if (isTouch && !isFrozen) {
      setTimeout(() => setIsFrozen(true), 1500);
    }
  };

  const motionStyle = isTouch
    ? isFrozen
      ? { y: 0, opacity: 1 }
      : { y: smoothY, opacity: 1 }
    : { y: smoothY };

  return (
    <motion.div
      ref={ref}
      style={motionStyle}
      className="overflow-hidden rounded-2xl bg-[transparent] will-change-transform relative z-10"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      onViewportEnter={isTouch ? handleEnter : undefined}
      whileHover={
        !isTouch
          ? {
              transition: { duration: 0.25, ease: "easeOut" },
            }
          : {}
      }
      onHoverStart={() => {
        if (!isTouch) ref.current.style.zIndex = 20;
      }}
      onHoverEnd={() => {
        if (!isTouch) ref.current.style.zIndex = 10;
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function DynamicCard({ children }) {
  const ref = useRef(null);
  const isTouch =
    typeof window !== "undefined" && "ontouchstart" in window;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const opacityTransform = useTransform(scrollYProgress, [1, 1, 1, 1], [1, 1, 1, 1]);

  const [isFrozen, setIsFrozen] = useState(false);

  const handleEnter = () => {
    if (isTouch && !isFrozen) {
      setTimeout(() => setIsFrozen(true), 1500);
    }
  };

  const motionStyle = isTouch
    ? isFrozen
      ? { y: 0, opacity: 1 }
      : { y: yTransform, opacity: opacityTransform }
    : {};

  return (
    <motion.div
      ref={ref}
      style={motionStyle}
      className="overflow-hidden rounded-2xl bg-[transparent] will-change-transform relative z-10"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      onViewportEnter={isTouch ? handleEnter : undefined}
      // smoother hover animation on web
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


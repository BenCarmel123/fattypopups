import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function DynamicCard({ children }) {
  const ref = useRef(null);
  const isTouch =
    typeof window !== "undefined" && "ontouchstart" in window;

  // Scroll logic (mobile only)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Only Y movement + opacity, no scaling
  const yTransform = useTransform(scrollYProgress, [0, 1], [100, -60]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
  const shadowTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 8px 25px rgba(0,0,0,0.15)",
      "0px 0px 0px rgba(0,0,0,0)",
    ]
  );

  const [isFrozen, setIsFrozen] = useState(false);

  const handleEnter = () => {
    if (isTouch && !isFrozen) {
      setTimeout(() => setIsFrozen(true), 1500);
    }
  };

  const motionStyle = isTouch
    ? isFrozen
      ? { y: 0, opacity: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }
      : { y: yTransform, opacity: opacityTransform, boxShadow: shadowTransform }
    : {};

  return (
    <motion.div
      ref={ref}
      style={motionStyle}
      className="overflow-hidden cursor-pointer rounded-2xl bg-[transparent] will-change-transform relative z-10"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      onViewportEnter={isTouch ? handleEnter : undefined}
      // smoother hover animation on web
      whileHover={
        !isTouch
          ? {
              // no scaling on hover either
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
        duration: 0.8,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

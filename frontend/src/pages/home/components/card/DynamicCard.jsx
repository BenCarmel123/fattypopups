import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import * as Classes from 'config/classes.jsx';

export default function DynamicCard({ children }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Gentle parallax: card drifts up/down as it moves through the viewport.
  const rawY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const y = useSpring(rawY, {
    stiffness: 65,
    damping: 24,
    mass: 0.55,
    restDelta: 0.001,
  });

  // Opacity tracks scroll position: fades in as the card enters, out as it leaves.
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );
  const opacity = useSpring(rawOpacity, {
    stiffness: 65,
    damping: 24,
    mass: 0.55,
    restDelta: 0.001,
  });

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={Classes.DYNAMIC_CARD}
    >
      {children}
    </motion.div>
  );
}

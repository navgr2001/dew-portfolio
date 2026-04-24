import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HiArrowUp } from "react-icons/hi";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        setIsVisible(false);
        return;
      }

      const scrollProgress = window.scrollY / scrollableHeight;
      setIsVisible(scrollProgress >= 0.55);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="theme-floating-button"
          aria-label="Back to top"
        >
          <HiArrowUp size={20} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

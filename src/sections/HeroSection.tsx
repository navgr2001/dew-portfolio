import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { Container } from "../components/Container";
import { designer } from "../data/content";
import { scrollToSectionById } from "../utils/sectionNavigation";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const leftOrbY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const rightOrbY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const heroVisualY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const handleProjectsClick = () => {
    if (location.pathname !== "/projects") {
      navigate("/projects");
      return;
    }

    scrollToSectionById("projects");
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="theme-hero-section relative overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <motion.div
        style={{ y: leftOrbY }}
        className="hero-orb left-[8%] top-20"
      />
      <motion.div
        style={{ y: rightOrbY }}
        className="hero-orb right-[10%] top-44"
      />

      <div className="theme-grid-lines" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <motion.div
            style={{ y: heroContentY }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <p className="theme-pill mb-5 inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.35em]">
              {designer.experience}
            </p>

            <h1 className="theme-display max-w-4xl text-4xl leading-tight sm:text-5xl lg:text-7xl">
              Futuristic interiors crafted with clarity, warmth, and bold
              simplicity.
            </h1>

            <p className="theme-copy mt-6 max-w-2xl text-base leading-8 sm:text-lg">
              {designer.intro}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <motion.a
                href="/dewmini cv new.pdf.pdf"
                download
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="primary-button"
              >
                Download CV
              </motion.a>

              <motion.button
                type="button"
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProjectsClick}
                className="secondary-button"
              >
                View Projects
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            style={{ y: heroVisualY }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            <div className="theme-hero-card relative mx-auto aspect-[4/5] max-w-md overflow-hidden p-4">
              <img
                src="/images/profimage.jpeg"
                alt="Interior designer portfolio hero visual"
                className="h-full w-full rounded-[1.5rem] object-cover"
              />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="theme-hero-caption absolute bottom-7 left-7 right-7 rounded-[1.5rem] p-5"
              >
                <p className="theme-meta text-xs uppercase tracking-[0.35em]">
                  {designer.role}
                </p>
                <p className="mt-2 text-xl font-medium text-white">
                  {designer.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Minimal palettes. Strong atmosphere. Functional beauty.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

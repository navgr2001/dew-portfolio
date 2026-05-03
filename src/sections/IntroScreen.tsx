import { motion } from "motion/react";
import { HiArrowRight } from "react-icons/hi";

type IntroScreenProps = {
  onGetStarted: () => void;
};

export function IntroScreen({ onGetStarted }: IntroScreenProps) {
  return (
    <section className="portfolio-intro-screen" aria-label="Portfolio cover">
      <div className="portfolio-intro-page">
        <div className="portfolio-intro-shell">
          <img
            src="/images/lightmodelogo.png"
            alt="Dewmini Rodrigo logo"
            className="portfolio-intro-logo"
            draggable={false}
          />

          <div className="portfolio-intro-year" aria-hidden="true">
            <span>20</span>
            <span>26</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="portfolio-intro-main"
          >
            <h1 className="portfolio-intro-title">PORTFOLIO</h1>

            <div className="portfolio-intro-author">by Dewmini Rodrigo</div>

            <div className="portfolio-intro-image-wrap">
              <img
                src="/images/intro-cover.png"
                alt="Interior architecture sketch"
                className="portfolio-intro-image"
                draggable={false}
              />
            </div>

            <div className="portfolio-intro-bottom">
              <h2 className="portfolio-intro-subtitle">
                INTERIOR ARCHITECTURE
              </h2>
            </div>
          </motion.div>

          <motion.button
            type="button"
            onClick={onGetStarted}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            className="portfolio-intro-button"
            aria-label="Get started and enter the website"
          >
            <span>Get Started</span>
            <HiArrowRight size={20} />
          </motion.button>

          <div className="portfolio-intro-projects">
            <span>PROJECTS</span>
            <strong>2021-2026</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

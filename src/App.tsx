import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./sections/Header";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ContactSection } from "./sections/ContactSection";
import { Footer } from "./sections/Footer";
import { BackToTopButton } from "./components/BackToTopButton";
import {
  getSectionIdFromPath,
  scrollToSectionById,
} from "./utils/sectionNavigation";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem("portfolio-theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function App() {
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const targetSectionId = getSectionIdFromPath(location.pathname);

    if (!targetSectionId) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollToSectionById(
        targetSectionId,
        location.pathname === "/" ? "auto" : "smooth",
      );
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.pathname]);

  const isLightMode = useMemo(() => theme === "light", [theme]);

  return (
    <div className="theme-shell min-h-screen">
      <Header
        isLightMode={isLightMode}
        onToggleTheme={() =>
          setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark",
          )
        }
      />

      <main className="pt-20">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
}

export default App;

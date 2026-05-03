import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "./sections/Header";
import { IntroScreen } from "./sections/IntroScreen";
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

  try {
    const savedTheme = window.localStorage.getItem("portfolio-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      window.localStorage.setItem("portfolio-theme", theme);
    } catch {
      // localStorage can fail in some privacy modes.
    }
  }, [theme]);

  useEffect(() => {
    const sectionId = getSectionIdFromPath(location.pathname);

    if (!sectionId) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      scrollToSectionById(
        sectionId,
        location.pathname === "/" ? "auto" : "smooth",
      );
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);

  useEffect(() => {
    const protectedSelector = [
      "img",
      ".theme-brand",
      ".theme-hero-card",
      ".project-gallery-main",
      ".project-thumbnail",
      ".project-lightbox-stage",
      ".project-lightbox-thumbnails",
    ].join(",");

    const isProtectedTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(protectedSelector));

    const handleContextMenu = (event: MouseEvent) => {
      if (isProtectedTarget(event.target)) {
        event.preventDefault();
      }
    };

    const handleDragStart = (event: DragEvent) => {
      if (isProtectedTarget(event.target)) {
        event.preventDefault();
      }
    };

    const handleSelectStart = (event: Event) => {
      if (isProtectedTarget(event.target)) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("dragstart", handleDragStart, true);
    document.addEventListener("selectstart", handleSelectStart, true);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      document.removeEventListener("selectstart", handleSelectStart, true);
    };
  }, []);

  const isLightMode = useMemo(() => theme === "light", [theme]);

  const handleGetStarted = () => {
    setShowIntro(false);
    navigate("/", { replace: true });

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  };

  if (showIntro) {
    return <IntroScreen onGetStarted={handleGetStarted} />;
  }

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

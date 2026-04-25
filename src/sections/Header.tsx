import { useState } from "react";
import type { MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { HiMenuAlt3, HiMoon, HiSun, HiX } from "react-icons/hi";
import { Container } from "../components/Container";
import { navItems } from "../data/content";
import { scrollToSectionById } from "../utils/sectionNavigation";

type HeaderProps = {
  isLightMode: boolean;
  onToggleTheme: () => void;
};

export function Header({ isLightMode, onToggleTheme }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      return;
    }

    scrollToSectionById("home");
  };

  const handleNavClick =
    (path: string, targetId: string) =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setIsOpen(false);

      if (location.pathname !== path) {
        navigate(path);
        return;
      }

      scrollToSectionById(targetId);
    };

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="theme-header fixed inset-x-0 top-0 z-[9999] w-full backdrop-blur-xl"
    >
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <Link
          to="/"
          onClick={handleHomeClick}
          className="theme-brand"
          aria-label="Go to home"
        >
          <img
            src={
              isLightMode
                ? "/images/lightmodebrand.png"
                : "/images/darkmodebrand.png"
            }
            alt="Dewmini"
            className="theme-brand-image"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick(item.path, item.targetId)}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle inline-flex h-11 items-center rounded-full px-1.5"
            aria-label={
              isLightMode ? "Switch to dark mode" : "Switch to light mode"
            }
            title={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
          >
            <span
              className={`theme-toggle-icon px-2.5 ${
                isLightMode ? "theme-toggle-icon--active-light" : ""
              }`}
            >
              <HiSun size={16} />
            </span>

            <span
              className={`theme-toggle-icon px-2.5 ${
                !isLightMode ? "theme-toggle-icon--active-dark" : ""
              }`}
            >
              <HiMoon size={16} />
            </span>

            <motion.span
              layout
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className={`theme-toggle-thumb ${
                isLightMode
                  ? "theme-toggle-thumb--light translate-x-0"
                  : "translate-x-[2.1rem]"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="theme-icon-button inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>
        </div>
      </Container>

      {isOpen && (
        <div className="theme-mobile-menu md:hidden">
          <Container className="flex flex-col py-5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="theme-mobile-link border-b py-4 text-sm uppercase tracking-[0.3em] last:border-b-0"
                onClick={handleNavClick(item.path, item.targetId)}
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </motion.header>
  );
}

import { Link } from "react-router-dom";
import { Container } from "../components/Container";
import { designer, navItems } from "../data/content";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <Container className="flex flex-col items-center gap-5 text-center text-sm text-zinc-500 md:flex-row md:items-center md:justify-between md:text-left">
        <p>© 2026 {designer.name}. All rights reserved.</p>

        <div className="flex flex-wrap justify-center gap-4 md:justify-end">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}

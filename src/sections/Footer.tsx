import { Container } from '../components/Container';
import { designer, navItems } from '../data/content';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <Container className="flex flex-col gap-5 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 {designer.name}. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}

export const SECTION_ROUTE_MAP = {
  "/": "home",
  "/about": "about",
  "/projects": "projects",
  "/skills": "skills",
  "/contact": "contact",
} as const;

export function getSectionIdFromPath(pathname: string): string | null {
  return SECTION_ROUTE_MAP[pathname as keyof typeof SECTION_ROUTE_MAP] ?? null;
}

export function scrollToSectionById(
  sectionId: string,
  behavior: ScrollBehavior = "smooth",
) {
  const element = document.getElementById(sectionId);

  if (!element) {
    return;
  }

  const headerElement = document.querySelector(
    ".theme-header",
  ) as HTMLElement | null;

  const headerOffset = headerElement ? headerElement.offsetHeight + 12 : 92;

  const top =
    element.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior,
  });
}

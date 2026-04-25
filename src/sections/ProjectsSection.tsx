import { useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { motion } from "motion/react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { projects } from "../data/content";

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 6;
const SWIPE_THRESHOLD = 48;

function getProjectGalleryImages(project: {
  image: string;
  images?: string[];
}) {
  return Array.from(new Set([project.image, ...(project.images ?? [])]));
}

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<
    string | null
  >(projects[0]?.title ?? null);
  const [selectedImage, setSelectedImage] = useState<string>(
    projects[0]?.image ?? "",
  );
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(projects.map((project) => project.category)),
    );
    return ["All", ...uniqueCategories];
  }, []);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        activeCategory === "All" || project.category === activeCategory;

      const matchesSearch =
        normalizedSearch === "" ||
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.category.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch) ||
        project.year.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeCategory, searchTerm]);

  const selectedProject = useMemo(
    () =>
      filteredProjects.find(
        (project) => project.title === selectedProjectTitle,
      ) ?? filteredProjects[0],
    [filteredProjects, selectedProjectTitle],
  );

  const selectedProjectImages = useMemo(
    () => (selectedProject ? getProjectGalleryImages(selectedProject) : []),
    [selectedProject],
  );

  useEffect(() => {
    if (filteredProjects.length === 0) {
      setSelectedProjectTitle(null);
      setSelectedImage("");
      setViewerIndex(0);
      setIsViewerOpen(false);
      return;
    }

    if (!selectedProject) {
      const firstProject = filteredProjects[0];
      const firstProjectGallery = getProjectGalleryImages(firstProject);

      setSelectedProjectTitle(firstProject.title);
      setSelectedImage(firstProjectGallery[0] ?? firstProject.image);
      setViewerIndex(0);
      return;
    }

    const currentImageIndex = selectedProjectImages.indexOf(selectedImage);

    if (currentImageIndex === -1) {
      setSelectedImage(selectedProjectImages[0] ?? selectedProject.image);
      setViewerIndex(0);
      return;
    }

    setViewerIndex(currentImageIndex);
  }, [filteredProjects, selectedProject, selectedProjectImages, selectedImage]);

  const visibleProjects = filteredProjects
    .filter((project) => project.title !== selectedProject?.title)
    .slice(0, Math.max(visibleCount - 1, 0));

  const visibleProjectCount = Math.min(visibleCount, filteredProjects.length);

  const hasMore =
    filteredProjects.filter(
      (project) => project.title !== selectedProject?.title,
    ).length > Math.max(visibleCount - 1, 0);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) {
      return;
    }

    carouselRef.current.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  const setActiveProjectImage = (image: string) => {
    setSelectedImage(image);

    const nextIndex = selectedProjectImages.indexOf(image);
    if (nextIndex >= 0) {
      setViewerIndex(nextIndex);
    }
  };

  const setActiveViewerImage = (index: number) => {
    if (selectedProjectImages.length === 0) {
      return;
    }

    const normalizedIndex =
      ((index % selectedProjectImages.length) + selectedProjectImages.length) %
      selectedProjectImages.length;

    const nextImage = selectedProjectImages[normalizedIndex];

    setViewerIndex(normalizedIndex);
    setSelectedImage(nextImage);
  };

  const openViewer = (image: string) => {
    const nextIndex = selectedProjectImages.indexOf(image);
    setActiveViewerImage(nextIndex >= 0 ? nextIndex : 0);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
  };

  const showPreviousViewerImage = () => {
    setActiveViewerImage(viewerIndex - 1);
  };

  const showNextViewerImage = () => {
    setActiveViewerImage(viewerIndex + 1);
  };

  useEffect(() => {
    if (!isViewerOpen) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isViewerOpen]);

  useEffect(() => {
    if (!isViewerOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousViewerImage();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextViewerImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isViewerOpen, viewerIndex, selectedProjectImages.length]);

  const handleViewerTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const firstTouch = event.touches[0];
    touchStartXRef.current = firstTouch.clientX;
    touchStartYRef.current = firstTouch.clientY;
  };

  const handleViewerTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) {
      return;
    }

    const changedTouch = event.changedTouches[0];
    const deltaX = changedTouch.clientX - touchStartXRef.current;
    const deltaY = changedTouch.clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD ||
      Math.abs(deltaX) <= Math.abs(deltaY)
    ) {
      return;
    }

    if (deltaX > 0) {
      showPreviousViewerImage();
      return;
    }

    showNextViewerImage();
  };

  const viewerImage =
    selectedProjectImages[viewerIndex] ?? selectedProjectImages[0] ?? "";

  const isContainProject = selectedProject?.imageFit === "contain";

  return (
    <section id="projects" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Selected Work"
          title="A futuristic portfolio section designed to handle 20+ projects with clarity."
          description="This layout highlights one active project, lets users open any other project in the same immersive viewer, and supports multiple images through a clean bottom thumbnail carousel."
        />

        <div className="mt-12 space-y-8">
          <div className="glass-panel overflow-hidden p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  Browse Projects
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Showing{" "}
                  <span className="font-medium text-white">
                    {filteredProjects.length}
                  </span>{" "}
                  project{filteredProjects.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="w-full lg:max-w-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by title, category, year..."
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((category) => {
                const isActive = category === activeCategory;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`project-filter-button ${isActive ? "project-filter-button--active" : ""}`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedProject ? (
            <>
              <motion.article
                key={selectedProject.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                className="glass-panel project-feature-card overflow-hidden"
              >
                <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
                  <div className="p-4 sm:p-5 lg:p-6">
                    <div className="project-gallery-shell">
                      <button
                        type="button"
                        onClick={() => openViewer(selectedImage)}
                        className={`project-gallery-main project-gallery-main-button ${
                          isContainProject
                            ? "project-gallery-main--contain-mode"
                            : ""
                        }`}
                        aria-label={`Open ${selectedProject.title} gallery popup`}
                      >
                        <img
                          key={selectedImage}
                          src={selectedImage}
                          alt={selectedProject.title}
                          className={`project-gallery-main-image ${
                            isContainProject
                              ? "project-gallery-main-image--contain"
                              : "project-gallery-main-image--cover"
                          }`}
                        />
                        <div className="project-image-overlay" />

                        <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                          <span className="project-badge">
                            Featured Project
                          </span>
                        </div>

                        <div className="project-gallery-zoom-hint">
                          Click to expand
                        </div>
                      </button>

                      <div className="project-gallery-thumbnails-wrap">
                        <button
                          type="button"
                          onClick={() => scrollCarousel("left")}
                          className="project-carousel-arrow"
                          aria-label="Scroll thumbnails left"
                        >
                          ‹
                        </button>

                        <div ref={carouselRef} className="project-carousel">
                          {selectedProjectImages.map((image, index) => {
                            const isActiveImage = image === selectedImage;

                            return (
                              <button
                                key={`${selectedProject.title}-image-${index}`}
                                type="button"
                                onClick={() => setActiveProjectImage(image)}
                                className={`project-thumbnail ${
                                  isActiveImage
                                    ? "project-thumbnail--active"
                                    : ""
                                }`}
                                aria-label={`View ${selectedProject.title} image ${index + 1}`}
                              >
                                <img
                                  src={image}
                                  alt={`${selectedProject.title} preview ${index + 1}`}
                                  className={`project-thumbnail-image ${
                                    isContainProject
                                      ? "project-thumbnail-image--contain"
                                      : "project-thumbnail-image--cover"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => scrollCarousel("right")}
                          className="project-carousel-arrow"
                          aria-label="Scroll thumbnails right"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 lg:p-10">
                    <div className="project-feature-details-layout">
                      <div className="project-feature-details-scroll">
                        <div>
                          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-zinc-500">
                            <span>{selectedProject.category}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-600" />
                            <span>{selectedProject.year}</span>
                          </div>

                          <h3 className="max-w-xl text-3xl font-medium leading-tight text-white sm:text-4xl">
                            {selectedProject.title}
                          </h3>

                          <p className="project-feature-description mt-5 text-zinc-400">
                            {selectedProject.description}
                          </p>

                          {selectedProject.detailSections?.map(
                            (
                              detail: { subtitle: string; description: string },
                              index: number,
                            ) => (
                              <div
                                key={`${selectedProject.title}-detail-${index}`}
                                className="project-detail-block"
                              >
                                <h4 className="project-detail-subtitle">
                                  {detail.subtitle}
                                </h4>
                                <p className="project-feature-description text-zinc-400">
                                  {detail.description}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="project-feature-stats mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-zinc-500">
                            Type
                          </p>
                          <p className="mt-2 text-sm text-white">
                            {selectedProject.category}
                          </p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-zinc-500">
                            Year
                          </p>
                          <p className="mt-2 text-sm text-white">
                            {selectedProject.year}
                          </p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-zinc-500">
                            Gallery
                          </p>
                          <p className="mt-2 text-sm text-white">
                            {selectedProjectImages.length} image
                            {selectedProjectImages.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleProjects.map((project, index) => (
                  <motion.button
                    key={`${project.title}-${index}`}
                    type="button"
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.06,
                      ease: "easeOut",
                    }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => {
                      const projectGallery = getProjectGalleryImages(project);
                      setSelectedProjectTitle(project.title);
                      setSelectedImage(projectGallery[0] ?? project.image);
                      setViewerIndex(0);
                      setIsViewerOpen(false);
                    }}
                    className="glass-panel project-card-button group overflow-hidden text-left"
                  >
                    <div className="relative overflow-hidden rounded-[1.6rem]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="project-image-overlay" />
                    </div>

                    <div className="p-6">
                      <div className="mb-4 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-zinc-500">
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                      </div>

                      <h3 className="text-2xl font-medium text-white">
                        {project.title}
                      </h3>
                      <p className="mt-4 line-clamp-4 leading-7 text-zinc-400">
                        {project.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                          Click to view
                        </span>
                        <span className="text-sm text-white">
                          {getProjectGalleryImages(project).length} image
                          {getProjectGalleryImages(project).length === 1
                            ? ""
                            : "s"}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4 pt-2">
                {hasMore ? (
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((previous) => previous + LOAD_MORE_COUNT)
                    }
                    className="secondary-button min-w-[12rem]"
                  >
                    Load More Projects
                  </button>
                ) : filteredProjects.length > INITIAL_VISIBLE_COUNT ? (
                  <button
                    type="button"
                    onClick={() => setVisibleCount(INITIAL_VISIBLE_COUNT)}
                    className="secondary-button min-w-[12rem]"
                  >
                    Show Less
                  </button>
                ) : null}

                <p className="text-sm text-zinc-500">
                  {visibleProjectCount} of {filteredProjects.length} visible
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel p-8 text-center sm:p-12">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                No Results Found
              </p>
              <h3 className="mt-4 text-2xl font-medium text-white">
                Try another keyword or project category
              </h3>
              <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-400">
                Your portfolio section stays clean even with many projects
                because users can quickly narrow down what they want to see.
              </p>
            </div>
          )}
        </div>
      </Container>

      {selectedProject && isViewerOpen ? (
        <div
          className="project-lightbox-backdrop"
          role="presentation"
          onClick={closeViewer}
        >
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="project-lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.title} image viewer`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="project-lightbox-topbar">
              <div className="min-w-0">
                <p className="project-lightbox-eyebrow">
                  {selectedProject.category} • {selectedProject.year}
                </p>
                <h3 className="project-lightbox-title">
                  {selectedProject.title}
                </h3>
                <p className="project-lightbox-helper">
                  Use the side arrows, keyboard arrow keys, or thumbnails to
                  switch images.
                </p>
              </div>

              <div className="project-lightbox-topbar-actions">
                <p className="project-lightbox-counter">
                  Image {viewerIndex + 1} of {selectedProjectImages.length}
                </p>

                <button
                  type="button"
                  onClick={closeViewer}
                  className="project-lightbox-close"
                  aria-label="Close image popup"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="project-lightbox-content">
              <div
                className="project-lightbox-stage"
                onTouchStart={handleViewerTouchStart}
                onTouchEnd={handleViewerTouchEnd}
              >
                {selectedProjectImages.length > 1 ? (
                  <button
                    type="button"
                    onClick={showPreviousViewerImage}
                    className="project-lightbox-nav project-lightbox-nav--left"
                    aria-label="Show previous image"
                  >
                    ‹
                  </button>
                ) : null}

                <img
                  key={viewerImage}
                  src={viewerImage}
                  alt={`${selectedProject.title} enlarged view ${viewerIndex + 1}`}
                  className="project-lightbox-image"
                />

                {selectedProjectImages.length > 1 ? (
                  <button
                    type="button"
                    onClick={showNextViewerImage}
                    className="project-lightbox-nav project-lightbox-nav--right"
                    aria-label="Show next image"
                  >
                    ›
                  </button>
                ) : null}
              </div>

              {selectedProjectImages.length > 1 ? (
                <aside className="project-lightbox-sidebar">
                  <div className="project-lightbox-sidebar-header">
                    <p className="project-lightbox-sidebar-title">Gallery</p>
                    <p className="project-lightbox-sidebar-subtitle">
                      Select an image
                    </p>
                  </div>

                  <div className="project-lightbox-thumbnails">
                    {selectedProjectImages.map((image, index) => {
                      const isActiveViewerImage = index === viewerIndex;

                      return (
                        <button
                          key={`${selectedProject.title}-viewer-image-${index}`}
                          type="button"
                          onClick={() => setActiveViewerImage(index)}
                          className={`project-thumbnail ${
                            isActiveViewerImage
                              ? "project-thumbnail--active"
                              : ""
                          }`}
                          aria-label={`Open image ${index + 1}`}
                        >
                          <img
                            src={image}
                            alt={`${selectedProject.title} thumbnail ${index + 1}`}
                            className={`project-thumbnail-image ${
                              isContainProject
                                ? "project-thumbnail-image--contain"
                                : "project-thumbnail-image--cover"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="project-lightbox-sidebar-tip">
                    <span>←</span>
                    <span>→</span>
                    <p>Keyboard navigation supported</p>
                  </div>
                </aside>
              ) : null}
            </div>
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}

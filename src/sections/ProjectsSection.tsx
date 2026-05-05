import { useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { motion } from "motion/react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { projects } from "../data/content";

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 6;
const SWIPE_THRESHOLD = 48;
const MIN_VIEWER_ZOOM = 1;
const MAX_VIEWER_ZOOM = 4;

const PROJECT_MAIN_TABS = ["Academic", "Industrial"] as const;

type ProjectMainTab = (typeof PROJECT_MAIN_TABS)[number];

type StructuredProjectCategory =
  | "Retail & Commercial"
  | "Furniture Design"
  | "Residential"
  | "Hospitality"
  | "Wellness & Healthcare";

type StructuredProjectRule = {
  category: StructuredProjectCategory;
  projectNames: string[];
};

const PROJECT_STRUCTURE: Record<ProjectMainTab, StructuredProjectRule[]> = {
  Academic: [
    {
      category: "Retail & Commercial",
      projectNames: [
        "retail shopability",
        "retail shoppability",
        "retail shop ability",
        "retail shop",
      ],
    },
    {
      category: "Furniture Design",
      projectNames: [
        "personal sculpture space",
        "personal sculptural space",
        "sculpture space",
        "sculptural space",
      ],
    },
    {
      category: "Residential",
      projectNames: ["technical drawings", "technical drawing", "technical"],
    },
    {
      category: "Hospitality",
      projectNames: [
        "cafe design to nic",
        "café design to nic",
        "nic cafe",
        "nic café",
        "eatary with twist",
        "eatery with twist",
        "seafood restaurant",
        "lagoon deck",
      ],
    },
    {
      category: "Wellness & Healthcare",
      projectNames: [
        "sri villa beach ayu arana",
        "sri villa beach",
        "ayu arana",
        "villa beach",
      ],
    },
  ],
  Industrial: [
    {
      category: "Residential",
      projectNames: [
        "palace appartment gampaha",
        "palace apartment gampaha",
        "palace appartment",
        "palace apartment",
        "iconic galaxy apartment colombo",
        "iconic galaxy",
        "housing project marawila",
        "marawila",
        "santorini appartments villa 1",
        "santorini apartments villa 1",
        "santorini villa 1",
        "santorini appartments villa 2",
        "santorini apartments villa 2",
        "santorini villa 2",
        "santorini appartments villa 3",
        "santorini apartments villa 3",
        "santorini villa 3",
      ],
    },
    {
      category: "Wellness & Healthcare",
      projectNames: [
        "ave maria hospital negombo",
        "ave maria hospital",
        "ave maria",
      ],
    },
    {
      category: "Retail & Commercial",
      projectNames: [
        "gpv gallery negombo",
        "gpv gallery",
        "gpv signage designs negombo",
        "gpv signage design negombo",
        "gpv signage",
      ],
    },
    {
      category: "Hospitality",
      projectNames: ["rio cafe", "rio café"],
    },
  ],
};

function getProjectGalleryImages(project: {
  image: string;
  images?: string[];
}) {
  return Array.from(new Set([project.image, ...(project.images ?? [])]));
}

function normalizeValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[’']/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ");
}

function normalizeProjectSearchText(project: {
  title: string;
  category: string;
  description: string;
  year: string;
}) {
  return normalizeValue(
    [project.title, project.category, project.description, project.year].join(
      " ",
    ),
  );
}

function findStructuredProjectMeta(project: {
  title: string;
  category: string;
  description: string;
  year: string;
}) {
  const projectSearchText = normalizeProjectSearchText(project);

  for (const mainTab of PROJECT_MAIN_TABS) {
    const categoryRules = PROJECT_STRUCTURE[mainTab];

    for (const categoryRule of categoryRules) {
      const matchedProjectIndex = categoryRule.projectNames.findIndex(
        (projectName) =>
          projectSearchText.includes(normalizeValue(projectName)),
      );

      if (matchedProjectIndex >= 0) {
        return {
          mainTab,
          category: categoryRule.category,
          categoryIndex: categoryRules.indexOf(categoryRule),
          projectIndex: matchedProjectIndex,
        };
      }
    }
  }

  return null;
}

export function ProjectsSection() {
  const [activeMainTab, setActiveMainTab] =
    useState<ProjectMainTab>("Academic");
  const [activeCategory, setActiveCategory] =
    useState<StructuredProjectCategory>(PROJECT_STRUCTURE.Academic[0].category);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<
    string | null
  >(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerZoom, setViewerZoom] = useState(1);
  const [viewerPan, setViewerPan] = useState({ x: 0, y: 0 });

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef(1);
  const lastTouchPointRef = useRef<{ x: number; y: number } | null>(null);
  const isPinchingRef = useRef(false);

  const availableCategories = PROJECT_STRUCTURE[activeMainTab].map(
    (categoryRule) => categoryRule.category,
  );

  useEffect(() => {
    setActiveCategory(PROJECT_STRUCTURE[activeMainTab][0].category);
  }, [activeMainTab]);

  const structuredProjects = useMemo(() => {
    return projects
      .map((project) => {
        const structuredMeta = findStructuredProjectMeta(project);

        if (!structuredMeta) {
          return null;
        }

        return {
          project,
          structuredMeta,
        };
      })
      .filter(
        (
          item,
        ): item is {
          project: (typeof projects)[number];
          structuredMeta: NonNullable<
            ReturnType<typeof findStructuredProjectMeta>
          >;
        } => item !== null,
      )
      .sort((firstItem, secondItem) => {
        const mainTabDifference =
          PROJECT_MAIN_TABS.indexOf(firstItem.structuredMeta.mainTab) -
          PROJECT_MAIN_TABS.indexOf(secondItem.structuredMeta.mainTab);

        if (mainTabDifference !== 0) {
          return mainTabDifference;
        }

        const categoryDifference =
          firstItem.structuredMeta.categoryIndex -
          secondItem.structuredMeta.categoryIndex;

        if (categoryDifference !== 0) {
          return categoryDifference;
        }

        return (
          firstItem.structuredMeta.projectIndex -
          secondItem.structuredMeta.projectIndex
        );
      });
  }, []);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = normalizeValue(searchTerm);

    return structuredProjects
      .filter(({ project, structuredMeta }) => {
        const matchesMainTab = structuredMeta.mainTab === activeMainTab;
        const matchesCategory = structuredMeta.category === activeCategory;

        const matchesSearch =
          normalizedSearch === "" ||
          normalizeProjectSearchText(project).includes(normalizedSearch) ||
          normalizeValue(structuredMeta.category).includes(normalizedSearch) ||
          normalizeValue(structuredMeta.mainTab).includes(normalizedSearch);

        return matchesMainTab && matchesCategory && matchesSearch;
      })
      .map(({ project }) => project);
  }, [activeCategory, activeMainTab, searchTerm, structuredProjects]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeMainTab, activeCategory, searchTerm]);

  const selectedProject = useMemo(
    () =>
      filteredProjects.find(
        (project) => project.title === selectedProjectTitle,
      ) ?? filteredProjects[0],
    [filteredProjects, selectedProjectTitle],
  );

  const selectedProjectMeta = selectedProject
    ? findStructuredProjectMeta(selectedProject)
    : null;

  const selectedProjectCategory =
    selectedProjectMeta?.category ?? selectedProject?.category ?? "";

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

    if (selectedProjectTitle !== selectedProject.title) {
      setSelectedProjectTitle(selectedProject.title);
    }

    const currentImageIndex = selectedProjectImages.indexOf(selectedImage);

    if (currentImageIndex === -1) {
      setSelectedImage(selectedProjectImages[0] ?? selectedProject.image);
      setViewerIndex(0);
      return;
    }

    setViewerIndex(currentImageIndex);
  }, [
    filteredProjects,
    selectedProject,
    selectedProjectImages,
    selectedImage,
    selectedProjectTitle,
  ]);

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
    resetViewerZoom();
  };

  const openViewer = (image: string) => {
    const nextIndex = selectedProjectImages.indexOf(image);
    setActiveViewerImage(nextIndex >= 0 ? nextIndex : 0);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    resetViewerZoom();
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

  const clampViewerZoom = (value: number) => {
    return Math.min(Math.max(value, MIN_VIEWER_ZOOM), MAX_VIEWER_ZOOM);
  };

  const getTouchDistance = (touches: React.TouchList) => {
    const firstTouch = touches[0];
    const secondTouch = touches[1];

    return Math.hypot(
      secondTouch.clientX - firstTouch.clientX,
      secondTouch.clientY - firstTouch.clientY,
    );
  };

  const getTouchCenter = (touches: React.TouchList) => {
    const firstTouch = touches[0];
    const secondTouch = touches[1];

    return {
      x: (firstTouch.clientX + secondTouch.clientX) / 2,
      y: (firstTouch.clientY + secondTouch.clientY) / 2,
    };
  };

  const resetViewerZoom = () => {
    setViewerZoom(1);
    setViewerPan({ x: 0, y: 0 });
    pinchStartDistanceRef.current = null;
    pinchStartZoomRef.current = 1;
    lastTouchPointRef.current = null;
    isPinchingRef.current = false;
  };

  const handleViewerTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      event.preventDefault();

      isPinchingRef.current = true;
      pinchStartDistanceRef.current = getTouchDistance(event.touches);
      pinchStartZoomRef.current = viewerZoom;
      lastTouchPointRef.current = getTouchCenter(event.touches);
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }

    if (event.touches.length === 1) {
      const firstTouch = event.touches[0];

      isPinchingRef.current = false;
      lastTouchPointRef.current = {
        x: firstTouch.clientX,
        y: firstTouch.clientY,
      };

      touchStartXRef.current = firstTouch.clientX;
      touchStartYRef.current = firstTouch.clientY;
    }
  };

  const handleViewerTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      event.preventDefault();

      const startDistance = pinchStartDistanceRef.current;

      if (!startDistance) {
        pinchStartDistanceRef.current = getTouchDistance(event.touches);
        pinchStartZoomRef.current = viewerZoom;
        lastTouchPointRef.current = getTouchCenter(event.touches);
        return;
      }

      const currentDistance = getTouchDistance(event.touches);
      const nextZoom = clampViewerZoom(
        pinchStartZoomRef.current * (currentDistance / startDistance),
      );

      const currentCenter = getTouchCenter(event.touches);
      const previousCenter = lastTouchPointRef.current;

      if (previousCenter && nextZoom > 1) {
        const deltaX = currentCenter.x - previousCenter.x;
        const deltaY = currentCenter.y - previousCenter.y;

        setViewerPan((currentPan) => ({
          x: currentPan.x + deltaX,
          y: currentPan.y + deltaY,
        }));
      }

      lastTouchPointRef.current = currentCenter;
      setViewerZoom(nextZoom);
      return;
    }

    if (event.touches.length === 1 && viewerZoom > 1) {
      event.preventDefault();

      const firstTouch = event.touches[0];
      const previousTouchPoint = lastTouchPointRef.current;

      if (!previousTouchPoint) {
        lastTouchPointRef.current = {
          x: firstTouch.clientX,
          y: firstTouch.clientY,
        };
        return;
      }

      const deltaX = firstTouch.clientX - previousTouchPoint.x;
      const deltaY = firstTouch.clientY - previousTouchPoint.y;

      setViewerPan((currentPan) => ({
        x: currentPan.x + deltaX,
        y: currentPan.y + deltaY,
      }));

      lastTouchPointRef.current = {
        x: firstTouch.clientX,
        y: firstTouch.clientY,
      };
    }
  };

  const handleViewerTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 1) {
      const remainingTouch = event.touches[0];

      lastTouchPointRef.current = {
        x: remainingTouch.clientX,
        y: remainingTouch.clientY,
      };

      pinchStartDistanceRef.current = null;
      pinchStartZoomRef.current = viewerZoom;
      return;
    }

    if (isPinchingRef.current) {
      isPinchingRef.current = false;
      pinchStartDistanceRef.current = null;
      lastTouchPointRef.current = null;
      return;
    }

    if (viewerZoom > 1) {
      lastTouchPointRef.current = null;
      return;
    }

    if (touchStartXRef.current === null || touchStartYRef.current === null) {
      return;
    }

    const changedTouch = event.changedTouches[0];
    const deltaX = changedTouch.clientX - touchStartXRef.current;
    const deltaY = changedTouch.clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    lastTouchPointRef.current = null;

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
          <div className="glass-panel project-browser-panel overflow-hidden p-4 sm:p-5 lg:p-6">
            <div className="project-browser-top">
              <div className="project-browser-summary">
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

              <div className="project-browser-search">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by title, category, year..."
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="project-filter-groups">
              <div className="project-filter-group">
                <p className="project-filter-label">Project Type</p>
                <div className="project-filter-row">
                  {PROJECT_MAIN_TABS.map((mainTab) => {
                    const isActive = mainTab === activeMainTab;

                    return (
                      <button
                        key={mainTab}
                        type="button"
                        onClick={() => setActiveMainTab(mainTab)}
                        className={`project-filter-button project-main-filter-button ${
                          isActive ? "project-filter-button--active" : ""
                        }`}
                      >
                        {mainTab}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="project-filter-group">
                <p className="project-filter-label">
                  {activeMainTab} Categories
                </p>
                <div className="project-filter-row">
                  {availableCategories.map((category) => {
                    const isActive = category === activeCategory;

                    return (
                      <button
                        key={`${activeMainTab}-${category}`}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`project-filter-button ${
                          isActive ? "project-filter-button--active" : ""
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
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
                whileHover={{ y: -4 }}
                className="glass-panel project-feature-card overflow-hidden"
              >
                <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
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
                          <div className="project-meta-row">
                            <span>{selectedProjectCategory}</span>
                            <span className="project-meta-dot" />
                            <span>{selectedProject.year}</span>
                          </div>

                          <h3 className="project-feature-title">
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
                        <div className="project-stat-card">
                          <p className="project-stat-label">Type</p>
                          <p className="project-stat-value">
                            {selectedProjectCategory}
                          </p>
                        </div>
                        <div className="project-stat-card">
                          <p className="project-stat-label">Year</p>
                          <p className="project-stat-value">
                            {selectedProject.year}
                          </p>
                        </div>
                        <div className="project-stat-card">
                          <p className="project-stat-label">Gallery</p>
                          <p className="project-stat-value">
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
                {visibleProjects.map((project, index) => {
                  const projectMeta = findStructuredProjectMeta(project);
                  const projectCategory =
                    projectMeta?.category ?? project.category;

                  return (
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
                          <span>{projectCategory}</span>
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
                  );
                })}
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
                Try another project type, category, or keyword
              </h3>
              <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-400">
                This category does not have matching projects yet. Try another
                tab or search keyword.
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
                  {selectedProjectCategory} • {selectedProject.year}
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
                onTouchMove={handleViewerTouchMove}
                onTouchEnd={handleViewerTouchEnd}
                onTouchCancel={handleViewerTouchEnd}
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
                  className={`project-lightbox-image ${
                    viewerZoom > 1 ? "project-lightbox-image--zoomed" : ""
                  }`}
                  style={{
                    transform: `translate3d(${viewerPan.x}px, ${viewerPan.y}px, 0) scale(${viewerZoom})`,
                  }}
                  draggable={false}
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

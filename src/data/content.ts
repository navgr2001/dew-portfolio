export const designer = {
  name: "Dewmini Rodrigo",
  role: "Interior Designer",
  experience: "2+ Years Experience",
  intro:
    "Designing refined, functional interiors that feel timeless, immersive, and emotionally connected to the people who live in them.",
  about:
    "I am an interior designer focused on residential, boutique commercial, and hospitality-inspired spaces. Over the last two years, I have worked on concept development, space planning, material selection, styling, and client presentation decks. My approach blends minimal luxury, clean geometry, and intentional detail to create spaces that feel calm, modern, and memorable.",
  email: "dewrodrigo@gmail.com",
  phone: "+94 75 032 4440",
  location: "Colombo, Sri Lanka",
};

export const skills = [
  "Enscape",
  "Space Planning",
  "3D Visualization",
  "Concept Development",
  "Furniture Styling",
  "Material Selection",
  "Lighting Design",
  "AutoCAD",
  "SketchUp",
  "Lumion",
  "Adobe Photoshop",
  "MS Office",
  "Adobe Illustrator",
  "Client Presentations",
  "Project Coordination",
];

type ProjectDetailSection = {
  subtitle: string;
  description: string;
};

export type Project = {
  title: string;
  category: string;
  year: string;
  image: string;
  images?: string[];
  description: string;
  imageFit?: "cover" | "contain";
  detailSections?: ProjectDetailSection[];
};

export const projects: Project[] = [
  {
    title: "PERSONAL SCULPTURAL SPACE",
    category: "Furniture Design",
    year: "2023",
    image: "/images/Academic/project1/image1.png",
    imageFit: "contain",
    images: ["/images/Academic/project1/designdevelopment.png"],
    description:
      "Item for space use by individual with privacy in order to ergonomics and anthropometrics. It is an artistic form which has been worked into three-dimensional form. With the influence of and research into the concepts of Geoffrey Bawa, I developed a relaxing bed concept that feels more ideal for personal comfort and reflection.",
    detailSections: [
      {
        subtitle: "CONCEPT",
        description:
          "Relaxing and peaceful evenings play a major role in the client life of Chamithra Sadanayaka, as she works all day and studies as well. She likes to spend her evening in a personal space with a calm environment while listening to music and spending time with nature. The chosen site, Jetwing Lagoon in Negombo, next to the lagoon, with natural surroundings and colorful evening sunsets, reflects that sense of relaxation. The sunset became the inspiration that signals the end of the day and the beginning of rest. Therefore, the concept is the moment of relaxation.",
      },
    ],
  },
  {
    title: "TECHNICAL DRAWINGS",
    category: "Residential",
    year: "2023",
    image: "/images/Academic/project1/technicaldrawing.png",
    imageFit: "contain",
    images: [
      "/images/Academic/project1/technicaldrawing2.png",
      "/images/Academic/project1/technicaldrawing3.png",
    ],
    description:
      "Item for space use by individual with privacy in order to ergonomics and anthropometrics. It is an artistic form which has been worked into three-dimensional form. With the influence of and research into the concepts of Geoffrey Bawa, I developed a relaxing bed concept that feels more ideal for personal comfort and reflection.",
    detailSections: [
      {
        subtitle: "CONCEPT",
        description:
          "Relaxing and peaceful evenings play a major role in the client life of Chamithra Sadanayaka, as she works all day and studies as well. She likes to spend her evening in a personal space with a calm environment while listening to music and spending time with nature. The chosen site, Jetwing Lagoon in Negombo, next to the lagoon, with natural surroundings and colorful evening sunsets, reflects that sense of relaxation. The sunset became the inspiration that signals the end of the day and the beginning of rest. Therefore, the concept is the moment of relaxation.",
      },
    ],
  },
  {
    title: "RETAIL SHOPPABILITY RETAIL STORE AT A MALL",
    category: "Retail & Commercial",
    year: "2023",
    image: "/images/Academic/project2/moodboard.png",
    imageFit: "contain",
    images: [
      "/images/Academic/project2/tecdraw1.png",
      "/images/Academic/project2/tecdraw2.png",
      "/images/Academic/project2/3d.png",
    ],
    description:
      "Retail shoppability: the capacity to transform consumer needs anddesires into purchases. This impressive  feat is accomplished by marshalling all of an organization’s assets – people, places and practices – to deliver rewarding shopping experiences to customers. K-Zone where thewill be placed is a two-storey shopping mall complex in the vicinity of the Kapuwatta suburb area of Ja- Ela, outside Colombo, Sri Lanka. It offers retail therapy within the confines of a relaxed “all under one roof” atmosphere featuring a department store, retail outlets, food court, electronic stores, gift shops and others offering a range of products and services for even the most discerning shopper in a Sri Lankan culture.",
    detailSections: [
      {
        subtitle: "CONCEPT",
        description:
          "I thought of concept “ ART OF SUMMER” which shows the exploration of the wilderness and merging with tradition innovation in Oder to feel the Sri Lankan style simply but also youthful . My inspiration is SANDY BEACH",
      },
    ],
  },
  {
    title: "CAFE DESIGN TO NIC",
    category: "Residential",
    year: "2025",
    image: "/images/Academic/project3/image1.png",
    imageFit: "contain",
    images: [
      "/images/Academic/project3/image2.png",
      "/images/project3/image3.png",
    ],
    description:
      "Design features are the colors , textures and the bilss that an indiviual experience while being in the presence of the garden .INSPIRED BY THE COLOUR OF VEGETATION .As the STORYLINE make the user feel as if thet are in an organic environment ,utimately creating a sense of being in touch with nature while having local healthy food .Also NEW LEAF the concept of the project means to change the course and start fresh which that user come inside brings the same feeling itself",
  },
  {
    title: "EATERY WITH TWIST: SEAFOOD RESTAURANT TO LAGOON DECK",
    category: "Residential",
    year: "2024",
    image: "/images/Academic/project4/image1.png",
    imageFit: "contain",
    images: [
      "/images/Academic/project4/image2.png",
      "/images/Academic/project4/image3.png",
    ],
    description:
      "restaurant is a place where people pay to sit and eat meals that are cooked and served on the premises. Beyond the basic purpose of restaurants to provide food and drink, restaurants have, historically, fulfilled a human need for connection and shaped social relations. Offer An Experience. What makes a restaurant iconic is the experience it offers to the customers. Lagoon deck restaurant , which is my site as well as my client situated in Katunayake in Negombo area Sri Lanka is a two story building . Next to lagoon atmosphere is just great, good place to hangout with your family / friends. both indoor and outdoor dinning there with specially on delicious seafood menus .There is also a pool facing the lagoon with water activities in lagoon such as boat rides experiences .And it is close to Negombo beach where many of Negombo people trend to hangout . As Sri Lanka surrounded by the Indian ocean where I going to use were captivated by the costal lagoon features of Sri Lanka . The fishing industry became an iconic symbol in Sri Lanka specially in Negombo area which is also the heart of the country economy and culture. it reminds the exploration of wilderness and tropical atmosphere of lagoon with the taste of famous and mostly available food in the Negombo area which is seafood.",
    detailSections: [
      {
        subtitle: "CONCEPT - TASTE IN LAGOON",
        description:
          "Make feeling and experience of being in the lagoon while eating the lagoon seafood making vibe to lagoon art. and also giving a pleasing welcome to the art of lagoon Which shows the exploration of the wilderness in lagoon and merging with tradition innovation in Oder to feel the Sri Lankan style simply but also in youthful manner with the seafood taste .. Where you can feel the REFLECT OF YOUR TASTE THROUGH CREATIVITY OF LAGOON. which shows the exploration of the wilderness and merging with tradition innovation in Oder to feel the Sri Lankan style simply but also in youthful .",
      },
    ],
  },
  {
    title: "SRI VILLA BEACH AYU ARANA - NEGOMBO",
    category: "Wellness &  Healthcare",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    description:
      "A luxurious bedroom suite with soft ambient lighting, elegant headboard detailing, integrated storage, and a restful monochrome-inspired design language.",
  },
  {
    title: "Slate & Stone Kitchen Concept",
    category: "Residential",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    description:
      "A modern kitchen interior designed with clean-lined cabinetry, premium stone surfaces, concealed storage, and a timeless combination of beauty and practicality.",
  },
  {
    title: "Pulse Creative Studio",
    category: "Commercial",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    description:
      "A collaborative studio space with an energetic modern layout, adaptive work zones, accent lighting, and polished finishes that support creativity and productivity.",
  },
  {
    title: "Vertex Corporate Office",
    category: "Commercial",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80",
    description:
      "A professional office design featuring a futuristic reception, elegant meeting rooms, acoustic planning, and a balanced environment for focused work.",
  },
  {
    title: "Monolith Executive Lounge",
    category: "Commercial",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    description:
      "A premium executive lounge concept with dramatic textures, moody lighting, luxury seating, and a strong visual identity for high-end business hospitality.",
  },
  {
    title: "GPV GALLERY - NEGOMBO",
    category: "Retail & Commercial",
    year: "2025",
    image: "/images/Industrial/RandC/gpv/gallery.png",
    imageFit: "contain",
    description:
      "A flexible co-working environment designed to feel open, smart, and social with modular seating, layered zoning, and refined monochrome finishes.",
  },

  {
    title: "AVE MARIA HOSPITAL - NEGOMBO",
    category: "Healthcare",
    year: "2025",
    image: "/images/Industrial/Healthcare/avemariahospital/hospital1.png",
    imageFit: "contain",
    description:
      "An upscale restaurant concept with curated mood lighting, sophisticated seating layouts, layered textures, and a memorable premium dining identity.",
  },
  {
    title: "GPV SIGNAGE DESIGNS - NEGOMBO",
    category: "Retail & Commercial",
    year: "2025",
    image: "/images/Industrial/RandC/gpv/signage.png",
    imageFit: "contain",
    description:
      "A boutique hotel lobby designed to make a striking first impression through sculptural forms, elegant materials, and a luxurious spatial flow.",
  },
  {
    title: "PALACE APARTMENT - GAMPAHA",
    category: "Residential",
    year: "2024",
    image: "/images/Industrial/Residential/palace/palace1.png",
    imageFit: "contain",
    description:
      "A resort suite interior that combines relaxation and elegance with soft geometry, premium surfaces, and a calm, immersive guest experience.",
  },
  {
    title: "ICONIC GALAXY APARTMENT - COLOMBO",
    category: "Residential",
    year: "2025",
    image: "/images/Industrial/Residential/iconic/iconic1.png",
    imageFit: "contain",
    description:
      "A modern fashion retail concept with clean display systems, futuristic lighting accents, and a customer flow designed to elevate product presentation.",
  },
  {
    title: "HOUSING PROJECT - MARAWILA",
    category: "Residential",
    year: "2025",
    image: "/images/Industrial/Residential/marawila/marawila1.png",
    imageFit: "contain",
    images: ["/images/Industrial/Residential/marawila/marawila2.png"],
    description:
      "A luxury showroom interior focused on detail, contrast, premium finishes, and carefully lit display zones to create an elevated shopping experience.",
  },
  {
    title: "SANTORINI APARTMENTS - VILLA 1",
    category: "Residential",
    year: "2025",
    image: "/images/Industrial/Residential/santorini/santorinivilla1.png",
    imageFit: "contain",
    description:
      "A sleek beauty studio with mirrored surfaces, elegant textures, and a polished contemporary design that supports both service and retail functions.",
  },
  {
    title: "SANTORINI APARTMENTS - VILLA 2",
    category: "Residential",
    year: "2025",
    image: "/images/Industrial/Residential/santorini/santorinivilla2.png",
    imageFit: "contain",
    description:
      "A playful concept bedroom designed with safety, storage, soft shapes, and a future-ready aesthetic tailored for comfort and imagination.",
  },
  {
    title: "SANTORINI APARTMENTS - VILLA 3",
    category: "Residential",
    year: "2026",
    image: "/images/Industrial/Residential/santorini/santorinivilla3.png",
    imageFit: "contain",
    description:
      "A compact yet premium home office concept featuring ergonomic planning, clean lines, integrated lighting, and a distraction-free environment.",
  },
  {
    title: "RIO CAFE",
    category: "Hospitality",
    year: "2026",
    image: "/images/Industrial/Hostpitality/riocafe1.png",
    imageFit: "contain",
    description:
      "A wellness-focused spa concept with calming textures, soft transitions, ambient lighting, and a serene luxury atmosphere for relaxation.",
  },
];

export const navItems = [
  { label: "About", path: "/about", targetId: "about" },
  { label: "Projects", path: "/projects", targetId: "projects" },
  { label: "Skills", path: "/skills", targetId: "skills" },
  { label: "Contact", path: "/contact", targetId: "contact" },
];

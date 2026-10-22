export type Locale = "en" | "sv";

export const locales: Locale[] = ["en", "sv"];
export const defaultLocale: Locale = "en";

export type JourneyChapter = {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  image: string;
};

export type SkillGroup = { category: string; items: string[] };

export type CaseStudySection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type CaseStudyStack = {
  category: string;
  items: string[];
};

export type CaseStudy = {
  tagline: string;
  overview: string;
  year: string;
  role: string;
  accent: string;
  sections: CaseStudySection[];
  outcomes: string[];
  stack: CaseStudyStack[];
  labels: {
    backToProjects: string;
    caseStudy: string;
    overviewHeading: string;
    roleLabel: string;
    yearLabel: string;
    typeLabel: string;
    statusLabel: string;
    statusLive: string;
    statusDev: string;
    outcomesHeading: string;
    stackHeading: string;
    ctaHeading: string;
    ctaBody: string;
    ctaButton: string;
    liveButton: string;
    githubButton: string;
  };
};

export type Project = {
  name: string;
  type: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  live?: boolean;
  featured?: boolean;
  // Full-width card at the top of the grid
  flagship?: boolean;
  video?: string;
  poster?: string;
  slug?: string;
  caseStudy?: CaseStudy;
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
};

export type Education = {
  school: string;
  program: string;
  courses: string[];
};

export type Reference = {
  name: string;
  role: string;
  company: string;
  quote: string;
};

export type Content = {
  personal: {
    name: string;
    role: string;
    tagline: string;
    location: string;
    bio: string;
    availableLabel: string;
    searchLabel: string;
    searchValue: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    cv: string;
    cal: string;
    languages: { name: string; level: string }[];
    coordsCity: string;
  };
  journey: JourneyChapter[];
  skills: SkillGroup[];
  learning: string[];
  projects: Project[];
  experience: Experience[];
  education: Education;
  references: Reference[];
  ui: {
    nav: {
      about: string;
      journey: string;
      projects: string;
      skills: string;
      experience: string;
      contact: string;
      cta: string;
    };
    hero: {
      followJourney: string;
      seeProjects: string;
      scroll: string;
    };
    about: {
      section: string;
      title1: string;
      title2: string;
      headline: string;
      p1: string;
      p2: string;
      p3: string;
      basedIn: string;
      focus: string;
      focusValue: string;
      seeking: string;
      seekingValue: string;
    };
    journey: {
      chapter: string;
      hint: string;
    };
    skills: {
      section: string;
      title1: string;
      title2: string;
      description: string;
      learning: string;
    };
    projects: {
      section: string;
      title1: string;
      title2: string;
      description: string;
      allRepos: string;
      live: string;
    };
    experience: {
      section: string;
      title1: string;
      title2: string;
      educationLabel: string;
    };
    references: {
      section: string;
      title1: string;
      title2: string;
    };
    contact: {
      section: string;
      title1: string;
      title2: string;
      description: string;
      mailMe: string;
      downloadCv: string;
      bookCall: string;
      bookCallHint: string;
      email: string;
      phone: string;
      location: string;
      github: string;
      linkedin: string;
      languages: string;
      footer: string;
      version: string;
    };
    common: {
      now: string;
    };
  };
};

const shared = {
  name: "Bozhidar Ivanov",
  email: "bojidarivanov98@gmail.com",
  phone: "0762 20 80 52",
  github: "https://github.com/b1-loop",
  linkedin: "https://www.linkedin.com/in/bozhidar-ivanov-48158637b",
  cv: "/bozhidar-ivanov-cv.pdf",
  cal: "https://cal.com/bojidarivanov-98-mkhv6b",
} as const;

const images = {
  factory:
    "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=2400&q=80",
  founder:
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=2400&q=80",
  developer:
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=2400&q=80",
  now: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2400&q=80",
} as const;

export const content: Record<Locale, Content> = {
  en: {
    personal: {
      ...shared,
      role: "Fullstack Developer",
      tagline: "Built by discipline. Shaped by code.",
      location: "Gothenburg, Sweden",
      coordsCity: "Gothenburg, SE",
      bio: "A disciplined software engineer combining leadership from industrial environments with modern .NET development. I built my path from Volvo Cars and running a premium auto detailing business to specializing in C# and .NET backend with Clean Architecture.",
      availableLabel: "Available",
      searchLabel: "Looking for",
      searchValue: ".NET / Fullstack roles",
      languages: [
        { name: "Bulgarian", level: "Native" },
        { name: "Swedish", level: "Fluent" },
        { name: "English", level: "Fluent" },
      ],
    },
    journey: [
      {
        id: "now",
        year: "Now",
        title: "Next Chapter",
        subtitle: "Fullstack Developer — Open for new roles",
        description:
          "Today I lead projects at InFiNet Code and build fullstack solutions at Devotion Ventures. Next step: a team where I can contribute from day one.",
        accent: "#a78bfa",
        image: images.now,
      },
      {
        id: "developer",
        year: "2024",
        title: "The Developer",
        subtitle: "NBI Handelsakademin — .NET System Development",
        description:
          "Traded the coveralls for an editor. Immersed myself in C#, .NET, Clean Architecture and SOLID. Built 10+ projects — from Blazor apps with OpenAI to fullstack platforms with React.",
        accent: "#7dd3fc",
        image: images.developer,
      },
      {
        id: "founder",
        year: "2021",
        title: "The Entrepreneur",
        subtitle: "HB Luxury Auto Detailing — CEO & Founder",
        description:
          "Founded and scaled a premium auto detailing business. Strategy, operations, customer relationships — and an obsession for detail that still lives in every line of code.",
        accent: "#c9a15b",
        image: images.founder,
      },
      {
        id: "factory",
        year: "2018",
        title: "The Factory Floor",
        subtitle: "Volvo Cars — Machine Operator & Team Leader",
        description:
          "Precision, tempo and responsibility. At Volvo I learned that quality isn't an opinion — it's a process. Leading in high-volume production shaped my discipline.",
        accent: "#8a8f98",
        image: images.factory,
      },
    ],
    skills: [
      {
        category: "Backend",
        items: [
          "C#",
          ".NET 8",
          "ASP.NET Core",
          "Clean Architecture",
          "SOLID",
          "CQRS / MediatR",
          "REST API Design",
        ],
      },
      {
        category: "Frontend",
        items: ["React", "Blazor", "Tailwind CSS", "HTML / CSS", "MudBlazor"],
      },
      {
        category: "Database",
        items: [
          "SQL Server",
          "Entity Framework Core",
          "Database Design & Normalization",
          "LINQ",
        ],
      },
      {
        category: "Tools & DevOps",
        items: ["Git", "GitHub", "Docker", "Azure", "GitHub Actions", "CI/CD"],
      },
      {
        category: "Testing",
        items: [
          "xUnit",
          "NUnit",
          "Moq",
          "Unit Testing",
          "TDD",
          "Integration Testing",
        ],
      },
      {
        category: "Security",
        items: [
          "JWT Authentication",
          "OAuth2 / OpenID Connect",
          "Role-based Authorization",
          "CORS",
          "Input Validation",
        ],
      },
      {
        category: "Leadership",
        items: [
          "Team Leadership",
          "Agile / Scrum",
          "Sprint Planning",
          "Stakeholder Communication",
          "Code Review",
        ],
      },
    ],
    learning: ["Kubernetes", "gRPC", "Domain-Driven Design", "Microservices"],
    projects: [
      {
        name: "DOJO Future",
        type: "EdTech SaaS · InFiNet Code",
        description:
          "School platform for Swedish vocational colleges (YH) — admissions, steering group, internships (LIA), finance and learning in one modular system.",
        stack: ["Next.js", "Tailwind CSS", "SaaS", "i18n"],
        demo: "https://dofu.se/en",
        live: true,
        featured: true,
        flagship: true,
      },
      {
        name: "Jarvis Desktop",
        type: "Desktop AI · Python + C++",
        description:
          "Voice-controlled AI assistant for Windows — Python is the conductor, C++ is the muscle. Wake word, barge-in and a local LLM agent with 63 tools, no cloud required.",
        stack: ["Python 3.12", "C++20", "pybind11", "Ollama", "ONNX Runtime", "whisper", "Dear ImGui"],
        github: "https://github.com/b1-loop/jarvis-desktop",
        featured: true,
        flagship: true,
        video: "/projects/jarvis-desktop-demo.mp4",
        poster: "/projects/jarvis-desktop-poster.png",
      },
      {
        name: "Onio",
        type: "Client Website",
        description:
          "Modern business website — responsive design, clean content architecture and production-grade delivery.",
        stack: ["Web", "UI/UX", "Production"],
        demo: "https://www.onio.se/",
        live: true,
        featured: true,
      },
      {
        name: "NexaPay",
        type: "Fintech · Backend",
        description:
          "Backend for a modern payment platform. Secure, well-structured .NET services with clean architecture principles.",
        stack: ["C#", ".NET", "API"],
        github: "https://github.com/b1-loop/NexaPay",
        featured: true,
        slug: "nexapay",
        caseStudy: {
          tagline: "A modern payment platform backend built with Clean Architecture and .NET.",
          overview:
            "NexaPay is a payment platform I'm building to explore secure transaction processing, domain-driven design and service architecture with .NET. The backend focuses on clear boundaries between billing, ledger and authentication so the platform can grow without turning into a mess.",
          year: "2026",
          role: "Backend engineer",
          accent: "#7dd3fc",
          sections: [
            {
              heading: "The challenge",
              body: "Payment systems demand precision. A missed decimal, an unclear state transition or a poorly guarded endpoint can cause real financial impact. The goal was a backend where correctness is the default — not something you bolt on later.",
            },
            {
              heading: "The approach",
              body: "I structured the codebase around Clean Architecture with clear separation between domain, application, infrastructure and presentation. Domain-driven modelling captures the core payment concepts (transactions, wallets, ledgers) as first-class citizens.",
              bullets: [
                "Domain entities with strict invariants",
                "CQRS-style command / query handlers via MediatR",
                "EF Core for persistence, isolated behind repositories",
                "JWT-based auth with role separation for admin vs user flows",
              ],
            },
            {
              heading: "Architecture",
              body: "Layered separation means infrastructure choices (payment provider, database engine) can change without touching business rules. Each command flows through validation → domain rules → persistence → integration events, which keeps the code easy to reason about.",
            },
            {
              heading: "What I focused on",
              body: "The interesting problems here weren't just \"write CRUD\" — they were about protecting money and modelling ambiguity out of the domain.",
              bullets: [
                "Explicit money type (never floats) to avoid rounding bugs",
                "State machines for transactions instead of loose booleans",
                "Idempotency for payment intents so retries can't double-charge",
                "Clear error surface — no leaky exceptions from lower layers",
              ],
            },
          ],
          outcomes: [
            "A backend ready to integrate with the companion frontend (built together with Haval Jalal).",
            "Test coverage on critical paths — the invariants of money never break silently.",
            "A codebase that's easy to extend with new payment methods without rewriting core rules.",
          ],
          stack: [
            { category: "Backend", items: ["C#", ".NET 8", "ASP.NET Core", "MediatR"] },
            { category: "Data", items: ["EF Core", "SQL Server", "Repository pattern"] },
            { category: "Security", items: ["JWT", "OAuth 2.0", "Role-based auth"] },
            { category: "Testing", items: ["xUnit", "Moq", "Integration tests"] },
          ],
          labels: {
            backToProjects: "Back to projects",
            caseStudy: "Case Study",
            overviewHeading: "Overview",
            roleLabel: "Role",
            yearLabel: "Year",
            typeLabel: "Type",
            statusLabel: "Status",
            statusLive: "Live",
            statusDev: "In development",
            outcomesHeading: "Outcomes",
            stackHeading: "Stack",
            ctaHeading: "Want to build something similar?",
            ctaBody: "I'm open for .NET / Fullstack roles. Let's talk about what you're building.",
            ctaButton: "Get in touch",
            liveButton: "Live site",
            githubButton: "View on GitHub",
          },
        },
      },
      {
        name: "NexaPay Frontend",
        type: "Fintech · Frontend · Collab",
        description:
          "Frontend companion for NexaPay built together with Haval Jalal — modern UI for payments and transactions.",
        stack: ["React", "TypeScript", "UI"],
        github: "https://github.com/Haval-Jalal/NexaPay-FE",
      },
      {
        name: "Jarvis",
        type: "AI Assistant",
        description:
          "Personal AI assistant experiment integrating LLM capabilities with practical utility tools.",
        stack: ["AI", "LLM", "Automation"],
        github: "https://github.com/b1-loop/Jarvis",
      },
      {
        name: "Restaurant Platform",
        type: "Web App",
        description:
          "Robust restaurant booking and ordering system with table management and real-time orders.",
        stack: ["C#/.NET Web API", "React"],
        github: "https://github.com/b1-loop/ResturangTest",
        demo: "https://muchachotapas.se/",
        live: true,
      },
      {
        name: "Tuggets Portal",
        type: "Management App",
        description:
          "Scalable fullstack app for data handling and operational management with clear separation of concerns.",
        stack: ["C#", ".NET 8", "SQL"],
        github: "https://github.com/b1-loop/TuggetsPP",
        demo: "https://b1-loop.github.io/TuggetsPP/",
      },
      {
        name: "Loop Portal",
        type: "Portal / Dashboard",
        description:
          "Centralized admin portal with role-based access control and user dashboard.",
        stack: ["Fullstack .NET", "UI/UX"],
        github: "https://github.com/b1-loop/loop-portal",
        demo: "https://b1-loop.github.io/loop-portal/",
      },
      {
        name: "SalaryCoach",
        type: "AI & Blazor",
        description:
          "Intelligent negotiation assistant with OpenAI GPT-4 generating tailored salary negotiation scripts.",
        stack: [".NET 8", "Blazor", "OpenAI API", "MudBlazor"],
        github: "https://github.com/b1-loop/SalaryCoach",
      },
      {
        name: "Salary Helper",
        type: "Finance Tool",
        description:
          "Utility for calculating, tracking and managing salary expectations and historical data.",
        stack: [".NET", "Web Calculations"],
        github: "https://github.com/b1-loop/SalaryHelper",
      },
      {
        name: "Eventify Booking",
        type: "Database First",
        description:
          "Production-grade booking system with normalized SQL schema and advanced EF Core queries.",
        stack: ["SQL Server", "EF Core", "Database First", "CRUD"],
        github: "https://github.com/b1-loop/EventBooking",
      },
      {
        name: "GitHub Dashboard",
        type: "API Integration",
        description:
          "Visual dashboard showing user stats, repository data and commit history via the GitHub API.",
        stack: ["JavaScript/React", "REST API", "JSON"],
        github: "https://github.com/b1-loop/github---dashboard",
      },
      {
        name: "Travel Journal",
        type: "Scalable System",
        description:
          "Large-scale system with a generic DataStore repository pattern, 2FA and advanced UI.",
        stack: ["C#", "SOLID", "Generics", "Spectre.Console"],
        github: "https://github.com/b1-loop/Travel-Journal",
      },
      {
        name: "Quest Tracker",
        type: "Productivity",
        description:
          "Goal and task management with a domain-driven architecture and LINQ analytics.",
        stack: ["C#", "Clean Architecture", "LINQ"],
        github: "https://github.com/b1-loop/Quest-Guild-Terminal",
      },
      {
        name: "Labyrinth Game",
        type: "Logic Game",
        description:
          "Maze game demonstrating algorithmic thinking and object-oriented game state management.",
        stack: ["C#", "Algorithms", "Teamwork"],
        github: "https://github.com/Jocke-1994/LabyrinthGame",
      },
    ],
    experience: [
      {
        role: "Project Leader",
        company: "InFiNet Code",
        period: "2026 – Now",
        bullets: [
          "Led agile methodologies, sprint planning and retrospectives",
          "Bridged technical teams with stakeholders",
          "Handled risk mitigation for critical deployments",
        ],
      },
      {
        role: "Full-Stack Developer",
        company: "Devotion Ventures",
        period: "2026 – Now",
        bullets: [
          "Designed scalable end-to-end applications",
          "Refactored legacy codebases to modern standards",
          "Implemented unit tests and CI/CD improvements",
        ],
      },
      {
        role: "CEO & Founder",
        company: "HB Luxury Auto Detailing",
        period: "2021 – 2024",
        bullets: [
          "Founded and scaled a profitable premium business",
          "Owned strategy, operations and customer relations",
        ],
      },
      {
        role: "Machine Operator & Team Leader",
        company: "Volvo Cars",
        period: "2018 – Now",
        bullets: [
          "Ensured production quality in automated manufacturing",
          "Led teams in high-volume production",
          "Drove continuous process improvement",
        ],
      },
      {
        role: "Board Deputy Member",
        company: "Casa Domini AB",
        period: "2018 – Now",
        bullets: [
          "Supported strategic governance and decision-making",
          "Managed the organization's website and IT support",
        ],
      },
    ],
    education: {
      school: "NBI Handelsakademin",
      program: ".NET System Development",
      courses: [
        "Advanced C# & OOP",
        "SQL & Relational Database Design",
        "ASP.NET Core & Web Development",
        "Clean Code, SOLID, Agile",
      ],
    },
    references: [
      {
        name: "Nemanja Milosavljevic",
        role: "Owner & IT Consultant",
        company: "InFiNet Code AB",
        quote:
          "Exceptional problem-solving mindset and a disciplined approach that makes a real difference to the team.",
      },
      {
        name: "Rajan Mahdavi",
        role: "Project Manager",
        company: "Volvo Group",
        quote:
          "Outstanding leadership and the ability to coordinate teams under production pressure.",
      },
      {
        name: "Arian Alikashani",
        role: "Backend Developer",
        company: "Norion Bank",
        quote:
          "A fast learner who writes clean, maintainable backend code. Great to have on the team.",
      },
    ],
    ui: {
      nav: {
        about: "About",
        journey: "Journey",
        projects: "Projects",
        skills: "Skills",
        experience: "Experience",
        contact: "Contact",
        cta: "Contact",
      },
      hero: {
        followJourney: "Follow the journey",
        seeProjects: "See projects",
        scroll: "Scroll",
      },
      about: {
        section: "01 · About",
        title1: "About",
        title2: "me",
        headline: "I didn't start in code. I started on the factory floor.",
        p1: "For years I ran machines at Volvo Cars — precision, tempo and ownership. That's where the discipline was forged. I then built HB Luxury Auto Detailing from scratch and learned how to sell, deliver, and obsess over every last detail.",
        p2: "Today I write C# and .NET with the same craftsmanship — Clean Architecture, SOLID, tests you can trust. React on the frontend when the project needs it. I care about code that ages well, not code that ships fast and rots.",
        p3: "I'm looking for a team where I can contribute from day one, keep learning at a serious pace, and build things that matter.",
        basedIn: "Based in",
        focus: "Focus",
        focusValue: "C# / .NET · Fullstack",
        seeking: "Seeking",
        seekingValue: ".NET / Fullstack roles",
      },
      journey: {
        chapter: "Chapter",
        hint: "Journey · Scroll",
      },
      skills: {
        section: "02 · Skills",
        title1: "Tools &",
        title2: "mindset",
        description:
          "From Clean Architecture to Docker — a stack built for long-term maintainability, not quick shortcuts.",
        learning: "Currently → Learning",
      },
      projects: {
        section: "03 · Projects",
        title1: "Selected",
        title2: "works",
        description:
          "Ten projects representing my journey into .NET, React and fullstack architecture. Code, concepts and ambition.",
        allRepos: "All repos on GitHub",
        live: "LIVE",
      },
      experience: {
        section: "04 · Experience",
        title1: "Where I",
        title2: "have been",
        educationLabel: "Education",
      },
      references: {
        section: "05 · References",
        title1: "What others",
        title2: "say",
      },
      contact: {
        section: "06 · Contact",
        title1: "Let's build",
        title2: "something.",
        description:
          "Open for fullstack and .NET roles. Based in Gothenburg, ready to relocate for the right team. Reach out — I always reply.",
        mailMe: "Email me",
        downloadCv: "Download CV",
        bookCall: "Book a 15-min call",
        bookCallHint: "via Cal.com",
        email: "Email",
        phone: "Phone",
        location: "Location",
        github: "GitHub",
        linkedin: "LinkedIn",
        languages: "Languages",
        footer: "Built with Next.js & care.",
        version: "v2 · Gothenburg",
      },
      common: {
        now: "Now",
      },
    },
  },
  sv: {
    personal: {
      ...shared,
      role: "Fullstack Developer",
      tagline: "Byggd av disciplin. Formad av kod.",
      location: "Göteborg, Sverige",
      coordsCity: "Göteborg, SE",
      bio: "En disciplinerad mjukvaruingenjör som kombinerar ledarskap från industriella miljöer med modern .NET-utveckling. Jag byggde min bana från Volvo Cars och ett eget premiumföretag inom bildetaljering till att specialisera mig på C# och .NET backend med Clean Architecture.",
      availableLabel: "Tillgänglig",
      searchLabel: "Söker",
      searchValue: ".NET / Fullstack roller",
      languages: [
        { name: "Bulgariska", level: "Modersmål" },
        { name: "Svenska", level: "Flytande" },
        { name: "Engelska", level: "Flytande" },
      ],
    },
    journey: [
      {
        id: "now",
        year: "Nu",
        title: "Nästa kapitel",
        subtitle: "Fullstack Developer — Öppen för nya roller",
        description:
          "Idag leder jag projekt på InFiNet Code och bygger fullstack-lösningar på Devotion Ventures. Nästa steg: ett team där jag kan bidra från dag ett.",
        accent: "#a78bfa",
        image: images.now,
      },
      {
        id: "developer",
        year: "2024",
        title: "Utvecklaren",
        subtitle: "NBI Handelsakademin — .NET System Development",
        description:
          "Bytte overallen mot en editor. Fördjupade mig i C#, .NET, Clean Architecture och SOLID. Byggde 10+ projekt — från Blazor-appar med OpenAI till fullstack-plattformar med React.",
        accent: "#7dd3fc",
        image: images.developer,
      },
      {
        id: "founder",
        year: "2021",
        title: "Entreprenören",
        subtitle: "HB Luxury Auto Detailing — CEO & Founder",
        description:
          "Grundade och skalade ett premiumföretag inom bildetaljering. Strategi, drift, kundrelationer — och en obsession för detalj som fortfarande sitter i varje rad kod.",
        accent: "#c9a15b",
        image: images.founder,
      },
      {
        id: "factory",
        year: "2018",
        title: "Fabriksgolvet",
        subtitle: "Volvo Cars — Machine Operator & Team Leader",
        description:
          "Precision, tempo och ansvar. På Volvo lärde jag mig att kvalitet inte är en åsikt — det är en process. Ledarskap i högvolymsproduktion formade min disciplin.",
        accent: "#8a8f98",
        image: images.factory,
      },
    ],
    skills: [
      {
        category: "Backend",
        items: [
          "C#",
          ".NET 8",
          "ASP.NET Core",
          "Clean Architecture",
          "SOLID",
          "CQRS / MediatR",
          "REST API Design",
        ],
      },
      {
        category: "Frontend",
        items: ["React", "Blazor", "Tailwind CSS", "HTML / CSS", "MudBlazor"],
      },
      {
        category: "Databas",
        items: [
          "SQL Server",
          "Entity Framework Core",
          "Databasdesign & Normalisering",
          "LINQ",
        ],
      },
      {
        category: "Tools & DevOps",
        items: ["Git", "GitHub", "Docker", "Azure", "GitHub Actions", "CI/CD"],
      },
      {
        category: "Testning",
        items: [
          "xUnit",
          "NUnit",
          "Moq",
          "Unit Testing",
          "TDD",
          "Integration Testing",
        ],
      },
      {
        category: "Säkerhet",
        items: [
          "JWT Authentication",
          "OAuth2 / OpenID Connect",
          "Role-based Authorization",
          "CORS",
          "Input Validation",
        ],
      },
      {
        category: "Ledarskap",
        items: [
          "Team Leadership",
          "Agile / Scrum",
          "Sprint Planning",
          "Stakeholder Communication",
          "Code Review",
        ],
      },
    ],
    learning: ["Kubernetes", "gRPC", "Domain-Driven Design", "Microservices"],
    projects: [
      {
        name: "DOJO Future",
        type: "EdTech SaaS · InFiNet Code",
        description:
          "Skolsystem för YH-skolor — antagning, ledningsgrupp, LIA, ekonomi och lärande i ett modulärt system.",
        stack: ["Next.js", "Tailwind CSS", "SaaS", "i18n"],
        demo: "https://dofu.se/sv",
        live: true,
        featured: true,
        flagship: true,
      },
      {
        name: "Jarvis Desktop",
        type: "Desktop AI · Python + C++",
        description:
          "Röststyrd AI-assistent för Windows — Python dirigerar, C++ gör grovjobbet. Väckord, avbrott mitt i meningen och en lokal LLM-agent med 63 verktyg, helt utan moln.",
        stack: ["Python 3.12", "C++20", "pybind11", "Ollama", "ONNX Runtime", "whisper", "Dear ImGui"],
        github: "https://github.com/b1-loop/jarvis-desktop",
        featured: true,
        flagship: true,
        video: "/projects/jarvis-desktop-demo.mp4",
        poster: "/projects/jarvis-desktop-poster.png",
      },
      {
        name: "Onio",
        type: "Kundwebbplats",
        description:
          "Modern företagswebbplats — responsiv design, ren innehållsarkitektur och produktionsklar leverans.",
        stack: ["Web", "UI/UX", "Produktion"],
        demo: "https://www.onio.se/",
        live: true,
        featured: true,
      },
      {
        name: "NexaPay",
        type: "Fintech · Backend",
        description:
          "Backend till en modern betalningsplattform. Säkra, välstrukturerade .NET-tjänster med Clean Architecture-principer.",
        stack: ["C#", ".NET", "API"],
        github: "https://github.com/b1-loop/NexaPay",
        featured: true,
        slug: "nexapay",
        caseStudy: {
          tagline: "En modern betalningsplattform-backend byggd med Clean Architecture och .NET.",
          overview:
            "NexaPay är en betalningsplattform jag bygger för att utforska säker transaktionshantering, domain-driven design och tjänstearkitektur med .NET. Backenden fokuserar på tydliga gränser mellan billing, ledger och autentisering så att plattformen kan växa utan att bli en röra.",
          year: "2026",
          role: "Backend-utvecklare",
          accent: "#7dd3fc",
          sections: [
            {
              heading: "Utmaningen",
              body: "Betalningssystem kräver precision. En missad decimal, en otydlig state-övergång eller en dåligt skyddad endpoint kan orsaka verklig ekonomisk skada. Målet var en backend där korrekthet är standard — inte något man lägger till efteråt.",
            },
            {
              heading: "Approach",
              body: "Jag strukturerade kodbasen efter Clean Architecture med tydlig separation mellan domain, application, infrastructure och presentation. Domain-driven modeling fångar centrala begrepp (transaktioner, wallets, ledgers) som förstaklassborgare.",
              bullets: [
                "Domain-entiteter med strikta invarianter",
                "CQRS-stil command / query handlers via MediatR",
                "EF Core för persistens, isolerad bakom repositories",
                "JWT-baserad autentisering med rollseparation för admin vs användare",
              ],
            },
            {
              heading: "Arkitektur",
              body: "Lagerseparationen betyder att infrastrukturval (betalleverantör, databasmotor) kan bytas ut utan att röra affärsreglerna. Varje command flödar genom validering → domänregler → persistens → integration events, vilket gör koden lätt att resonera om.",
            },
            {
              heading: "Vad jag fokuserade på",
              body: "De intressanta problemen här var inte bara \"skriv CRUD\" — det handlade om att skydda pengar och modellera bort tvetydighet från domänen.",
              bullets: [
                "Explicit money-typ (aldrig floats) för att undvika avrundningsfel",
                "State machines för transaktioner istället för lösa booleans",
                "Idempotency för payment intents så retries inte kan dubbeldebitera",
                "Ren felyta — inga läckande exceptions från lägre lager",
              ],
            },
          ],
          outcomes: [
            "En backend redo att integreras med den kompanjonerande frontenden (byggd tillsammans med Haval Jalal).",
            "Testtäckning på kritiska paths — invarianterna för pengar går aldrig sönder tyst.",
            "En kodbas som är lätt att utöka med nya betalningsmetoder utan att skriva om kärnreglerna.",
          ],
          stack: [
            { category: "Backend", items: ["C#", ".NET 8", "ASP.NET Core", "MediatR"] },
            { category: "Data", items: ["EF Core", "SQL Server", "Repository pattern"] },
            { category: "Säkerhet", items: ["JWT", "OAuth 2.0", "Rollbaserad auth"] },
            { category: "Testning", items: ["xUnit", "Moq", "Integrationstester"] },
          ],
          labels: {
            backToProjects: "Tillbaka till projekt",
            caseStudy: "Case Study",
            overviewHeading: "Översikt",
            roleLabel: "Roll",
            yearLabel: "År",
            typeLabel: "Typ",
            statusLabel: "Status",
            statusLive: "Live",
            statusDev: "Under utveckling",
            outcomesHeading: "Resultat",
            stackHeading: "Stack",
            ctaHeading: "Vill du bygga något liknande?",
            ctaBody: "Jag är öppen för .NET / Fullstack-roller. Låt oss prata om vad du bygger.",
            ctaButton: "Kontakta mig",
            liveButton: "Live-sida",
            githubButton: "Visa på GitHub",
          },
        },
      },
      {
        name: "NexaPay Frontend",
        type: "Fintech · Frontend · Samarbete",
        description:
          "Frontend till NexaPay byggd tillsammans med Haval Jalal — modern UI för betalningar och transaktioner.",
        stack: ["React", "TypeScript", "UI"],
        github: "https://github.com/Haval-Jalal/NexaPay-FE",
      },
      {
        name: "Jarvis",
        type: "AI-assistent",
        description:
          "Personlig AI-assistent-experiment som integrerar LLM-kapabiliteter med praktiska verktyg.",
        stack: ["AI", "LLM", "Automation"],
        github: "https://github.com/b1-loop/Jarvis",
      },
      {
        name: "Restaurant Platform",
        type: "Web App",
        description:
          "Robust bokningssystem för restauranger med bordshantering och realtidsordning.",
        stack: ["C#/.NET Web API", "React"],
        github: "https://github.com/b1-loop/ResturangTest",
        demo: "https://muchachotapas.se/",
        live: true,
      },
      {
        name: "Tuggets Portal",
        type: "Management App",
        description:
          "Skalbar fullstack-applikation för datahantering och operativ styrning med tydlig separation of concerns.",
        stack: ["C#", ".NET 8", "SQL"],
        github: "https://github.com/b1-loop/TuggetsPP",
        demo: "https://b1-loop.github.io/TuggetsPP/",
      },
      {
        name: "Loop Portal",
        type: "Portal / Dashboard",
        description:
          "Centraliserad administrativ portal med rollbaserad åtkomstkontroll och användardashboard.",
        stack: ["Fullstack .NET", "UI/UX"],
        github: "https://github.com/b1-loop/loop-portal",
        demo: "https://b1-loop.github.io/loop-portal/",
      },
      {
        name: "SalaryCoach",
        type: "AI & Blazor",
        description:
          "Intelligent förhandlingsassistent med OpenAI GPT-4 som genererar skräddarsydda löneförhandlingsmanus.",
        stack: [".NET 8", "Blazor", "OpenAI API", "MudBlazor"],
        github: "https://github.com/b1-loop/SalaryCoach",
      },
      {
        name: "Salary Helper",
        type: "Finance Tool",
        description:
          "Verktyg för att beräkna, spåra och hantera löneförväntningar och historisk data.",
        stack: [".NET", "Web Calculations"],
        github: "https://github.com/b1-loop/SalaryHelper",
      },
      {
        name: "Eventify Booking",
        type: "Database First",
        description:
          "Produktionsklassat bokningssystem med normaliserat SQL-schema och avancerade EF Core-queries.",
        stack: ["SQL Server", "EF Core", "Database First", "CRUD"],
        github: "https://github.com/b1-loop/EventBooking",
      },
      {
        name: "GitHub Dashboard",
        type: "API Integration",
        description:
          "Visuell dashboard som visar användarstatistik, repository-data och commit-historik via GitHub API.",
        stack: ["JavaScript/React", "REST API", "JSON"],
        github: "https://github.com/b1-loop/github---dashboard",
      },
      {
        name: "Travel Journal",
        type: "Skalbart System",
        description:
          "Storskaligt system med generiskt DataStore repository-mönster, 2FA och avancerad UI.",
        stack: ["C#", "SOLID", "Generics", "Spectre.Console"],
        github: "https://github.com/b1-loop/Travel-Journal",
      },
      {
        name: "Quest Tracker",
        type: "Produktivitet",
        description:
          "Mål- och uppgiftshantering med domändriven arkitektur och LINQ-analys.",
        stack: ["C#", "Clean Architecture", "LINQ"],
        github: "https://github.com/b1-loop/Quest-Guild-Terminal",
      },
      {
        name: "Labyrinth Game",
        type: "Logikspel",
        description:
          "Labyrintspel som demonstrerar algoritmiskt tänkande och objektorienterad speltillståndshantering.",
        stack: ["C#", "Algorithms", "Teamwork"],
        github: "https://github.com/Jocke-1994/LabyrinthGame",
      },
    ],
    experience: [
      {
        role: "Project Leader",
        company: "InFiNet Code",
        period: "2026 – Nu",
        bullets: [
          "Leder agila arbetssätt, sprintplanering och retrospektiv",
          "Bryggar tekniska team med intressenter",
          "Hanterar riskminimering vid kritiska deployments",
        ],
      },
      {
        role: "Full-Stack Developer",
        company: "Devotion Ventures",
        period: "2026 – Nu",
        bullets: [
          "Designar skalbara end-to-end-applikationer",
          "Refaktoriserar legacy-kodbaser till modern standard",
          "Implementerar enhetstester och CI/CD-förbättringar",
        ],
      },
      {
        role: "CEO & Founder",
        company: "HB Luxury Auto Detailing",
        period: "2021 – 2024",
        bullets: [
          "Grundade och skalade ett lönsamt premiumföretag",
          "Ansvarade för strategi, drift och kundrelationer",
        ],
      },
      {
        role: "Machine Operator & Team Leader",
        company: "Volvo Cars",
        period: "2018 – Nu",
        bullets: [
          "Säkerställer produktionskvalitet i automatiserad tillverkning",
          "Leder team i högvolymsproduktion",
          "Driver kontinuerlig processförbättring",
        ],
      },
      {
        role: "Board Deputy Member",
        company: "Casa Domini AB",
        period: "2018 – Nu",
        bullets: [
          "Stödjer strategisk styrning och beslutsfattande",
          "Hanterar organisationens webbplats och IT-support",
        ],
      },
    ],
    education: {
      school: "NBI Handelsakademin",
      program: ".NET System Development",
      courses: [
        "Avancerad C# & OOP",
        "SQL & Relationell Databasdesign",
        "ASP.NET Core & Webbutveckling",
        "Clean Code, SOLID, Agila arbetssätt",
      ],
    },
    references: [
      {
        name: "Nemanja Milosavljevic",
        role: "Owner & IT Consultant",
        company: "InFiNet Code AB",
        quote:
          "Exceptionellt problemlösande tänkesätt och en disciplinerad approach som gör verklig skillnad i teamet.",
      },
      {
        name: "Rajan Mahdavi",
        role: "Project Manager",
        company: "Volvo Group",
        quote:
          "Enastående ledarskap och förmåga att koordinera team i pressade produktionssituationer.",
      },
      {
        name: "Arian Alikashani",
        role: "Backend Developer",
        company: "Norion Bank",
        quote:
          "En snabb inlärare som skriver ren, underhållbar backend-kod. En trygghet att ha i teamet.",
      },
    ],
    ui: {
      nav: {
        about: "Om mig",
        journey: "Resa",
        projects: "Projekt",
        skills: "Skills",
        experience: "Erfarenhet",
        contact: "Kontakt",
        cta: "Kontakta",
      },
      hero: {
        followJourney: "Följ resan",
        seeProjects: "Se projekt",
        scroll: "Scroll",
      },
      about: {
        section: "01 · Om mig",
        title1: "Om",
        title2: "mig",
        headline: "Jag började inte i koden. Jag började på fabriksgolvet.",
        p1: "I flera år körde jag maskiner på Volvo Cars — precision, tempo och ägarskap. Där formades disciplinen. Sedan byggde jag HB Luxury Auto Detailing från noll och lärde mig sälja, leverera och bry mig om varje detalj.",
        p2: "Idag skriver jag C# och .NET med samma hantverk — Clean Architecture, SOLID, tester man kan lita på. React på frontend när projektet kräver det. Jag bryr mig om kod som åldras väl, inte kod som skeppas snabbt och ruttnar.",
        p3: "Jag söker ett team där jag kan bidra från dag ett, fortsätta lära mig i högt tempo, och bygga saker som betyder något.",
        basedIn: "Bor i",
        focus: "Fokus",
        focusValue: "C# / .NET · Fullstack",
        seeking: "Söker",
        seekingValue: ".NET / Fullstack-roller",
      },
      journey: {
        chapter: "Kapitel",
        hint: "Resan · Scrolla",
      },
      skills: {
        section: "02 · Skills",
        title1: "Verktyg &",
        title2: "tänkesätt",
        description:
          "Från Clean Architecture till Docker — en stack byggd för långsiktig underhållbarhet, inte snabba genvägar.",
        learning: "Just nu → Lär mig",
      },
      projects: {
        section: "03 · Projekt",
        title1: "Utvalda",
        title2: "arbeten",
        description:
          "Tio projekt som representerar min resa in i .NET, React och fullstack-arkitektur. Kod, koncept och ambition.",
        allRepos: "Alla repos på GitHub",
        live: "LIVE",
      },
      experience: {
        section: "04 · Erfarenhet",
        title1: "Vart jag",
        title2: "har varit",
        educationLabel: "Utbildning",
      },
      references: {
        section: "05 · Referenser",
        title1: "Vad andra",
        title2: "säger",
      },
      contact: {
        section: "06 · Kontakt",
        title1: "Låt oss",
        title2: "bygga något.",
        description:
          "Öppen för fullstack- och .NET-roller. Bor i Göteborg, redo att flytta för rätt team. Skriv gärna — jag svarar alltid.",
        mailMe: "Maila mig",
        downloadCv: "Ladda ner CV",
        bookCall: "Boka 15-min samtal",
        bookCallHint: "via Cal.com",
        email: "E-post",
        phone: "Telefon",
        location: "Plats",
        github: "GitHub",
        linkedin: "LinkedIn",
        languages: "Språk",
        footer: "Byggd med Next.js & omtanke.",
        version: "v2 · Göteborg",
      },
      common: {
        now: "Nu",
      },
    },
  },
};

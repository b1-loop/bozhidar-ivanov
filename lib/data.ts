export const personal = {
  name: "Bozhidar Ivanov",
  role: "Fullstack Developer",
  tagline: "Byggd av disciplin. Formad av kod.",
  location: "Göteborg, Sverige",
  age: 27,
  email: "bojidarivanov98@gmail.com",
  phone: "0762 20 80 52",
  github: "https://github.com/b1-loop",
  linkedin: "https://www.linkedin.com/in/bozhidar-ivanov-48158637b",
  cv: "/cv.pdf",
  bio: "En disciplinerad mjukvaruingenjör som kombinerar ledarskap från industriella miljöer med modern .NET-utveckling. Jag byggde min bana från Volvo Cars och ett eget premiumföretag inom bildetaljering till att specialisera mig på C# och .NET backend med Clean Architecture.",
  status: "Öppen för LIA och juniora fullstack/.NET-roller",
  languages: [
    { name: "Bulgariska", level: "Modersmål" },
    { name: "Svenska", level: "Flytande" },
    { name: "Engelska", level: "Flytande" },
  ],
} as const;

export type JourneyChapter = {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
};

export const journey: JourneyChapter[] = [
  {
    id: "factory",
    year: "2018",
    title: "Fabriksgolvet",
    subtitle: "Volvo Cars — Machine Operator & Team Leader",
    description:
      "Precision, tempo och ansvar. På Volvo lärde jag mig att kvalitet inte är en åsikt — det är en process. Ledarskap i högvolymsproduktion formade min disciplin.",
    accent: "#8a8f98",
  },
  {
    id: "founder",
    year: "2021",
    title: "Entreprenören",
    subtitle: "HB Luxury Auto Detailing — CEO & Founder",
    description:
      "Grundade och skalade ett premiumföretag inom bildetaljering. Strategi, drift, kundrelationer — och en obsession för detalj som fortfarande sitter i varje rad kod.",
    accent: "#c9a15b",
  },
  {
    id: "developer",
    year: "2024",
    title: "Utvecklaren",
    subtitle: "NBI Handelsakademin — .NET System Development",
    description:
      "Bytte overallen mot en editor. Fördjupade mig i C#, .NET, Clean Architecture och SOLID. Byggde 10+ projekt — från Blazor-appar med OpenAI till fullstack-plattformar med React.",
    accent: "#7dd3fc",
  },
  {
    id: "now",
    year: "Nu",
    title: "Nästa kapitel",
    subtitle: "Fullstack Developer — Öppen för LIA & juniora roller",
    description:
      "Idag leder jag projekt på InFiNet Code och bygger fullstack-lösningar på Devotion Ventures. Nästa steg: LIA eller ett team där jag kan bidra från dag ett.",
    accent: "#a78bfa",
  },
];

export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
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
];

export const learning = ["Kubernetes", "gRPC", "Domain-Driven Design", "Microservices"];

export type Project = {
  name: string;
  type: string;
  description: string;
  stack: string[];
  github: string;
  demo?: string;
  live?: boolean;
};

export const projects: Project[] = [
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
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
};

export const experience: Experience[] = [
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
];

export const education = {
  school: "NBI Handelsakademin",
  program: ".NET System Development",
  courses: [
    "Avancerad C# & OOP",
    "SQL & Relationell Databasdesign",
    "ASP.NET Core & Webbutveckling",
    "Clean Code, SOLID, Agila arbetssätt",
  ],
};

export type Reference = {
  name: string;
  role: string;
  company: string;
  quote: string;
};

export const references: Reference[] = [
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
];

import type { Locale } from "./content";

export type BotLink = { label: string; href: string; external?: boolean };

export type BotTopic = {
  id: string;
  /** Chip label — phrased as the visitor's question */
  question: string;
  answer: string;
  links?: BotLink[];
  /** Lower-case keywords used to match free-text questions */
  keywords: string[];
};

export type BotCopy = {
  name: string;
  status: string;
  hoverHint: string;
  nudge: string;
  openLabel: string;
  closeLabel: string;
  inputPlaceholder: string;
  send: string;
  disclaimer: string;
  greeting: string;
  fallback: string;
  topics: BotTopic[];
};

const JARVIS = "https://github.com/b1-loop/jarvis-desktop";
const CAL = "https://cal.com/bojidarivanov-98-mkhv6b";
const MAIL = "mailto:bojidarivanov98@gmail.com";

export const botCopy: Record<Locale, BotCopy> = {
  en: {
    name: "B1",
    status: "Bozhidar's AI sidekick",
    hoverHint: "Ask me anything 👋",
    nudge: "Psst — I know what Bozhidar can do with AI",
    openLabel: "Open AI assistant",
    closeLabel: "Close assistant",
    inputPlaceholder: "Ask about AI, agents, projects…",
    send: "Send",
    disclaimer: "Quick answers · scripted demo",
    greeting:
      "Hi! I'm B1 🤖 Bozhidar is a fullstack developer who also builds AI agents. He wires LLMs up to real tools, runs models locally, and builds voice assistants. He uses AI agents every day to ship faster. What do you want to know?",
    fallback:
      "Good question! I'm a small scripted bot, so I don't have an answer for that one. Bozhidar would love to explain it himself, though. Try one of the questions below or get in touch.",
    topics: [
      {
        id: "ai",
        question: "What can he do with AI?",
        answer:
          "Quite a lot:\n• LLM agents with tool calling: the model decides which tool to run and then acts on it\n• Local LLMs via Ollama, so no cloud and no data leaving the machine\n• Voice pipelines with wake word, Whisper speech-to-text and barge-in\n• OpenAI API integrations in .NET/Blazor apps\n• Prompt design and structured outputs\n• AI-assisted development with coding agents as part of his daily workflow",
        keywords: ["ai", "llm", "skill", "can", "kan", "know", "gpt", "machine", "ml", "openai", "prompt"],
      },
      {
        id: "agents",
        question: "Has he built AI agents?",
        answer:
          "Yes! His flagship is Jarvis Desktop, a voice-controlled AI agent for Windows. A local LLM runs an agent loop with 63 tools: it opens apps, controls the system and searches files. Python orchestrates and C++ handles the heavy lifting through pybind11. No cloud required.",
        links: [{ label: "Jarvis on GitHub", href: JARVIS, external: true }],
        keywords: ["agent", "agents", "tool", "tools", "built", "build", "autonom"],
      },
      {
        id: "jarvis",
        question: "Tell me about Jarvis",
        answer:
          "Jarvis Desktop in short:\n• Wake word → Whisper speech-to-text → LLM agent → text-to-speech\n• Barge-in: you can interrupt it mid-sentence\n• 63 tools the agent can call\n• Ollama + ONNX Runtime, so everything runs locally\n• Python 3.12 + C++20, with a Dear ImGui overlay\nThere's a demo video in the Projects section.",
        links: [
          { label: "See the project", href: "#projects" },
          { label: "Source code", href: JARVIS, external: true },
        ],
        keywords: ["jarvis", "voice", "röst", "whisper", "ollama", "speech", "assistant"],
      },
      {
        id: "workflow",
        question: "How does he use AI at work?",
        answer:
          "He treats AI as a teammate, not a crutch. He uses coding agents for scaffolding, refactors and reviews, and keeps the architecture decisions to himself (Clean Architecture, SOLID, tests). The result is faster delivery without losing quality.",
        keywords: ["workflow", "work", "daily", "copilot", "claude", "cursor", "productive", "jobb"],
      },
      {
        id: "stack",
        question: "What else is in his stack?",
        answer:
          "His core is C#/.NET 8 with ASP.NET Core, Clean Architecture and CQRS, plus React, Next.js and Blazor on the frontend, and SQL Server, EF Core, Docker and Azure. AI sits on top of a solid fullstack foundation.",
        links: [{ label: "All skills", href: "#skills" }],
        keywords: ["stack", "dotnet", ".net", "c#", "react", "next", "backend", "frontend", "tech"],
      },
      {
        id: "contact",
        question: "How do I reach him?",
        answer:
          "Easiest is to book a short call or send an email. He's open to .NET, fullstack and AI-related roles.",
        links: [
          { label: "Book a call", href: CAL, external: true },
          { label: "Email", href: MAIL },
        ],
        keywords: ["contact", "kontakt", "hire", "email", "mail", "call", "reach", "job", "role", "available"],
      },
    ],
  },
  sv: {
    name: "B1",
    status: "Bozhidars AI-assistent",
    hoverHint: "Fråga mig något 👋",
    nudge: "Psst — jag vet vad Bozhidar kan med AI",
    openLabel: "Öppna AI-assistenten",
    closeLabel: "Stäng assistenten",
    inputPlaceholder: "Fråga om AI, agenter, projekt…",
    send: "Skicka",
    disclaimer: "Snabbsvar · scriptad demo",
    greeting:
      "Hej! Jag är B1 🤖 Bozhidar är fullstackutvecklare och bygger även AI-agenter. Han kopplar LLM:er till riktiga verktyg, kör modeller lokalt och bygger röstassistenter. Han använder AI-agenter varje dag för att leverera snabbare. Vad vill du veta?",
    fallback:
      "Bra fråga! Jag är en liten scriptad bot och har inget svar på just den. Bozhidar berättar gärna själv. Testa en av frågorna nedan eller hör av dig till honom.",
    topics: [
      {
        id: "ai",
        question: "Vad kan han om AI?",
        answer:
          "En hel del:\n• LLM-agenter med tool calling: modellen väljer vilket verktyg den ska köra och agerar sedan\n• Lokala LLM:er via Ollama, så inget moln och ingen data som lämnar datorn\n• Röstflöden med väckord, Whisper (tal till text) och avbrott mitt i meningen\n• OpenAI API-integrationer i .NET/Blazor-appar\n• Promptdesign och strukturerade svar\n• AI-assisterad utveckling med kodagenter som en del av vardagen",
        keywords: ["ai", "llm", "kan", "kunskap", "skill", "gpt", "openai", "prompt", "maskin"],
      },
      {
        id: "agents",
        question: "Har han byggt AI-agenter?",
        answer:
          "Ja! Hans flaggskepp är Jarvis Desktop, en röststyrd AI-agent för Windows. En lokal LLM kör en agentloop med 63 verktyg: den öppnar appar, styr systemet och söker bland filer. Python dirigerar och C++ gör grovjobbet via pybind11. Helt utan moln.",
        links: [{ label: "Jarvis på GitHub", href: JARVIS, external: true }],
        keywords: ["agent", "agenter", "verktyg", "tool", "byggt", "bygga", "autonom"],
      },
      {
        id: "jarvis",
        question: "Berätta om Jarvis",
        answer:
          "Jarvis Desktop i korthet:\n• Väckord → Whisper (tal till text) → LLM-agent → tal\n• Du kan avbryta den mitt i en mening\n• 63 verktyg som agenten kan anropa\n• Ollama + ONNX Runtime, så allt körs lokalt\n• Python 3.12 + C++20, med ett overlay i Dear ImGui\nDet finns en demovideo under Projekt.",
        links: [
          { label: "Se projektet", href: "#projects" },
          { label: "Källkod", href: JARVIS, external: true },
        ],
        keywords: ["jarvis", "röst", "voice", "whisper", "ollama", "tal", "assistent"],
      },
      {
        id: "workflow",
        question: "Hur använder han AI i jobbet?",
        answer:
          "Han ser AI som en kollega, inte en krycka. Han använder kodagenter för scaffolding, refaktorering och kodgranskning, men arkitekturbesluten fattar han själv (Clean Architecture, SOLID, tester). Resultatet är snabbare leveranser utan att kvaliteten tappar.",
        keywords: ["jobb", "arbete", "vardag", "workflow", "copilot", "claude", "cursor", "produktiv"],
      },
      {
        id: "stack",
        question: "Vad mer kan han?",
        answer:
          "Kärnan är C#/.NET 8 med ASP.NET Core, Clean Architecture och CQRS, plus React, Next.js och Blazor på frontend, och SQL Server, EF Core, Docker och Azure. AI-delen står på en stabil fullstackgrund.",
        links: [{ label: "Alla kompetenser", href: "#skills" }],
        keywords: ["stack", "dotnet", ".net", "c#", "react", "next", "backend", "frontend", "teknik", "mer"],
      },
      {
        id: "contact",
        question: "Hur når jag honom?",
        answer:
          "Enklast är att boka ett kort samtal eller skicka ett mejl. Han är öppen för .NET-, fullstack- och AI-relaterade roller.",
        links: [
          { label: "Boka samtal", href: CAL, external: true },
          { label: "Mejla", href: MAIL },
        ],
        keywords: ["kontakt", "contact", "anställa", "mejl", "mail", "samtal", "nå", "jobb", "roll", "ledig"],
      },
    ],
  },
};

export function matchTopic(input: string, topics: BotTopic[]): BotTopic | null {
  const text = input.toLowerCase();
  const words = text.split(/[^\p{L}\p{N}.#+]+/u).filter(Boolean);
  let best: { topic: BotTopic; score: number } | null = null;
  for (const topic of topics) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (kw.length <= 3 ? words.includes(kw) : text.includes(kw)) score += kw.length > 3 ? 2 : 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  return best?.topic ?? null;
}

import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Journey } from "@/components/sections/journey";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { References } from "@/components/sections/references";
import { Contact } from "@/components/sections/contact";
import { AiBot } from "@/components/ai-bot";
import { BootIntro } from "@/components/boot-intro";
import { OffscreenPause } from "@/components/offscreen-pause";
import { FlightExperience } from "@/components/flight-experience";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <BootIntro />
      <Nav />
      <Hero />
      <Journey />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <References />
      <Contact />
      <AiBot />
      <OffscreenPause />
      <FlightExperience />
    </main>
  );
}

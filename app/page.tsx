import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Journey } from "@/components/sections/journey";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { References } from "@/components/sections/references";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Journey />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <References />
      <Contact />
    </main>
  );
}

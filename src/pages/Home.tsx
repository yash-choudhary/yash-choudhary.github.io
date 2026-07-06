import type { ComponentType } from "react";
import { useContent } from "../lib/content";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import SkillsEducation from "../components/SkillsEducation";
import Writing from "../components/Writing";
import NowPanel from "../components/NowPanel";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const SECTION_ORDER: {
  id: keyof ReturnType<typeof useContent>["config"]["sections"];
  Component: ComponentType<{ index: number }>;
}[] = [
  { id: "about", Component: About },
  { id: "experience", Component: Experience },
  { id: "projects", Component: Projects },
  { id: "skills", Component: SkillsEducation },
  { id: "writing", Component: Writing },
  { id: "now", Component: NowPanel },
  { id: "contact", Component: Contact },
];

export default function Home() {
  const { config } = useContent();
  const visible = SECTION_ORDER.filter(({ id }) => config.sections[id]);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        {visible.map(({ id, Component }, i) => (
          <Component key={id} index={i + 1} />
        ))}
      </main>
      <Footer />
    </>
  );
}

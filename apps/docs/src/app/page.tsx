import { Hero } from "@/components/landing/hero";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { ScrollMarquee } from "@/components/landing/scroll-marquee";
import { Playground } from "@/components/landing/playground";
import { HorizontalShowcase } from "@/components/landing/horizontal-showcase";
import { ComponentIndex } from "@/components/landing/component-index";
import { StickyStack } from "@/components/landing/sticky-stack";
import { Workflow } from "@/components/landing/workflow";
import { Stats } from "@/components/landing/stats";
import { CTA } from "@/components/landing/cta";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <main>
      <ScrollProgress />
      <Hero />
      <ScrollMarquee />
      <Playground />
      <HorizontalShowcase />
      <ComponentIndex />
      <StickyStack />
      <Stats />
      <Workflow />
      <CTA />
      <SiteFooter />
    </main>
  );
}

import {
  FeatureHighlights,
  FinalCallToAction,
  HowItWorksSection,
} from "./ContentSections";
import { HeroSection } from "./HeroSection";
import { HomeHeader } from "./HomeHeader";

export function HomePage() {
  return (
    <main className="overflow-x-clip bg-canvas">
      <HomeHeader />
      <HeroSection />
      <HowItWorksSection />
      <FeatureHighlights />
      <FinalCallToAction />
    </main>
  );
}

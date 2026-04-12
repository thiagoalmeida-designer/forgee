import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { EquipmentSection } from '../components/sections/EquipmentSection';
import { ProgramsSection } from '../components/sections/ProgramsSection';
import { PlansSection } from '../components/sections/PlansSection';
import { TeamSection } from '../components/sections/TeamSection';
import { FAQSection } from '../components/sections/FAQSection';
import { LocationSection } from '../components/sections/LocationSection';
import { CtaSection } from '../components/sections/CtaSection';

export function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <EquipmentSection />
      <ProgramsSection />
      <PlansSection />
      <TeamSection />
      <FAQSection />
      <LocationSection />
      <CtaSection />
    </>
  );
}

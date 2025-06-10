
'use client'
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { EducationSection } from '@/components/sections/education-section';
import { AchievementsSection } from '@/components/sections/achievements-section';
import { ContactSection } from '@/components/sections/contact-section';
import { OrbitalDivider } from '@/components/ui/orbital-divider';
import Loading from '@/app/loading';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <OrbitalDivider />
        <AboutSection />
        <OrbitalDivider />
        <ProjectsSection />
        <OrbitalDivider />
        <SkillsSection />
        <OrbitalDivider />
        <EducationSection />
        <OrbitalDivider />
        <AchievementsSection />
        <OrbitalDivider />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

import React from "react";
import { HeroSection } from "../components/sections/Hero";
import { StatsBar } from "../components/sections/StatsBar";
import { Header } from "../components/sections/Header";
import { FeatureCards } from "../components/sections/FeatureCards";
import { ProcessFlow } from "../components/sections/ProcessFlow";
import { Testimonials } from "../components/sections/Testimonials";
import { Pricing } from "../components/sections/Pricing";
import { Footer } from "../components/sections/Footer";



const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-primary/20 selection:text-primary flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <FeatureCards />
        <ProcessFlow />
        <Testimonials />
        <Pricing />
        <Footer />
      </main>
    </div>
  );
};

export default Home;
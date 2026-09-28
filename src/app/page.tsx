import CTA from "@/components/CTA";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import Pricing from "@/components/Pricing";
import Stats from "@/components/Stats";
import Workflows from "@/components/Workflows";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <Features />
      <Stats />
      <Workflows />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}

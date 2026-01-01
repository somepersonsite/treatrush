import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Bundles from "@/components/Bundles";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Events from "@/components/Events";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Loading onComplete={() => setIsLoading(false)} />}
      <div className={`min-h-screen bg-background ${isLoading ? "opacity-0" : "animate-fade-in"}`}>
        <Header />
        <Hero />
        <Features />
        <Bundles />
        <About />
        <HowItWorks />
        <Events />
        <Testimonials />
        <FAQ />
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default Index;

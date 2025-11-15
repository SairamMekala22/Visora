import PillNav from "@/components/PillNav";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import FeaturesStack from "@/components/landing/FeaturesStack";
import Reviews from "@/components/landing/Reviews";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PillNav
        items={navItems}
        activeHref="#home"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
      />
      <Hero />
      <Features />
      <FeaturesStack />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
};

export default Landing;

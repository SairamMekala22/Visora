import { Card } from "@/components/ui/card";
import { Type, Focus, Sparkles, User, Brain } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    icon: Type,
    title: "Adjustable Text & Layout",
    description: "Customize font sizes, spacing, and layouts to match your reading preferences."
  },
  {
    icon: Focus,
    title: "Focus Mode",
    description: "Minimize distractions with a clean, focused reading environment."
  },
  {
    icon: Sparkles,
    title: "Animation Reduction",
    description: "Reduce or eliminate animations that may cause discomfort."
  },
  {
    icon: User,
    title: "Personalized Profiles",
    description: "Save your settings and sync across all your devices seamlessly."
  },
  {
    icon: Brain,
    title: "AI-powered Content Simplification",
    description: "Simplify complex content with intelligent AI assistance."
  }
];

const Features = () => {
  return (
    <section id="features" className="container mx-auto px-6 py-24 md:py-32 bg-muted/30">
      <div className="space-y-12">
        <div className="text-center space-y-4 mb-20">
          <ScrollReveal
            containerClassName="text-center"
            textClassName="text-4xl md:text-[5rem] font-bold tracking-tight"
            baseOpacity={0.2}
            baseRotation={2}
            blurStrength={3}
          >
            Features
          </ScrollReveal>
          <ScrollReveal
            containerClassName="max-w-2xl mx-auto"
            textClassName="text-lg text-muted-foreground font-light"
            baseOpacity={0.3}
            baseRotation={1}
            blurStrength={2}
          >
            Powerful accessibility tools designed to adapt to your unique needs
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Features;

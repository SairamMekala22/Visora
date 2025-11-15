import { Card } from "@/components/ui/card";
import { Type, Focus, Sparkles, User, Brain } from "lucide-react";

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
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">Features</h2>
          <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Powerful accessibility tools designed to adapt to your unique needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 border-2 border-border hover:scale-105 transition-smooth bg-background"
            >
              <feature.icon className="w-12 h-12 mb-6 text-foreground" strokeWidth={1.5} />
              <h3 className="text-xl font-light mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-sm font-light text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

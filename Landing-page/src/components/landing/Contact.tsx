import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="container mx-auto px-6 py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Top Right - Eye/Vision Symbol */}
      <div className="absolute top-8 right-8 opacity-40 pointer-events-none text-black">
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Eye shape */}
          <ellipse cx="70" cy="70" rx="60" ry="35" stroke="currentColor" strokeWidth="5" />
          {/* Iris */}
          <circle cx="70" cy="70" r="20" stroke="currentColor" strokeWidth="5" />
          {/* Pupil */}
          <circle cx="70" cy="70" r="10" fill="currentColor" />
          {/* Eyelashes/rays */}
          <line x1="70" y1="30" x2="70" y2="20" stroke="currentColor" strokeWidth="4" />
          <line x1="100" y1="50" x2="108" y2="45" stroke="currentColor" strokeWidth="4" />
          <line x1="40" y1="50" x2="32" y2="45" stroke="currentColor" strokeWidth="4" />
          <line x1="100" y1="90" x2="108" y2="95" stroke="currentColor" strokeWidth="4" />
          <line x1="40" y1="90" x2="32" y2="95" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      {/* Bottom Left - Accessibility/Brain Symbol */}
      <div className="absolute bottom-8 left-8 opacity-40 pointer-events-none text-black">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Brain outline */}
          <path d="M40 30 Q30 30 30 40 Q30 50 35 55 Q30 60 30 70 Q30 80 40 85 Q40 90 50 90 L70 90 Q80 90 80 85 Q90 80 90 70 Q90 60 85 55 Q90 50 90 40 Q90 30 80 30 Q75 30 70 35 Q65 30 60 30 Q55 30 50 35 Q45 30 40 30 Z" 
                stroke="currentColor" strokeWidth="5" fill="none" />
          {/* Brain details */}
          <path d="M50 40 Q55 45 60 40" stroke="currentColor" strokeWidth="4" fill="none" />
          <path d="M65 45 Q70 50 75 45" stroke="currentColor" strokeWidth="4" fill="none" />
          <path d="M45 60 Q50 65 55 60" stroke="currentColor" strokeWidth="4" fill="none" />
          <path d="M65 65 Q70 70 75 65" stroke="currentColor" strokeWidth="4" fill="none" />
          {/* Accessibility symbol - person */}
          <circle cx="60" cy="55" r="6" stroke="currentColor" strokeWidth="4" fill="none" />
          <path d="M60 61 L60 75 M55 68 L65 68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-12">
          <ScrollReveal
            containerClassName="text-center"
            textClassName="text-4xl md:text-[5rem] font-bold tracking-tight"
            baseOpacity={0.2}
            baseRotation={2}
            blurStrength={3}
          >
            Contact Us
          </ScrollReveal>
          <ScrollReveal
            containerClassName="max-w-2xl mx-auto"
            textClassName="text-lg text-muted-foreground font-light"
            baseOpacity={0.3}
            baseRotation={1}
            blurStrength={2}
          >
            Have questions? We'd love to hear from you.
          </ScrollReveal>
        </div>
        
        <Card className="p-8 border-2 border-border shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.2)] transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-light text-muted-foreground">
                Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-2"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-light text-muted-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-2"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-light text-muted-foreground">
                Message
              </label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="border-2 min-h-[150px]"
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full py-6 bg-primary hover:bg-charcoal transition-smooth border-2 border-primary"
              size="lg"
            >
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default Contact;

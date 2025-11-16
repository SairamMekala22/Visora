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
      {/* Decorative Circles */}
      <div className="absolute top-20 left-10 w-32 h-32 border-4 border-black rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 border-4 border-black rounded-full opacity-70"></div>
      <div className="absolute bottom-32 left-1/4 w-20 h-20 border-4 border-black rounded-full opacity-65"></div>
      <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-black rounded-full opacity-50"></div>
      
      {/* Decorative Stars */}
      <div className="absolute top-32 right-10 opacity-70">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 0L36.18 23.82L60 30L36.18 36.18L30 60L23.82 36.18L0 30L23.82 23.82L30 0Z" fill="black"/>
        </svg>
      </div>
      <div className="absolute bottom-40 left-16 opacity-60">
        <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 0L36.18 23.82L60 30L36.18 36.18L30 60L23.82 36.18L0 30L23.82 23.82L30 0Z" fill="black"/>
        </svg>
      </div>
      <div className="absolute top-1/2 left-8 opacity-65">
        <svg width="50" height="50" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 0L36.18 23.82L60 30L36.18 36.18L30 60L23.82 36.18L0 30L23.82 23.82L30 0Z" fill="black"/>
        </svg>
      </div>
      <div className="absolute bottom-1/4 right-12 opacity-55">
        <svg width="35" height="35" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 0L36.18 23.82L60 30L36.18 36.18L30 60L23.82 36.18L0 30L23.82 23.82L30 0Z" fill="black"/>
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
        
        <Card className="p-10 md:p-12 border-4 border-black shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.3)] transition-shadow duration-300 bg-white">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="name" className="text-base font-bold text-black block">
                Name
              </label>
              <div className="bg-gray-100 p-1 rounded-lg border-2 border-gray-200 focus-within:border-black focus-within:bg-white transition-all duration-200">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-0 text-base py-6 px-4 bg-transparent focus:ring-0 focus:outline-none"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label htmlFor="email" className="text-base font-bold text-black block">
                Email
              </label>
              <div className="bg-gray-100 p-1 rounded-lg border-2 border-gray-200 focus-within:border-black focus-within:bg-white transition-all duration-200">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-0 text-base py-6 px-4 bg-transparent focus:ring-0 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label htmlFor="message" className="text-base font-bold text-black block">
                Message
              </label>
              <div className="bg-gray-100 p-1 rounded-lg border-2 border-gray-200 focus-within:border-black focus-within:bg-white transition-all duration-200">
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="border-0 min-h-[180px] text-base py-4 px-4 bg-transparent focus:ring-0 focus:outline-none resize-none"
                  placeholder="Write your message here..."
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full py-7 text-lg font-bold bg-black text-white hover:bg-gray-800 transition-all duration-300 border-3 border-black shadow-lg hover:shadow-xl"
              size="lg"
            >
              Send Message
            </Button>
          </form>
        </Card>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        #contact svg:nth-child(1) {
          animation: rotate 20s linear infinite;
        }

        #contact svg:nth-child(2) {
          animation: float 6s ease-in-out infinite;
        }

        #contact svg:nth-child(3) {
          animation: rotate 15s linear infinite reverse;
        }

        #contact svg:nth-child(4) {
          animation: float 8s ease-in-out infinite;
        }

        #contact .rounded-full:nth-child(2) {
          animation: float 7s ease-in-out infinite;
        }

        #contact .rounded-full:nth-child(3) {
          animation: float 9s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Contact;

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleDownloadClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/download');
    }, 800);
  };

  return (
    <section id="home" className="container mx-auto px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-12 items-center">
        <div className="space-y-8 animate-fade-in text-center">
          <h1 className="text-6xl md:text-[15rem] font-extrabold tracking-tight leading-none">
            Visora.
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-muted-foreground leading-relaxed">
            Visora is an AI-powered accessibility tool designed for people with
            Dyslexia, ADHD, and Autism, offering personalized fonts, calming
            modes, distraction-free reading, and smart assistance to make every
            webpage easier to understand and more comfortable to use.
          </p>
          <Button
            size="lg"
            onClick={handleDownloadClick}
            disabled={isAnimating}
            className={`bg-black text-white rounded-full p-0 pr-12 border-[3px] border-black inline-flex items-center gap-4 mx-auto hover:bg-gray-900 transition-all duration-300 overflow-hidden relative ${
              isAnimating ? 'pr-0' : ''
            }`}
          >
            <span
              className={`px-5 py-3 bg-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isAnimating ? 'translate-x-[280px]' : 'translate-x-0'
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14m0 0l-7-7m7 7l-7 7"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              className={`font-semibold text-base transition-opacity duration-300 whitespace-nowrap ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
            >
              Download Extension
            </span>
          </Button>
        </div>
        <div className="relative h-[400px] md:h-[500px] animate-scale-in">
          <div className="absolute inset-0 border-2 border-border rounded-lg bg-gradient-to-br from-muted to-background overflow-hidden">
            <img
              src="/image.png"
              alt="Visora Demo"
              className="w-full h-full object-fill"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
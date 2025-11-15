import { Button } from "@/components/ui/button";

const Hero = () => {
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
            className="bg-[#0f1724] text-white rounded-full px-6 py-3 border-2 border-black inline-flex items-center gap-4 mx-auto hover:opacity-90 transition"
          >
            <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle cx="6" cy="12" r="1.6" fill="#6B7280" />
                <circle cx="12" cy="12" r="1.6" fill="#6B7280" />
                <circle cx="18" cy="12" r="1.6" fill="#6B7280" />
              </svg>
            </span>
            <span className="font-medium">Download Extension</span>
          </Button>
        </div>
        <div className="relative h-[400px] md:h-[500px] animate-scale-in">
          <div className="absolute inset-0 border-2 border-border rounded-lg bg-gradient-to-br from-muted to-background flex items-center justify-center">
            <img
              src="/placeholder.svg"
              alt="Illustration"
              className="w-full h-full max-w-md object-contain p-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

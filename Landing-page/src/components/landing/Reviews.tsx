import { Card } from "@/components/ui/card";
import ScrollReveal from "@/components/ScrollReveal";

const reviews = [
  {
    quote: "Visora genuinely makes reading easier for me. The dyslexia-friendly font and calm mode really help me stay focused longer. I wish the extension loaded a bit faster, but overall it's been a big relief.",
    author: "Aisha M."
  },
  {
    quote: "As someone with ADHD, the distraction-removal feature is a lifesaver. Pages feel clean and much easier to process. The summarizer is good but sometimes misses context.",
    author: "Rahul S"
  },
  {
    quote: "The read-aloud feature is amazing! I use it every day for articles and assignments. Some websites still override the styling, but it's improving.",
    author: "Emily R"
  },
  {
    quote: "I like how Visora simplifies web pages and highlights key points. It's not perfect yet, but it definitely helps me absorb information faster.",
    author: "Sarah Mitchell"
  },
  {
    quote: "The AI summaries are useful when I'm short on time. The only issue is occasional phrasing errors, but the convenience outweighs that.",
    author: "Harish K"
  },
  {
    quote: "The focus mode is a game-changer. I can finally browse without feeling overwhelmed by distractions.",
    author: "Meera L"
  },
  {
    quote: "Visora has completely transformed how I browse the web. The customization options are exactly what I needed.",
    author: "Priya C"
  },
  {
    quote: "As someone with dyslexia, the text adjustment features have made reading online so much easier. Highly recommend.",
    author: "James Chen"
  },
  {
    quote: "The focus mode is a game-changer. I can finally browse without feeling overwhelmed by distractions.",
    author: "Maria Rodriguez"
  }
];

const Reviews = () => {
  // Create snake pattern: row1 left-to-right, row2 right-to-left, row3 left-to-right
  const row1 = reviews.slice(0, 3); // Cards 0, 1, 2
  const row2 = reviews.slice(3, 6).reverse(); // Cards 5, 4, 3 (reversed)
  const row3 = reviews.slice(6, 9); // Cards 6, 7, 8

  const snakePattern = [...row1, ...row2, ...row3];

  return (
    <section id="reviews" className="container mx-auto px-6 py-24 md:py-32 overflow-hidden">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <ScrollReveal
            containerClassName="text-center"
            textClassName="text-4xl md:text-[5rem] font-bold tracking-tight"
            baseOpacity={0.2}
            baseRotation={2}
            blurStrength={3}
          >
            Reviews
          </ScrollReveal>
          <ScrollReveal
            containerClassName="max-w-2xl mx-auto"
            textClassName="text-lg text-muted-foreground font-light"
            baseOpacity={0.3}
            baseRotation={1}
            blurStrength={2}
          >
            What our users are saying
          </ScrollReveal>
        </div>
        
        <div className="mt-12 relative">
          {/* Row 1 - Left to Right */}
          <div className="flex gap-6 mb-6 animate-scroll-right">
            {[...row1, ...row1, ...row1].map((review, index) => (
              <Card 
                key={`row1-${index}`}
                className="p-8 border-2 border-border hover:scale-105 transition-transform duration-300 flex-shrink-0 w-[350px]"
              >
                <blockquote className="space-y-6">
                  <p className="text-lg font-semibold leading-relaxed italic" style={{ color: '#000000' }}>
                    "{review.quote}"
                  </p>
                  <footer className="text-sm font-bold" style={{ color: '#000000' }}>
                    — {review.author}
                  </footer>
                </blockquote>
              </Card>
            ))}
          </div>

          {/* Row 2 - Right to Left (reversed cards) */}
          <div className="flex gap-6 mb-6 animate-scroll-left">
            {[...row2, ...row2, ...row2].map((review, index) => (
              <Card 
                key={`row2-${index}`}
                className="p-8 border-2 border-border hover:scale-105 transition-transform duration-300 flex-shrink-0 w-[350px]"
              >
                <blockquote className="space-y-6">
                  <p className="text-lg font-semibold leading-relaxed italic" style={{ color: '#000000' }}>
                    "{review.quote}"
                  </p>
                  <footer className="text-sm font-bold" style={{ color: '#000000' }}>
                    — {review.author}
                  </footer>
                </blockquote>
              </Card>
            ))}
          </div>

          {/* Row 3 - Left to Right */}
          <div className="flex gap-6 animate-scroll-right">
            {[...row3, ...row3, ...row3].map((review, index) => (
              <Card 
                key={`row3-${index}`}
                className="p-8 border-2 border-border hover:scale-105 transition-transform duration-300 flex-shrink-0 w-[350px]"
              >
                <blockquote className="space-y-6">
                  <p className="text-lg font-semibold leading-relaxed italic" style={{ color: '#000000' }}>
                    "{review.quote}"
                  </p>
                  <footer className="text-sm font-bold" style={{ color: '#000000' }}>
                    — {review.author}
                  </footer>
                </blockquote>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-350px * 3 - 48px));
          }
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(calc(-350px * 3 - 48px));
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-right {
          animation: scroll-right 25s linear infinite;
        }

        .animate-scroll-left {
          animation: scroll-left 25s linear infinite;
        }

        .animate-scroll-right:hover,
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Reviews;

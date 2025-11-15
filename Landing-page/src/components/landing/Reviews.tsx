import { Card } from "@/components/ui/card";

const reviews = [
  {
    quote: "Visora has completely transformed how I browse the web. The customization options are exactly what I needed.",
    author: "Sarah Mitchell"
  },
  {
    quote: "As someone with dyslexia, the text adjustment features have made reading online so much easier. Highly recommend.",
    author: "James Chen"
  },
  {
    quote: "The focus mode is a game-changer. I can finally browse without feeling overwhelmed by distractions.",
    author: "Maria Rodriguez"
  },
  {
    quote: "Visora has completely transformed how I browse the web. The customization options are exactly what I needed.",
    author: "Sarah Mitchell"
  },
  {
    quote: "As someone with dyslexia, the text adjustment features have made reading online so much easier. Highly recommend.",
    author: "James Chen"
  },
  {
    quote: "The focus mode is a game-changer. I can finally browse without feeling overwhelmed by distractions.",
    author: "Maria Rodriguez"
  },
  {
    quote: "Visora has completely transformed how I browse the web. The customization options are exactly what I needed.",
    author: "Sarah Mitchell"
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
  return (
    <section id="reviews" className="container mx-auto px-6 py-24 md:py-32">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">Reviews</h2>
          <p className="text-lg text-muted-foreground font-light">
            What our users are saying
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {reviews.map((review, index) => (
            <Card 
              key={index}
              className="p-8 border-2 border-border hover:scale-105 transition-smooth"
            >
              <blockquote className="space-y-6">
                <p className="text-lg font-light leading-relaxed italic text-muted-foreground">
                  "{review.quote}"
                </p>
                <footer className="text-sm font-light text-foreground">
                  — {review.author}
                </footer>
              </blockquote>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;

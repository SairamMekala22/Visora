import SimpleScrollStack, { SimpleScrollStackItem } from "@/components/SimpleScrollStack";
import { Type, Focus, Sparkles, User } from "lucide-react";

const features = [
  {
    icon: Type,
    title: "User data sync",
    description: "User Data Sync securely stores and synchronizes each user’s accessibility preferences across devices. It ensures a consistent, personalized Visora experience every time they browse the web..",
    gradient: "from-blue-50 to-indigo-50"
  },
  {
    icon: Sparkles,
    title: "Hands-Free Control",
    description: "Hands-Free Control enables users to navigate and interact with the web using simple voice commands. It offers an effortless, accessible browsing experience without relying on manual input.",
    gradient: "from-pink-50 to-rose-50"
  },
  {
    icon: User,
    title: "Intelligent Content Summarizer",
    description: "The Intelligent Content Summarizer distills lengthy or complex web content into clear, concise insights. It helps users understand key information quickly, enhancing focus and reducing cognitive load.",
    gradient: "from-green-50 to-emerald-50"
  },
  {
    icon: Focus,
    title: "Natural Speech Processor",
    description: "The Natural Speech Processor converts selected on-screen text into clear, natural audio playback. It enhances comprehension and accessibility by allowing users to listen to content effortlessly.”",
    gradient: "from-purple-50 to-pink-50"
  }
];

const FeaturesStack = () => {
  const maxCards = 4;
  
  return (
    <section className="w-full bg-muted/30 py-20">
      <SimpleScrollStack className="max-w-4xl mx-auto px-4">
        {features
          .filter((_, index) => index < maxCards)
          .map((feature, index) => (
            <SimpleScrollStackItem
              key={index}
              itemClassName="bg-white border-2 border-border rounded-[32px] p-8 md:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_50px_rgba(0,0,0,0.12)] transition-shadow duration-300"
              style={{ marginBottom: index < maxCards - 1 ? '80vh' : '40vh' }}
            >
              <div className="flex flex-col space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm">
                  <feature.icon className="w-10 h-10 text-foreground" strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    {feature.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground/60">
                  <span className="w-8 h-[2px] bg-muted-foreground/20 rounded-full" />
                  {/* <span>Feature {index + 1} of {maxCards}</span> */}
                </div>
              </div>
            </SimpleScrollStackItem>
          ))}
      </SimpleScrollStack>
    </section>
  );
};

export default FeaturesStack;

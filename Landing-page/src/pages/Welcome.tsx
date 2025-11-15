import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-12 border-2 border-border animate-fade-in">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Are you differently abled?
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/disability")}
              className="text-lg py-6 px-12 border-2 hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              Yes
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/landing")}
              className="text-lg py-6 px-12 border-2 hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              No
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Welcome;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Disability = () => {
  const navigate = useNavigate();
  const [condition, setCondition] = useState("");
  const [autoAdjust, setAutoAdjust] = useState("");

  const handleContinue = () => {
    if (condition && autoAdjust) {
      navigate("/landing");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-2xl p-12 border-2 border-border animate-fade-in">
          <div className="space-y-8">
            <h2 className="text-3xl font-light text-center tracking-tight">
              Help us personalize your experience
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-light text-muted-foreground">
                  Select your condition
                </label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="w-full border-2">
                    <SelectValue placeholder="Choose a condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autism">Autism</SelectItem>
                    <SelectItem value="dyslexia">Dyslexia</SelectItem>
                    <SelectItem value="adhd">ADHD</SelectItem>
                    <SelectItem value="low-vision">Low Vision</SelectItem>
                    <SelectItem value="motor-impairment">Motor Impairment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-light text-muted-foreground">
                  Do you want auto-adjust settings?
                </label>
                <Select value={autoAdjust} onValueChange={setAutoAdjust}>
                  <SelectTrigger className="w-full border-2">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleContinue}
                disabled={!condition || !autoAdjust}
                className="w-full mt-8 py-6 border-2 bg-primary hover:bg-charcoal transition-smooth"
                size="lg"
              >
                Continue
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Disability;

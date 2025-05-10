
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Car, Users, Navigation, Calendar } from "lucide-react";
import { toast } from "sonner";

const questions = [
  {
    id: "rental-days",
    label: "For how many days do you need the car?",
    options: [
      { value: "1-2", label: "1-2 days" },
      { value: "3-7", label: "3-7 days" },
      { value: "8-14", label: "8-14 days" },
      { value: "15+", label: "15+ days" }
    ]
  },
  {
    id: "passengers",
    label: "How many passengers will be traveling?",
    options: [
      { value: "1-2", label: "1-2 people" },
      { value: "3-4", label: "3-4 people" },
      { value: "5-7", label: "5-7 people" },
      { value: "8+", label: "8+ people" }
    ]
  },
  {
    id: "travel-distance",
    label: "How far do you plan to travel?",
    options: [
      { value: "city", label: "Around the city (< 50 miles/day)" },
      { value: "medium", label: "Medium distance (50-150 miles/day)" },
      { value: "long", label: "Long distance (150-300 miles/day)" },
      { value: "very-long", label: "Very long distance (300+ miles/day)" }
    ]
  }
];

const getCarRecommendation = (selections: Record<string, string>) => {
  
  const { "rental-days": rentalDays, passengers, "travel-distance": distance } = selections;
  
  let category = "Economy";
  if (passengers === "3-4") category = "Compact";
  else if (passengers === "5-7") category = "SUV";
  else if (passengers === "8+") category = "Van";
  
  if (distance === "long" || distance === "very-long") {
    if (category === "Economy") category = "Compact";
    else if (category === "Compact") category = "Midsize";
  }
  
  if (rentalDays === "8-14" || rentalDays === "15+") {
    if (category === "SUV") category = "Midsize"; 
  }
  
  return {
    category,
    explanation: [
      `Based on your group size of ${passengers.replace('-', ' to ')} people, we recommend a ${category} car.`,
      distance === "long" || distance === "very-long" 
        ? "Since you're planning a longer trip, we've suggested a car with good fuel efficiency and comfort." 
        : "For your shorter trips, this option provides a good balance of economy and comfort.",
      rentalDays === "8-14" || rentalDays === "15+" 
        ? "For longer rental periods, this option will be more cost-effective." 
        : "For your shorter rental period, this vehicle offers good value."
    ]
  };
};

interface CarRecommendationProps {
  onRecommendationComplete: (category: string) => void;
}

const CarRecommendation = ({ onRecommendationComplete }: CarRecommendationProps) => {
  const [step, setStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<{ 
    category: string; 
    explanation: string[];
  } | null>(null);
  
  const handleSelection = (questionId: string, value: string) => {
    setSelections(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleNext = () => {
    const currentQuestion = questions[step];
    if (!selections[currentQuestion.id]) {
      toast.error("Please select an option before continuing");
      return;
    }
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const result = getCarRecommendation(selections);
      setRecommendation(result);
    }
  };
  
  const handleStartQuiz = () => {
    setShowQuiz(true);
  };
  
  const handleUseRecommendation = () => {
    if (recommendation) {
      onRecommendationComplete(recommendation.category);
      setShowQuiz(false);
      setStep(0);
      setSelections({});
      setRecommendation(null);
      toast.success(`Filtering cars by ${recommendation.category}`);
    }
  };
  
  const handleReset = () => {
    setStep(0);
    setSelections({});
    setRecommendation(null);
  };
  
  const currentQuestion = questions[step];
  
  if (!showQuiz) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Not sure which car to choose?</CardTitle>
          <CardDescription>
            Answer a few questions and we'll help you find the perfect car for your needs
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleStartQuiz} className="bg-wheelteal-600 hover:bg-wheelteal-700 w-full">
            Find My Ideal Car
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (recommendation) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Personalized Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-wheelteal-600 text-lg py-1 px-3">
              {recommendation.category}
            </Badge>
            <span className="text-sm text-gray-500">is your ideal car type</span>
          </div>
          
          <div className="space-y-2 mb-4">
            {recommendation.explanation.map((text, i) => (
              <p key={i} className="text-sm text-gray-600">{text}</p>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center py-4">
            <div>
              <Users className="h-8 w-8 mx-auto text-gray-600 mb-2" />
              <p className="text-xs text-gray-500">
                {selections['passengers']} passengers
              </p>
            </div>
            <div>
              <Calendar className="h-8 w-8 mx-auto text-gray-600 mb-2" />
              <p className="text-xs text-gray-500">
                {selections['rental-days']} days
              </p>
            </div>
            <div>
              <Navigation className="h-8 w-8 mx-auto text-gray-600 mb-2" />
              <p className="text-xs text-gray-500">
                {selections['travel-distance'] === 'city' ? 'City driving' : 
                 selections['travel-distance'] === 'medium' ? 'Medium distance' :
                 selections['travel-distance'] === 'long' ? 'Long distance' : 'Very long distance'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Start Over
          </Button>
          <Button 
            className="bg-wheelteal-600 hover:bg-wheelteal-700" 
            onClick={handleUseRecommendation}
          >
            Show Recommended Cars
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Find Your Perfect Car</CardTitle>
        <CardDescription>
          Step {step + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium mb-2">{currentQuestion.label}</h3>
          <Select 
            value={selections[currentQuestion.id] || ''} 
            onValueChange={(value) => handleSelection(currentQuestion.id, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {currentQuestion.options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setShowQuiz(false)}>
            Cancel
          </Button>
        )}
        <Button 
          className="bg-wheelteal-600 hover:bg-wheelteal-700" 
          onClick={handleNext}
        >
          {step < questions.length - 1 ? "Next" : "See Recommendation"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarRecommendation;

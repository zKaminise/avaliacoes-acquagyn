
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEvaluation, ActivityType, RatingType } from "@/contexts/EvaluationContext";
import { cn } from "@/lib/utils";

interface ActivityRatingProps {
  activity: ActivityType;
}

export const ActivityRating = ({ activity }: ActivityRatingProps) => {
  const { activityRatings, setActivityRating } = useEvaluation();
  
  const currentRating = activityRatings.find(
    (rating) => rating.activityId === activity.id
  );

  const [observation, setObservation] = useState(currentRating?.observation || "");
  
  const ratings: RatingType[] = [
    "Não foi bem",
    "Melhorar",
    "Bom",
    "Muito bom",
    "Excelente"
  ];

  const handleRatingClick = (rating: RatingType) => {
    setActivityRating(activity.id, rating, observation);
  };

  const handleObservationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newObservation = e.target.value;
    setObservation(newObservation);
    
    if (currentRating) {
      setActivityRating(activity.id, currentRating.rating, newObservation);
    }
  };

  // Get the color for the rating buttons
  const getRatingColor = (rating: RatingType, isSelected: boolean) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const selectedClasses = "ring-2 ring-offset-1";
    
    if (isSelected) {
      switch(rating) {
        case "Não foi bem": return cn(baseClasses, selectedClasses, "bg-red-500 text-white");
        case "Melhorar": return cn(baseClasses, selectedClasses, "bg-orange-500 text-white");
        case "Bom": return cn(baseClasses, selectedClasses, "bg-yellow-500 text-white");
        case "Muito bom": return cn(baseClasses, selectedClasses, "bg-green-500 text-white");
        case "Excelente": return cn(baseClasses, selectedClasses, "bg-blue-500 text-white");
      }
    } else {
      switch(rating) {
        case "Não foi bem": return cn(baseClasses, "bg-red-100 text-red-700 hover:bg-red-200");
        case "Melhorar": return cn(baseClasses, "bg-orange-100 text-orange-700 hover:bg-orange-200");
        case "Bom": return cn(baseClasses, "bg-yellow-100 text-yellow-700 hover:bg-yellow-200");
        case "Muito bom": return cn(baseClasses, "bg-green-100 text-green-700 hover:bg-green-200");
        case "Excelente": return cn(baseClasses, "bg-blue-100 text-blue-700 hover:bg-blue-200");
      }
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">{activity.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{activity.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Avaliação</Label>
            <div className="flex flex-wrap gap-2">
              {ratings.map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={getRatingColor(
                    rating,
                    currentRating?.rating === rating
                  )}
                  onClick={() => handleRatingClick(rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`observation-${activity.id}`}>Observações (opcional)</Label>
            <Textarea
              id={`observation-${activity.id}`}
              value={observation}
              onChange={handleObservationChange}
              placeholder="Adicione observações específicas..."
              className="resize-none h-20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

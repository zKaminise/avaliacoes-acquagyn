
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { StudentForm } from "./StudentForm";
import { ActivityRating } from "./ActivityRating";
import { generatePDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";

export const EvaluationForm = () => {
  const { selectedLevel, activities, activityRatings, studentInfo, resetEvaluation } = useEvaluation();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!selectedLevel) {
    return null;
  }

  const levelActivities = activities[selectedLevel];

  const handleGeneratePDF = async () => {
    // Basic validation
    if (!studentInfo.name || !studentInfo.age || !studentInfo.class || !studentInfo.teacher) {
      toast.error("Por favor, preencha todos os dados do aluno.");
      return;
    }

    if (activityRatings.length < levelActivities.length) {
      toast.error("Por favor, avalie todas as atividades antes de gerar o PDF.");
      return;
    }

    setIsGeneratingPdf(true);
    try {
      await generatePDF(selectedLevel, studentInfo, activityRatings, activities);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleBackToLevels = () => {
    resetEvaluation();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-acqua-700">
          Avaliação - Nível {selectedLevel}
        </h2>
        <Button variant="outline" onClick={handleBackToLevels}>
          Voltar para níveis
        </Button>
      </div>

      <StudentForm />

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-acqua-700">Atividades para avaliação</h3>
        
        {levelActivities.map((activity) => (
          <ActivityRating key={activity.id} activity={activity} />
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleGeneratePDF}
          className="bg-acqua-500 hover:bg-acqua-600"
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? "Gerando PDF..." : "Gerar PDF"}
        </Button>
      </div>
    </div>
  );
};

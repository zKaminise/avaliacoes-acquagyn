import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEvaluation, LevelType } from "@/contexts/EvaluationContext";
import { Input } from "@/components/ui/input";
import { generateCertificate } from "@/utils/certificateGenerator";
import { toast } from "sonner";
import { Award } from "lucide-react";

export const CertificateForm = () => {
  const { studentInfo, selectedLevel } = useEvaluation();
  const [newLevel, setNewLevel] = useState<LevelType | "">("");
  const [teacherName, setTeacherName] = useState("");
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  
  // All available levels
  const levels: LevelType[] = [
    "Baby 1",
    "Baby 2",
    "Baby 3",
    "Adaptação",
    "Iniciação",
    "Aperfeiçoamento 1",
    "Aperfeiçoamento 2",
    "Aperfeiçoamento 3"
  ];

  // Filter levels that are "higher" than the current level
  const getNextLevels = () => {
    if (!selectedLevel) return [];
    
    const currentIndex = levels.indexOf(selectedLevel);
    if (currentIndex === -1 || currentIndex === levels.length - 1) return [];
    
    return levels.slice(currentIndex + 1);
  };
  
  const handleGenerateCertificate = async () => {
    if (!studentInfo.name) {
      toast.error("Por favor, preencha o nome do aluno.");
      return;
    }
    
    if (!selectedLevel) {
      toast.error("Nível atual não selecionado.");
      return;
    }
    
    if (!newLevel) {
      toast.error("Por favor, selecione o novo nível.");
      return;
    }
    
    if (!teacherName.trim()) {
      toast.error("Por favor, preencha o nome do professor.");
      return;
    }
    
    setIsGeneratingCertificate(true);
    try {
      await generateCertificate(
        studentInfo.name,
        selectedLevel,
        newLevel as LevelType,
        teacherName.trim()
      );
      toast.success("Certificado gerado com sucesso!");
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Erro ao gerar o certificado. Tente novamente.");
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  return (
    <Card className="mt-8 border-2 border-dashed border-acqua-300">
      <CardHeader className="bg-gradient-to-r from-acqua-50 to-blue-50">
        <CardTitle className="text-lg flex items-center gap-2 text-acqua-700">
          <Award className="h-5 w-5 text-acqua-500" />
          Gerar Certificado de Conclusão de Nível
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="student-name">Nome do aluno</Label>
            <Input
              id="student-name"
              value={studentInfo.name}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="current-level">Nível atual</Label>
            <Input 
              id="current-level" 
              value={selectedLevel || ""} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="teacher-name">Nome do professor</Label>
            <Input
              id="teacher-name"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Digite o nome do professor"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-level">Novo nível</Label>
            <Select value={newLevel} onValueChange={(value) => setNewLevel(value as LevelType)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o novo nível" />
              </SelectTrigger>
              <SelectContent>
                {getNextLevels().map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleGenerateCertificate}
            className="bg-gradient-to-r from-acqua-500 to-blue-500 hover:from-acqua-600 hover:to-blue-600"
            disabled={isGeneratingCertificate || !newLevel || !teacherName.trim()}
          >
            {isGeneratingCertificate ? "Gerando certificado..." : "Gerar Certificado"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
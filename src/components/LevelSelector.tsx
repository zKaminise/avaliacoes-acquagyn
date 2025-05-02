
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvaluation, LevelType } from "@/contexts/EvaluationContext";

export const LevelSelector = () => {
  const { setSelectedLevel } = useEvaluation();

  const levels: { id: LevelType; color: string }[] = [
    { id: "Baby", color: "bg-blue-100 hover:bg-blue-200 border-blue-300" },
    { id: "Adaptação", color: "bg-cyan-100 hover:bg-cyan-200 border-cyan-300" },
    { id: "Iniciação", color: "bg-teal-100 hover:bg-teal-200 border-teal-300" },
    { id: "Aprendizagem 1", color: "bg-green-100 hover:bg-green-200 border-green-300" },
    { id: "Aprendizagem 2", color: "bg-emerald-100 hover:bg-emerald-200 border-emerald-300" },
    { id: "Aprendizagem 3", color: "bg-acqua-100 hover:bg-acqua-200 border-acqua-300" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl text-acqua-700">
            Avaliação de Natação
          </CardTitle>
          <CardDescription className="text-center">
            Selecione o nível de avaliação do aluno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.map((level) => (
              <button
                key={level.id}
                className={`p-6 rounded-lg border-2 ${level.color} transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-acqua-500 focus:ring-opacity-50 ${level.id === "Baby" ? "relative pt-12" : ""}`}
                onClick={() => setSelectedLevel(level.id)}
              >
                {level.id === "Baby" && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <img 
                      src="/lovable-uploads/b010b562-710b-4584-ade3-716a6fba794f.png" 
                      alt="Star" 
                      className="h-16 w-16"
                    />
                  </div>
                )}
                <h3 className="text-lg font-medium text-gray-800">{level.id}</h3>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">
                    Clique para avaliar
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

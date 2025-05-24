import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvaluation, LevelType } from "@/contexts/EvaluationContext";
import { levelImages } from "@/utils/LevelImages";

export const LevelSelector = () => {
  const { setSelectedLevel } = useEvaluation();

  const levels: { id: LevelType; color: string }[] = [
    { 
      id: "Baby 1", 
      color: "bg-blue-100 hover:bg-blue-200 border-blue-300"
    },
    { 
      id: "Baby 2", 
      color: "bg-blue-200 hover:bg-blue-300 border-blue-400"
    },
    { 
      id: "Baby 3", 
      color: "bg-blue-300 hover:bg-blue-400 border-blue-500"
    },
    { 
      id: "Adaptação", 
      color: "bg-cyan-100 hover:bg-cyan-200 border-cyan-300" 
    },
    { 
      id: "Iniciação", 
      color: "bg-teal-100 hover:bg-teal-200 border-teal-300" 
    },
    { 
      id: "Aperfeiçoamento 1", 
      color: "bg-green-100 hover:bg-green-200 border-green-300"
    },
    { 
      id: "Aperfeiçoamento 2", 
      color: "bg-emerald-100 hover:bg-emerald-200 border-emerald-300"
    },
    { 
      id: "Aperfeiçoamento 3", 
      color: "bg-acqua-100 hover:bg-acqua-200 border-acqua-300"
    },
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
                className={`p-6 rounded-lg border-2 ${level.color} transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-acqua-500 focus:ring-opacity-50 relative pt-12`}
                onClick={() => setSelectedLevel(level.id)}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <img 
                    src={levelImages[level.id]} 
                    alt={level.id}
                    className="h-16 w-16"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-medium text-gray-800">{level.id}</h3>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      Clique para avaliar
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
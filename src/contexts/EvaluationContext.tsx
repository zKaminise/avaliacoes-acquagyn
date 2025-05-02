
import { createContext, useContext, useState, ReactNode } from "react";

export type LevelType = 
  "Baby" | 
  "Adaptação" | 
  "Iniciação" | 
  "Aprendizagem 1" | 
  "Aprendizagem 2" | 
  "Aprendizagem 3";

export type ActivityType = {
  id: string;
  name: string;
  description: string;
};

export type RatingType = 
  "Não foi bem" | 
  "Melhorar" | 
  "Bom" | 
  "Muito bom" | 
  "Excelente";

export type StudentInfoType = {
  name: string;
  age: string;
  class: string;
  teacher: string;
};

export type ActivityRatingType = {
  activityId: string;
  rating: RatingType;
  observation: string;
};

type EvaluationContextType = {
  selectedLevel: LevelType | null;
  studentInfo: StudentInfoType;
  activityRatings: ActivityRatingType[];
  setSelectedLevel: (level: LevelType | null) => void;
  setStudentInfo: (info: Partial<StudentInfoType>) => void;
  setActivityRating: (activityId: string, rating: RatingType, observation: string) => void;
  resetEvaluation: () => void;
  activities: Record<LevelType, ActivityType[]>;
};

const defaultStudentInfo = {
  name: "",
  age: "",
  class: "",
  teacher: "",
};

const EvaluationContext = createContext<EvaluationContextType | null>(null);

export const activities: Record<LevelType, ActivityType[]> = {
  "Baby": [
    { id: "baby-1", name: "Adaptação ao meio líquido", description: "Conforto e relaxamento na água" },
    { id: "baby-2", name: "Submersão básica com ajuda", description: "Contato controlado com água no rosto" },
    { id: "baby-3", name: "Flutuação dorsal com apoio", description: "Relaxamento em posição de costas" },
    { id: "baby-4", name: "Flutuação ventral com apoio", description: "Postura horizontal com assistência" },
    { id: "baby-5", name: "Pernada básica com assistência", description: "Movimento inicial das pernas" },
  ],
  "Adaptação": [
    { id: "adap-1", name: "Entrada independente na água", description: "Entrar na água com segurança" },
    { id: "adap-2", name: "Submersão facial voluntária", description: "Colocar rosto na água sem assistência" },
    { id: "adap-3", name: "Flutuação com apoio mínimo", description: "Sustentar-se na água com pouca ajuda" },
    { id: "adap-4", name: "Deslocamento básico com apoio", description: "Mover-se na água com assistência" },
    { id: "adap-5", name: "Salto básico na borda", description: "Pular na água com assistência" },
  ],
  "Iniciação": [
    { id: "init-1", name: "Submersão completa", description: "Mergulhar completamente sob a água" },
    { id: "init-2", name: "Flutuação dorsal independente", description: "Boiar de costas sem assistência" },
    { id: "init-3", name: "Flutuação ventral independente", description: "Boiar de frente sem assistência" },
    { id: "init-4", name: "Pernada de crawl básica", description: "Execução inicial do movimento de pernas" },
    { id: "init-5", name: "Respiração lateral básica", description: "Iniciar rotação para respirar" },
  ],
  "Aprendizagem 1": [
    { id: "ap1-1", name: "Nado crawl básico", description: "Coordenação inicial de braços e pernas" },
    { id: "ap1-2", name: "Nado costas básico", description: "Pernada e braçada iniciais de costas" },
    { id: "ap1-3", name: "Mergulho básico", description: "Entrada de cabeça na água da borda" },
    { id: "ap1-4", name: "Respiração bilateral inicial", description: "Respirar para ambos os lados" },
    { id: "ap1-5", name: "Distância de 12,5m", description: "Nadar meio comprimento da piscina" },
  ],
  "Aprendizagem 2": [
    { id: "ap2-1", name: "Nado crawl com respiração", description: "Crawl com respiração lateral coordenada" },
    { id: "ap2-2", name: "Nado costas completo", description: "Execução completa do nado de costas" },
    { id: "ap2-3", name: "Introdução ao peito", description: "Movimentos básicos do nado peito" },
    { id: "ap2-4", name: "Saída básica de bloco", description: "Iniciar da plataforma de saída" },
    { id: "ap2-5", name: "Distância de 25m", description: "Nadar um comprimento completo" },
  ],
  "Aprendizagem 3": [
    { id: "ap3-1", name: "Nado crawl avançado", description: "Técnica refinada de crawl" },
    { id: "ap3-2", name: "Nado costas avançado", description: "Técnica refinada de costas" },
    { id: "ap3-3", name: "Nado peito completo", description: "Execução completa do nado peito" },
    { id: "ap3-4", name: "Introdução ao borboleta", description: "Movimentos básicos do nado borboleta" },
    { id: "ap3-5", name: "Distância de 50m", description: "Nadar dois comprimentos completos" },
  ]
};

type EvaluationProviderProps = {
  children: ReactNode;
};

export const EvaluationProvider = ({ children }: EvaluationProviderProps) => {
  const [selectedLevel, setSelectedLevel] = useState<LevelType | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfoType>(defaultStudentInfo);
  const [activityRatings, setActivityRatings] = useState<ActivityRatingType[]>([]);

  const updateStudentInfo = (info: Partial<StudentInfoType>) => {
    setStudentInfo((prev) => ({ ...prev, ...info }));
  };

  const updateActivityRating = (activityId: string, rating: RatingType, observation: string) => {
    setActivityRatings((prev) => {
      // Check if we already have a rating for this activity
      const existingIndex = prev.findIndex((item) => item.activityId === activityId);
      
      if (existingIndex >= 0) {
        // Update existing rating
        const updated = [...prev];
        updated[existingIndex] = { activityId, rating, observation };
        return updated;
      } else {
        // Add new rating
        return [...prev, { activityId, rating, observation }];
      }
    });
  };

  const resetEvaluation = () => {
    setSelectedLevel(null);
    setStudentInfo(defaultStudentInfo);
    setActivityRatings([]);
  };

  return (
    <EvaluationContext.Provider
      value={{
        selectedLevel,
        studentInfo,
        activityRatings,
        setSelectedLevel,
        setStudentInfo: updateStudentInfo,
        setActivityRating: updateActivityRating,
        resetEvaluation,
        activities,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error("useEvaluation must be used within an EvaluationProvider");
  }
  return context;
};

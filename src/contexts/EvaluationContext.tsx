
import { createContext, useContext, useState, ReactNode } from "react";

export type LevelType = 
  "Baby 1" | 
  "Baby 2" | 
  "Baby 3" | 
  "Adaptação" | 
  "Iniciação" | 
  "Aperfeiçoamento 1" | 
  "Aperfeiçoamento 2" | 
  "Aperfeiçoamento 3";

export type ActivityType = {
  id: string;
  name: string;
  description: string;
};

export type RatingType = 
"Não Atingido" | 
"Parcialmente Atingido" | 
"Totalmente Atingido";

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

const activities: Record<LevelType, ActivityType[]> = {
  "Baby 1": [
    { id: "baby1-0", name: "Ambientação e aceitação da água no rosto", description: "" },
    { id: "baby1-1", name: "Balanços Frontal, Lateral em deslocamento e/ou em rodas", description: "Segurando pelas axilas" },
    { id: "baby1-2", name: "Movimentação de Braços e Pernas em direção a um brinquedo", description: "Segurando pelas axilas" },
    { id: "baby1-3", name: "Flutuação em decúbito dorsal", description: "Com auxílio do acompanhante" },
    { id: "baby1-4", name: "Deslocamento Frontal e Estímulo respiratório (bolinhas)", description: "Segurando nas axilas" },
    { id: "baby1-5", name: "Equilíbrio e deslocamento em cima do colchão", description: "4 apoios" },
    { id: "baby1-6", name: "Sustentação da barra", description: "Com ou sem auxílio do acompanhante" },
    { id: "baby1-7", name: "Mergulho Simples com auxílio do professor", description: "Em direção ao acompanhante" },
    { id: "baby1-8", name: "Mergulho sentado a partir da borda", description: "Com ou sem auxílio" },
    { id: "baby1-9", name: "Deslocamento frontal no espaguete", description: "Com auxílio do acompanhante" },
  ],
  "Baby 2": [
    { id: "baby2-1", name: "Assoprar o ar dentro da água soltando bolinhas.", description: "Bolhas e controle respiratório básico" },
    { id: "baby2-2", name: "Equilíbrio e deslocamento no colchão, em pé.", description: "Com ou sem auxílio" },
    { id: "baby2-3", name: "Equilíbrio e deslocamento na plataforma", description: "Com ou sem auxílio" },
    { id: "baby2-4", name: "Flutuação em decúbito dorsal", description: "Com auxílio do acompanhante." },
    { id: "baby2-5", name: "Deslocamento frontal e estímulo respiratório(bolinhas)", description: "Segurando nas axilas" },
    { id: "baby2-6", name: "Equilíbrio e deslocamento em cima do colchão", description: "4 apoios" },
    { id: "baby2-7", name: "Sustentação na barra", description: "Com ou sem auxílio" },
    { id: "baby2-8", name: "Mergulho simples com auxílio do professor em direção ao acompanhante.", description: "Em direção ao acompanhante" },
    { id: "baby2-9", name: "Mergulho sentado a partir da borda", description: "Com ou sem auxílio" },
    { id: "baby2-10", name: "Deslocamento frontal no espaguete com auxílio do acompanhante", description: "Com auxílio do acompanhante" },
  ],
  "Baby 3": [
    { id: "baby3-1", name: "Soltar ar pela boca com a cabeça submersa", description: "" },
    { id: "baby3-2", name: "Andar na plataforma cantando uma música.", description: "" },
    { id: "baby3-3", name: "Movimentação de braços em pé na plataforma ou na parte rasa da piscina.", description: "" },
    { id: "baby3-4", name: "Flutuação em decúbito ventral com ou sem auxílio (estrelinha)", description: "Com ou sem auxílio" },
    { id: "baby3-5", name: "Flutuação em decúbito dorsal (dorminhoco).", description: "" },
    { id: "baby3-6", name: "Pegar objeto submerso na plataforma ou chão da piscina", description: "" },
    { id: "baby3-7", name: "Deslizar de uma plataforma a outra sem auxílio", description: "Sem auxílio" },
    { id: "baby3-8", name: "Deslocamento de uma plataforma a outra com movimentação de braços e pernas.", description: "" },
    { id: "baby3-9", name: "Salto sobrevivência com ou sem auxílio.", description: "Com ou sem auxílio" },
    { id: "baby3-10", name: "Independência com espaguete.", description: "" },
  ],
  "Adaptação": [
    { id: "adap-1", name: "Respiração - Inspirar o ar pela boca e expirar dentro da água pela boca e nariz", description: "" },
    { id: "adap-2", name: "Flutuar e deslizar em decúbito ventral.", description: "" },
    { id: "adap-3", name: "Flutuar e deslizar em decúbito dorsal.", description: "" },
    { id: "adap-4", name: "Propulsão de braços e pernas alternados (nado crawl)", description: "Avaliar somente nado Crawl" },
    { id: "adap-5", name: "Propulsão de braços e pernas alternados (nado costas).", description: "Avaliar somente nado Costa" },
    { id: "adap-6", name: "Nado de sobrevivência (cachorrinho)", description: "" },
    { id: "adap-7", name: "Saltos da borda em pé.", description: "" },
    { id: "adap-8", name: "Saltar ajoelhado da borda sem auxílio (braços em posição de flecha).", description: "Sem auxílio" },
    { id: "adap-9", name: "Cambalhotas", description: "" },
    { id: "adap-10", name: "Nado submerso.", description: "" },    
  ],
  "Iniciação": [
    { id: "init-1", name: "Deslizes longos na posição ventral com impulsão na borda", description: "" },
    { id: "init-2", name: "Domínio da pernada do nado crawl.", description: "" },
    { id: "init-3", name: "Respiração lateral - Propulsão de pernas com o corpo na posição lateral com prancha.", description: "" },
    { id: "init-4", name: "Domínio do nado crawl.", description: "" },
    { id: "init-5", name: "Deslizes longos na posição dorsal com impulsão na borda.", description: "" },
    { id: "init-6", name: "Domínio da pernada do nado costas", description: "" },
    { id: "init-7", name: "Domínio do nado costas.", description: "" },
    { id: "init-8", name: "Domínio da pernada do nado peito.", description: "" },
    { id: "init-9", name: "Ondulações submersas na posição ventral com os braços ao longo do corpo.", description: "" },
    { id: "init-10", name: "Saltar na borda realizando o mergulho elementar completo.", description: "" },
  ],
  "Aperfeiçoamento 1": [
    { id: "ap1-1", name: "Nado crawl com respiração bilateral (3x1).", description: "" },
    { id: "ap1-2", name: "Nado costas.", description: "" },
    { id: "ap1-3", name: "Braçada do nado peito com perna de crawl e respiração frontal.", description: "" },
    { id: "ap1-4", name: "Domínio do nado peito.", description: "" },
    { id: "ap1-5", name: "Deslize e 4 ondulações submersas na posição ventral.", description: "" },
    { id: "ap1-6", name: "Pernada do nado borboleta com pranchas: 3 pernadas e 1 respiração (2x).", description: "" },
    { id: "ap1-7", name: "Virada simples dos nados alternados (assimétricos).", description: "" },
    { id: "ap1-8", name: "Virada simples dos nados simultâneos (simétricos).", description: "" },
    { id: "ap1-9", name: "Habilidades de sobrevivência aquática.", description: "" },
    { id: "ap1-10", name: "Saída do bloco com deslize submerso", description: "" },
  ],
  "Aperfeiçoamento 2": [
    { id: "ap2-1", name: "Deslize e 4 ondulações submersas na posição dorsal.", description: "" },
    { id: "ap2-2", name: "Braçada unilateral com a pernada do borboleta.", description: "" },
    { id: "ap2-3", name: "Nadar 4 braçadas de borboleta com ondulações sem respirar", description: "" },
    { id: "ap2-4", name: "Braçada de crawl com alavanca 25m.", description: "" },
    { id: "ap2-5", name: "Braçada de costas com alavanca 25m.", description: "" },
    { id: "ap2-6", name: "Virada olímpica do nado crawl.", description: "" },
    { id: "ap2-7", name: "Virada do nado costas.", description: "" },
    { id: "ap2-8", name: "Filipina.", description: "" },
    { id: "ap2-9", name: "Nado peito completo 25m", description: "" },
    { id: "ap2-10", name: "Nadar 200m crawl.", description: "" },
  ],
  "Aperfeiçoamento 3": [
    { id: "ap3-1", name: "Palmateios frontais na posição ventral.", description: "" },
    { id: "ap3-2", name: "Saída do nado costas.", description: "" },
    { id: "ap3-3", name: "Nadar 100m costas.", description: "" },
    { id: "ap3-4", name: "Virada do nado peito.", description: "" },
    { id: "ap3-5", name: "Nadar 100m peito", description: "" },
    { id: "ap3-6", name: "Nadar 25m borboleta.", description: "" },
    { id: "ap3-7", name: "Virada do nado borboleta.", description: "" },
    { id: "ap3-8", name: "Nadar 100m medley.", description: "" },
    { id: "ap3-9", name: "Teste de 200m.", description: "" },
    { id: "ap3-10", name: "Nadar 10m em velocidade.", description: "" },
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

const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error("useEvaluation must be used within an EvaluationProvider");
  }
  return context;
};

export { useEvaluation };
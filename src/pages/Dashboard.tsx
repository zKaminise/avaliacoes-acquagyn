
import { Header } from "@/components/Header";
import { LevelSelector } from "@/components/LevelSelector";
import { EvaluationForm } from "@/components/EvaluationForm";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { WaterLogo } from "@/components/WaterLogo";

const Dashboard = () => {
  const { selectedLevel } = useEvaluation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-6">
        {selectedLevel ? <EvaluationForm /> : <LevelSelector />}
      </main>
      <footer className="mt-auto py-4 bg-white border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <WaterLogo className="h-6 w-auto" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Academia de Natação. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

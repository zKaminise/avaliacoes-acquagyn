
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEvaluation } from "@/contexts/EvaluationContext";

export const StudentForm = () => {
  const { studentInfo, setStudentInfo } = useEvaluation();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-acqua-700">Informações do aluno</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do aluno</Label>
            <Input
              id="name"
              value={studentInfo.name}
              onChange={(e) => setStudentInfo({ name: e.target.value })}
              placeholder="Nome completo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              value={studentInfo.age}
              onChange={(e) => setStudentInfo({ age: e.target.value })}
              placeholder="Ex: 7 anos"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">Turma</Label>
            <Input
              id="class"
              value={studentInfo.class}
              onChange={(e) => setStudentInfo({ class: e.target.value })}
              placeholder="Ex: Turma 3B"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacher">Professor responsável</Label>
            <Input
              id="teacher"
              value={studentInfo.teacher}
              onChange={(e) => setStudentInfo({ teacher: e.target.value })}
              placeholder="Nome do professor"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { WaterLogo } from "./WaterLogo";

export const LoginForm = () => {
  const [username, setUsername] = useState("admin@teste.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-acqua-100 to-acqua-300">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <WaterLogo className="h-24 w-auto" />
          </div>
          <CardDescription>Acesso restrito para professores</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                placeholder="Digite seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-acqua-500 hover:bg-acqua-600"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
        {/* <div className="pb-4 px-4 text-xs text-center text-muted-foreground">
          <p>Credenciais: admin@teste.com / adm123</p>
        </div> */}
      </Card>
    </div>
  );
};


import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === "michelampk31@gmail.com" && password === "Takamori01") {
      setUser({
        id: "1",
        name: "Administrador",
        role: "instructor",
      });
      toast.success("Login realizado com sucesso!");
      return true;
    } else {
      toast.error("Credenciais inválidas");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("Você foi desconectado");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

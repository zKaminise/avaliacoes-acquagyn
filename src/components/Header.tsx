
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { WaterLogo } from "./WaterLogo";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <WaterLogo className="h-10 w-auto" />
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Olá, {user.name}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
              >
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

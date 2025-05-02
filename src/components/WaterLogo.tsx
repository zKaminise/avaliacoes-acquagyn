
import { cn } from "@/lib/utils";

export const WaterLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <img 
      src="/lovable-uploads/0d85c0da-2aab-4954-9e10-99368ef81b4e.png" 
      alt="Acquagyn Logo" 
      className={cn("h-auto", className)} 
      {...props} 
    />
  );
};

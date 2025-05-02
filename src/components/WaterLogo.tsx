
import { cn } from "@/lib/utils";

export const WaterLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-acqua-500", className)}
      {...props}
    >
      <path d="M12 2v1m0 18v1M4.93 4.93l.7.7m12.73 12.73l.7.7M2 12h1m18 0h1m-3.3-7.07l-.7.7M6.07 17.07l-.7.7" />
      <path d="M12 16a4 4 0 0 0 2.83-6.83M12 12a4 4 0 0 1-2.83-6.83" fill="currentColor" strokeWidth={0} />
      <path d="M12 8a4 4 0 0 1 0 8" />
    </svg>
  );
};

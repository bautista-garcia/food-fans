import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingSpinner({ size = "sm", className }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
    </div>
  );
}

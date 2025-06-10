import { cn } from "@/lib/utils";

export function OrbitalDivider({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex justify-center section-padding", className)}>
      <div className="h-px w-3/5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
    </div>
  );
}

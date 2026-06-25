import { Info } from "lucide-react";

export function AIDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-foreground/80 ${className}`}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
      <p>
        AI-generated content may contain inaccuracies. Always review, verify, and edit outputs
        before using them in professional communications or decision-making.
      </p>
    </div>
  );
}

import { Copy, RotateCcw, Save, Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OutputCardProps {
  title: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyState?: ReactNode;
  onCopy?: () => string;
  onRegenerate?: () => void;
  onSave?: () => void;
  children?: ReactNode;
}

export function OutputCard({
  title,
  isLoading,
  isEmpty,
  emptyState,
  onCopy,
  onRegenerate,
  onSave,
  children,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!onCopy) return;
    try {
      await navigator.clipboard.writeText(onCopy());
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <CardTitle className="min-w-0 truncate text-base">{title}</CardTitle>
        <div className="flex shrink-0 items-center gap-1.5">
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isLoading}
              className="h-8"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>
          )}
          {onSave && (
            <Button variant="ghost" size="sm" onClick={onSave} className="h-8">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          )}
          {onCopy && (
            <Button variant="outline" size="sm" onClick={handleCopy} className="h-8">
              {copied ? (
                <Check className="mr-1.5 h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="mr-1.5 h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : isEmpty ? (
          <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
            {emptyState ?? "Your AI output will appear here."}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

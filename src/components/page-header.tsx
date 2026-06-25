import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  icon,
  actions,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elevated)]">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

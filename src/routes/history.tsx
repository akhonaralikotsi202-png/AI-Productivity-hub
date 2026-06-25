import { createFileRoute } from "@tanstack/react-router";
import { History, Mail, FileText, ListChecks } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — FlowAI" }] }),
  component: HistoryPage,
});

const items = [
  { type: "Email", icon: Mail, title: "Follow-up with Acme Co. on Q3 proposal", time: "2h ago" },
  { type: "Summary", icon: FileText, title: "Engineering weekly sync — Jun 23", time: "Yesterday" },
  { type: "Plan", icon: ListChecks, title: "Launch plan: Mobile app v2.1", time: "2 days ago" },
  { type: "Email", icon: Mail, title: "Intro to design partner — Lumen Studio", time: "3 days ago" },
  { type: "Summary", icon: FileText, title: "Customer discovery — TalentHQ", time: "Last week" },
  { type: "Plan", icon: ListChecks, title: "Q3 OKRs rollout", time: "Last week" },
];

function HistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<History className="h-5 w-5" />}
        title="History"
        description="Everything you've generated, in one place."
      />
      <Input placeholder="Search history…" className="max-w-md" />
      <Card className="shadow-[var(--shadow-soft)]">
        <CardContent className="divide-y p-0">
          {items.map((it, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                <it.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                    {it.type}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm font-medium">{it.title}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{it.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AIDisclaimer } from "@/components/ai-disclaimer";
import { OutputCard } from "@/components/output-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { createTaskPlan } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — FlowAI" },
      { name: "description", content: "Generate prioritized task plans with AI." },
    ],
  }),
  component: TaskPage,
});

type Priority = "Low" | "Medium" | "High" | "Critical";

function priorityClass(p: string) {
  const v = p.toLowerCase();
  if (v.includes("critical")) return "bg-destructive/15 text-destructive";
  if (v.includes("high")) return "bg-warning/15 text-warning-foreground border border-warning/40";
  if (v.includes("medium")) return "bg-primary/10 text-primary";
  return "bg-muted text-muted-foreground";
}

function renderPlan(md: string) {
  const lines = md.split("\n");
  const out: React.ReactElement[] = [];
  let listBuf: string[] = [];
  const flush = (k: number) => {
    if (!listBuf.length) return;
    out.push(
      <ol key={`l-${k}`} className="my-3 space-y-2">
        {listBuf.map((b, i) => {
          const clean = b.replace(/^\s*(\d+\.|[-*])\s*/, "");
          const pMatch = clean.match(/\[(Critical|High|Medium|Low)\]/i);
          return (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-lg border bg-card p-3"
            >
              <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-md bg-accent text-xs font-semibold text-accent-foreground">
                {i + 1}
              </span>
              <span className="text-sm">{clean.replace(/\[(Critical|High|Medium|Low)\]\s*/i, "")}</span>
              {pMatch && (
                <Badge className={`shrink-0 ${priorityClass(pMatch[1])} border-0`}>{pMatch[1]}</Badge>
              )}
            </li>
          );
        })}
      </ol>,
    );
    listBuf = [];
  };
  lines.forEach((line, i) => {
    if (/^##\s+/.test(line)) {
      flush(i);
      out.push(
        <h3 key={`h-${i}`} className="mt-5 text-sm font-semibold uppercase tracking-wide text-primary">
          {line.replace(/^##\s+/, "")}
        </h3>,
      );
    } else if (/^\s*(\d+\.|[-*])\s+/.test(line)) {
      listBuf.push(line);
    } else if (line.trim() === "") {
      flush(i);
    } else {
      flush(i);
      out.push(
        <p key={`p-${i}`} className="my-2 text-sm leading-relaxed">
          {line}
        </p>,
      );
    }
  });
  flush(9999);
  return out;
}

function TaskPage() {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Priority>("High");
  const [teamSize, setTeamSize] = useState(3);
  const [plan, setPlan] = useState("");
  const [editMode, setEditMode] = useState(false);

  const fn = useServerFn(createTaskPlan);
  const mutation = useMutation({
    mutationFn: () => fn({ data: { goal, deadline, priority, teamSize } }),
    onSuccess: (res) => {
      setPlan(res.plan);
      setEditMode(false);
      toast.success("Task plan ready");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ListChecks className="h-5 w-5" />}
        title="AI Task Planner"
        description="Describe a goal — get a prioritized plan with timeline."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 shadow-[var(--shadow-soft)]">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="goal">Goal or project</Label>
              <Textarea
                id="goal"
                rows={5}
                placeholder="e.g. Ship a redesigned onboarding flow with personalized first-run tour"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                maxLength={2000}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  placeholder="e.g. Aug 15"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="team">Team size</Label>
                <Input
                  id="team"
                  type="number"
                  min={1}
                  max={500}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High", "Critical"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => {
                if (goal.trim().length < 5) {
                  toast.error("Describe the goal in a bit more detail.");
                  return;
                }
                mutation.mutate();
              }}
              disabled={mutation.isPending}
              className="w-full bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elevated)]"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {mutation.isPending ? "Planning…" : "Generate task plan"}
            </Button>
            <AIDisclaimer />
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <OutputCard
            title="Your task plan"
            isLoading={mutation.isPending}
            isEmpty={!mutation.isPending && !plan}
            emptyState="Describe your goal to generate a prioritized plan."
            onCopy={() => plan}
            onRegenerate={goal.trim().length >= 5 ? () => mutation.mutate() : undefined}
            onSave={plan ? () => setEditMode((v) => !v) : undefined}
          >
            {editMode ? (
              <Textarea
                rows={22}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="font-mono text-sm"
              />
            ) : (
              <div>{renderPlan(plan)}</div>
            )}
            {plan && (
              <div className="mt-3 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setEditMode((v) => !v)}>
                  {editMode ? "Preview" : "Edit"}
                </Button>
              </div>
            )}
          </OutputCard>
        </div>
      </div>
    </div>
  );
}

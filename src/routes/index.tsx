import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  FileText,
  ListChecks,
  Mail,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { AIDisclaimer } from "@/components/ai-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FlowAI" },
      { name: "description", content: "Your AI workplace productivity overview." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Emails generated", value: "142", delta: "+18%", icon: Mail },
  { label: "Meetings summarized", value: "37", delta: "+9%", icon: FileText },
  { label: "Tasks planned", value: "94", delta: "+24%", icon: ListChecks },
  { label: "Time saved", value: "21h", delta: "this week", icon: Clock },
];

const quickActions = [
  {
    to: "/email",
    title: "Generate an email",
    desc: "Draft polished, on-tone replies in seconds.",
    icon: Mail,
    accent: "from-indigo-500/15 to-indigo-500/0",
  },
  {
    to: "/summarize",
    title: "Summarize meeting notes",
    desc: "Turn raw notes into a structured recap with action items.",
    icon: FileText,
    accent: "from-violet-500/15 to-violet-500/0",
  },
  {
    to: "/tasks",
    title: "Plan a project",
    desc: "Get a prioritized task plan with a suggested timeline.",
    icon: ListChecks,
    accent: "from-fuchsia-500/15 to-fuchsia-500/0",
  },
] as const;

const recent = [
  { type: "Email", title: "Follow-up with Acme Co. on Q3 proposal", time: "2h ago" },
  { type: "Summary", title: "Engineering weekly sync — Jun 23", time: "Yesterday" },
  { type: "Plan", title: "Launch plan: Mobile app v2.1", time: "2 days ago" },
  { type: "Email", title: "Intro to design partner — Lumen Studio", time: "3 days ago" },
];

function Dashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border bg-[image:var(--gradient-primary)] p-6 text-primary-foreground shadow-[var(--shadow-elevated)] sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/10 blur-3xl" />
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6">
          <div className="min-w-0">
            <Badge className="bg-white/15 text-primary-foreground hover:bg-white/20 border-0">
              <Sparkles className="mr-1 h-3 w-3" /> AI assistant ready
            </Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {greeting}, Alex.
            </h1>
            <p className="mt-1 max-w-xl text-sm text-primary-foreground/80">
              You've reclaimed <strong>21 hours</strong> this week with FlowAI. Pick up where you
              left off or start something new.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/email">
                  New email <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
              >
                <Link to="/summarize">Summarize notes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                  <TrendingUp className="h-3 w-3" />
                  {s.delta}
                </span>
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <Link to="/history" className="text-sm text-primary hover:underline">
            View history
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to} className="group">
              <Card className="h-full overflow-hidden shadow-[var(--shadow-soft)] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-elevated)]">
                <div className={`h-1 bg-gradient-to-r ${a.accent}`} />
                <CardHeader>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3 text-base">{a.title}</CardTitle>
                  <CardDescription>{a.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Open
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>Your latest AI-assisted work.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {recent.map((r) => (
              <div
                key={r.title}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                      {r.type}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium">{r.title}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{r.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-base">Tips</CardTitle>
            <CardDescription>Get more out of FlowAI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>• Paste raw transcripts — the summarizer handles the structure for you.</p>
            <p>• Use "Persuasive" tone for outbound; "Friendly" for teammates.</p>
            <p>• Generate a task plan first, then ask for a kickoff email.</p>
            <AIDisclaimer className="mt-4" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

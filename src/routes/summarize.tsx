import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, FileText, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AIDisclaimer } from "@/components/ai-disclaimer";
import { OutputCard } from "@/components/output-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/summarize")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — FlowAI" },
      { name: "description", content: "Turn raw meeting notes into structured summaries." },
    ],
  }),
  component: SummarizePage,
});

function renderMarkdown(md: string) {
  // Lightweight renderer for our known H2 + bullet output
  const lines = md.split("\n");
  const out: React.ReactElement[] = [];
  let listBuf: string[] = [];
  const flush = (key: number) => {
    if (!listBuf.length) return;
    out.push(
      <ul key={`l-${key}`} className="my-2 ml-5 list-disc space-y-1 text-sm">
        {listBuf.map((b, i) => (
          <li key={i}>{b.replace(/^\s*[-*]\s*(\[[ x]\]\s*)?/, "")}</li>
        ))}
      </ul>,
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
    } else if (/^\s*[-*]\s+/.test(line)) {
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

function SummarizePage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [editMode, setEditMode] = useState(false);

  const fn = useServerFn(summarizeNotes);
  const mutation = useMutation({
    mutationFn: () => fn({ data: { title, notes } }),
    onSuccess: (res) => {
      setSummary(res.summary);
      setEditMode(false);
      toast.success("Summary ready");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleExport = () => {
    const blob = new Blob([`# ${title || "Meeting Summary"}\n\n${summary}`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title || "summary").replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported summary");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<FileText className="h-5 w-5" />}
        title="Meeting Notes Summarizer"
        description="Paste raw notes and get a structured recap with action items."
        actions={
          summary ? (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-1.5 h-4 w-4" />
              Export
            </Button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 shadow-[var(--shadow-soft)]">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="title">Meeting title (optional)</Label>
              <Input
                id="title"
                placeholder="e.g. Q3 Marketing Sync"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Raw notes</Label>
              <Textarea
                id="notes"
                rows={16}
                placeholder="Paste your meeting notes, transcript, or bullet points…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={20000}
              />
              <p className="text-xs text-muted-foreground">{notes.length} / 20,000 characters</p>
            </div>
            <Button
              onClick={() => {
                if (notes.trim().length < 10) {
                  toast.error("Add at least a few lines of notes.");
                  return;
                }
                mutation.mutate();
              }}
              disabled={mutation.isPending}
              className="w-full bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elevated)]"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {mutation.isPending ? "Summarizing…" : "Summarize notes"}
            </Button>
            <AIDisclaimer />
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <OutputCard
            title="Structured summary"
            isLoading={mutation.isPending}
            isEmpty={!mutation.isPending && !summary}
            emptyState="Paste notes and click Summarize to get a structured recap."
            onCopy={() => summary}
            onRegenerate={notes.trim().length >= 10 ? () => mutation.mutate() : undefined}
            onSave={summary ? () => setEditMode((v) => !v) : undefined}
          >
            {editMode ? (
              <Textarea
                rows={20}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="font-mono text-sm"
              />
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {renderMarkdown(summary)}
              </div>
            )}
            {summary && (
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

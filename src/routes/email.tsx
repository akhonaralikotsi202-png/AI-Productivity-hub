import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Wand2 } from "lucide-react";
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

import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — FlowAI" },
      { name: "description", content: "Generate professional emails with AI." },
    ],
  }),
  component: EmailPage,
});

type Tone = "Professional" | "Friendly" | "Formal" | "Persuasive";
type Length = "Short" | "Medium" | "Long";

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [length, setLength] = useState<Length>("Medium");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const fn = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: () =>
      fn({ data: { purpose, recipient, tone, keyPoints, length } }),
    onSuccess: (res) => {
      setSubject(res.subject);
      setBody(res.body);
      toast.success("Email generated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const canSubmit = purpose.trim().length > 0 && recipient.trim().length > 0;

  const handleGenerate = () => {
    if (!canSubmit) {
      toast.error("Add a purpose and recipient first.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        description="Draft professional emails tailored to your audience."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 shadow-[var(--shadow-soft)]">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Follow up on last week's proposal"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                maxLength={500}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Sarah, VP of Partnerships at Acme"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Professional", "Friendly", "Formal", "Persuasive"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Length</Label>
                <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Short", "Medium", "Long"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={5}
                placeholder="Bullet the must-include points…"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                maxLength={2000}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={!canSubmit || mutation.isPending}
              className="w-full bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elevated)]"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {mutation.isPending ? "Generating…" : "Generate email"}
            </Button>
            <AIDisclaimer />
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <OutputCard
            title="Generated email"
            isLoading={mutation.isPending}
            isEmpty={!mutation.isPending && !body}
            emptyState="Fill in the form to generate an email."
            onCopy={() => `Subject: ${subject}\n\n${body}`}
            onRegenerate={canSubmit ? handleGenerate : undefined}
            onSave={body ? () => toast.success("Saved to History") : undefined}
          >
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="subj" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Subject
                </Label>
                <Input id="subj" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="body" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Body
                </Label>
                <Textarea
                  id="body"
                  rows={16}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          </OutputCard>
        </div>
      </div>
    </div>
  );
}

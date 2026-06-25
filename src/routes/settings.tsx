import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";

import { AIDisclaimer } from "@/components/ai-disclaimer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — FlowAI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<SettingsIcon className="h-5 w-5" />}
        title="Settings"
        description="Personalize your workspace."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>How you appear across FlowAI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="n">Name</Label>
              <Input id="n" defaultValue="Alex Morgan" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e">Email</Label>
              <Input id="e" defaultValue="alex@flowai.app" />
            </div>
            <Button>Save changes</Button>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-base">Appearance & notifications</CardTitle>
            <CardDescription>Make FlowAI feel like home.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-xs text-muted-foreground">Use a darker theme.</p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email digests</p>
                <p className="text-xs text-muted-foreground">Weekly productivity recap.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sounds</p>
                <p className="text-xs text-muted-foreground">Subtle UI feedback sounds.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <AIDisclaimer />
    </div>
  );
}

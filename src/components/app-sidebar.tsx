import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  History,
  Settings,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Smart Email", url: "/email", icon: Mail },
  { title: "Meeting Notes", url: "/summarize", icon: FileText },
  { title: "Task Planner", url: "/tasks", icon: ListChecks },
];

const secondary = [
  { title: "History", url: "/history", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elevated)]">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">FlowAI</p>
              <p className="truncate text-xs text-muted-foreground">Workplace assistant</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondary.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && (
          <div className="rounded-lg border bg-[image:var(--gradient-subtle)] dark:bg-none p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Free plan</p>
            <p>120 of 500 AI actions used this month.</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

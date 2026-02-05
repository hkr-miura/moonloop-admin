"use client"

import { Calendar, Home, Inbox, Settings, CalendarDays, MessageSquare } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "通常予約 (Reservations)",
    url: "/reservations",
    icon: Calendar,
  },
  {
    title: "イベント管理 (Events)",
    url: "/events",
    icon: CalendarDays,
  },
  {
    title: "予約変更 (Requests)",
    url: "/changes",
    icon: Inbox,
  },
  {
    url: "/settings",
    icon: Settings,
  },
  {
    title: "ご意見箱 (Opinions)",
    url: "/opinions",
    icon: MessageSquare,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/10 bg-sidebar/60 backdrop-blur-xl text-sidebar-foreground">
      <SidebarHeader className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-bold tracking-tight text-primary font-sans">MOON LOOP</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Admin System</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 uppercase text-[10px] tracking-wider mt-4">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg" className="hover:bg-primary/20 hover:text-primary transition-all duration-300 data-[active=true]:bg-primary/20 data-[active=true]:text-primary">
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

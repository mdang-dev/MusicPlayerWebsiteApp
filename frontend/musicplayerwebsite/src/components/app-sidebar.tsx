"use client"

import * as React from "react"
import {
  AudioLines,
  UserRoundCog,
  CircleUser,
  List,
  ShieldCheck,
  ChartColumnDecreasing,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import Image from '../../public/images/images.jpg';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "User123",
    email: "@example.com",
    avatar: Image.src,
  },
  teams: [

  ],
  navMain: [
    {
      title: "Người Dùng",
      url: "#",
      icon: UserRoundCog,
      isActive: false,
      items: [
        {
          title: "Danh Sách",
          url: "/users-management/list",
        },
      ],
    },
    {
      title: "Thể Loại",
      url: "#",
      icon: List,
      isActive: false,
      items: [
        {
          title: "Thêm Mới",
          url: "/genres-management/form",
        },
        {
          title: "Danh Sách",
          url: "/genres-management/list",
        },
      ],
    },
    {
      title: "Bài Hát",
      url: "#",
      icon: AudioLines,
      isActive: false,
      items: [
        {
          title: "Thêm Mới",
          url: "/songs-management/form",
        },
        {
          title: "Danh Sách",
          url: "/songs-management/list",
        },
      ],
    },
    {
      title: "Nghệ Sĩ",
      url: "#",
      icon: CircleUser,
      isActive: false,
      items: [
        {
          title: "Thêm Mới",
          url: "/artists-management/form",
        },
        {
          title: "Danh Sách",
          url: "/artists-management/list",
        },
      ],
    },
    {
      title: "Tài Khoản Quản Trị",
      url: "#",
      icon: ShieldCheck,
      isActive: false,
      items: [
        {
          title: "Thêm Mới",
          url: "/admin-management/form",
        },
        {
          title: "Danh Sách",
          url: "/admin-management/list",
        },
      ],
    },
    {
      title: "Thống Kê",
      url: "#",
      icon: ChartColumnDecreasing,
      isActive: true,
      items: [
        {
          title: "Lượt Nghe",
          url: "/dashboard/plays",
        },
        {
          title: "Lượt Yêu Thích",
          url: "/dashboard/liked-count",
        },
      ],
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

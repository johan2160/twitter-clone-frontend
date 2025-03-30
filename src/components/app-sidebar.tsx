import * as React from "react"
import {
    Bell,
  Bookmark,
  Home,
  TestTubeDiagonal,
  User,
} from "lucide-react"
import { useLocation } from "react-router-dom"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { RiTwitterLine } from "@remixicon/react"

const getNavItems = (pathname: string) => ({
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
      isActive: pathname === "/notifications",
    },
    {
      title: "Bookmarks",
      url: "/bookmarks",
      icon: Bookmark,
      isActive: pathname === "/bookmarks",
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
      isActive: pathname === "/profile",
    },
    {
      title: "Testing",
      url: "/testing",
      icon: TestTubeDiagonal,
      isActive: pathname === "/testing",
    }
  ],
})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const data = getNavItems(pathname);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <RiTwitterLine size={32} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

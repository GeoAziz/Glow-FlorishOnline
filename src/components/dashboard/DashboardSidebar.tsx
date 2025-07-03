
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Logo from "../shared/Logo";
import type { UserRole } from "@/types";
import { 
    BarChart3, 
    Home, 
    MessageSquareWarning, 
    ShieldCheck, 
    User, 
    Users,
    Settings,
    LifeBuoy,
    ShoppingBag,
    Heart,
    Package
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const navItemsByRole: Record<UserRole, NavItem[]> = {
  user: [
    { href: "/dashboard/user", label: "My Dashboard", icon: User },
    { href: "/dashboard/user/orders", label: "Order History", icon: ShoppingBag },
    { href: "/dashboard/user/wishlist", label: "My Wishlist", icon: Heart },
  ],
  moderator: [
    { href: "/dashboard/mod", label: "Content Review", icon: ShieldCheck },
    { href: "/dashboard/mod/reports", label: "Reports", icon: MessageSquareWarning },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: Home },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/products", label: "Manage Products", icon: Package },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
};

interface DashboardSidebarProps {
  role: UserRole;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = navItemsByRole[role] || [];

  return (
    <Sidebar>
        <SidebarHeader>
            <div className="flex items-center justify-between">
                <div className="group-data-[collapsible=icon]:hidden">
                    <Logo />
                </div>
                <SidebarTrigger />
            </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <SidebarMenu>
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href}>
                            <SidebarMenuButton 
                                isActive={pathname.startsWith(item.href)}
                                tooltip={item.label}
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings" disabled>
                        <Settings />
                        <span>Settings</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Support" disabled>
                        <LifeBuoy />
                        <span>Support</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  );
}


"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserRole } from "@/actions/user";
import type { AdminAppUser, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UserActionsCellProps {
  user: AdminAppUser;
}

export function UserActionsCell({ user }: UserActionsCellProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>(user.role);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleRoleChange = (newRole: string) => {
    if (newRole === currentRole) return;

    startTransition(async () => {
      const result = await updateUserRole(user.uid, newRole as UserRole);
      if (result.success) {
        setCurrentRole(newRole as UserRole);
        toast({
            title: "Success",
            description: `User role updated to ${newRole}.`,
        });
      } else {
        toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentRole}
          onValueChange={handleRoleChange}
          disabled={isPending}
        >
          <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="moderator">Moderator</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="user">User</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

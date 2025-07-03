
import { getUsers } from "@/actions/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserActionsCell } from "./components/user-actions-cell";
import { format } from "date-fns";
import { User } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-4xl font-bold font-headline mb-2">Manage Users</h1>
      <p className="text-muted-foreground mb-8">
        A list of all registered users in your application.
      </p>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
                    <AvatarFallback>
                        <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{user.displayName ?? 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                    {user.metadata.creationTime ? format(new Date(user.metadata.creationTime), "MMM d, yyyy") : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <UserActionsCell user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

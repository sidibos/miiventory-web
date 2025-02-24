import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from 'lucide-react';
import { User } from '@/types/user';

interface UserTableRowProps {
    user: User;
    onView: (user: User) => void;
    onEdit: (user: User) => void;
}

export const UserTableRow = ({ user, onView, onEdit }: UserTableRowProps) => {
    return (
        <TableRow>
            <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar ?? ''} alt={user.name} />
                    <AvatarFallback>{user.name ? user.name.substring(0, 2) : ''}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">{user.name ?? ''}</div>
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm text-muted-foreground">{user.email}</div>
            </TableCell>
            <TableCell>
                <div className="text-sm text-muted-foreground">{user.age}</div>
            </TableCell>
            <TableCell>
                <Badge
                    variant={user.status === "Active" ? "default" : "secondary"}
                    className={user.status === "Active" ? "bg-green-100 text-green-800" : ""}
                >
                    {user.status}
                </Badge>
            </TableCell>
            <TableCell>
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(user)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(user)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
};
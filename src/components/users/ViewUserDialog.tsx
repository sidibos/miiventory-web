
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { User } from '@/types/user';

interface ViewUserDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export const ViewUserDialog = ({ isOpen, onOpenChange, user }: ViewUserDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user?.avatar ?? ''} alt={user?.name} />
                                <AvatarFallback>{user?.name ? user.name.substring(0, 2) : ''}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{user?.name}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Email</Label>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                            <div>
                                <Label>Age</Label>
                                <p className="text-sm text-muted-foreground">{user?.age}</p>
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Badge
                                    variant={user?.status === "Active" ? "default" : "secondary"}
                                    className={user?.status === "Active" ? "bg-green-100 text-green-800" : ""}
                                >
                                    {user?.status}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

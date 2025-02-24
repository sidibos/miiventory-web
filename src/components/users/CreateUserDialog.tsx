import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from '@/types/user';

interface CreateUserDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    newUser: User;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export const CreateUserDialog = ({
    isOpen,
    onOpenChange,
    newUser,
    onInputChange,
    onSubmit,
    onCancel
}: CreateUserDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="newName">Name</Label>
                        <Input
                            id="newName"
                            name="name"
                            value={newUser.name}
                            onChange={onInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newEmail">Email</Label>
                        <Input
                            id="newEmail"
                            name="email"
                            type="email"
                            value={newUser.email}
                            onChange={onInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newAge">Age</Label>
                        <Input
                            id="newAge"
                            name="age"
                            type="number"
                            value={newUser.age}
                            onChange={onInputChange}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button onClick={onSubmit}>
                            Create User
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

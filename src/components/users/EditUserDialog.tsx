
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from '@/types/user';

interface EditUserDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editForm: User | null;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
}

export const EditUserDialog = ({
    isOpen,
    onOpenChange,
    editForm,
    onInputChange,
    onSubmit
}: EditUserDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={editForm?.name || ''}
                            onChange={onInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            value={editForm?.email || ''}
                            onChange={onInputChange}
                            disabled
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            name="age"
                            type="number"
                            value={editForm?.age || ''}
                            onChange={onInputChange}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={onSubmit}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

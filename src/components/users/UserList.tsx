import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '@/config';
import { Key, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

  interface User {
    name: string;
    email: string;
    age: number;
    status: string;
    avatar?: string;
}

export const UserList = () => {
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<User | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        axios.get(config.apiURL + '/users')
        .then(response => setUsers(response.data as any[]))
        .catch(error => console.error('Error fetching items:', error));
    }, [users]);

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setEditForm(user);
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editForm) {
            setEditForm({
                ...editForm,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async () => {
        if (!editForm || !selectedUser) return;

        try {
            const response = await axios.put(
                `${config.apiURL}/users/update?email=${encodeURI(selectedUser.email)}`, 
                editForm
            );

            setUsers(users.map(user => 
                user.email === selectedUser.email ? response.data : user
            ));
            setIsEditing(false);
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        } catch (error) {
            console.error('Error updating user:', error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        }

    };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
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
                    <Link to={`/users/${user.email}`} className="text-blue-600 hover:underline">View</Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(user)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
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
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            value={editForm?.email || ''}
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
};
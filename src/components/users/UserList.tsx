import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '@/config';
import { Eye, Edit, Plus } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface User {
    name: string;
    email: string;
    id: string;
    age: number;
    status: string;
    avatar?: string;
}

const defaultNewUser: User = {
    name: '',
    id: '',
    email: '',
    age: 0,
    status: 'Active'
};

export const UserList = () => {
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<User | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newUser, setNewUser] = useState<User>(defaultNewUser);
    const [isViewingDetails, setIsViewingDetails] = useState(false);
    const { toast } = useToast();

    const fetchUsers = async () => {
        try {
            const response = await axios.get<User[]>(config.apiURL + '/users/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setIsViewingDetails(true);
    };

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

    const handleNewUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (!editForm || !selectedUser) return;

        try {
            const response = await axios.put(
                `${config.apiURL}/users/${selectedUser.id}}` + '/', 
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
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        }
    };

    const handleCreateUser = async () => {
        try {
            await axios.post<User>(`${config.apiURL}/users/`, newUser);
            await fetchUsers();

            setIsCreating(false);
            setNewUser(defaultNewUser);
            toast({
                title: "Success",
                description: "User created successfully",
            });
        } catch (error) {
            console.error('Error creating user:', error);
            toast({
                title: "Error",
                description: "Failed to create user",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="rounded-lg border bg-card">
            <div className="p-4">
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New User
                </Button>
            </div>

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
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewDetails(user)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
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

            <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={selectedUser?.avatar ?? ''} alt={selectedUser?.name} />
                                    <AvatarFallback>{selectedUser?.name ? selectedUser.name.substring(0, 2) : ''}</AvatarFallback>
                                </Avatar>
                                <CardTitle>{selectedUser?.name}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Email</Label>
                                    <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
                                </div>
                                <div>
                                    <Label>Age</Label>
                                    <p className="text-sm text-muted-foreground">{selectedUser?.age}</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Badge
                                        variant={selectedUser?.status === "Active" ? "default" : "secondary"}
                                        className={selectedUser?.status === "Active" ? "bg-green-100 text-green-800" : ""}
                                    >
                                        {selectedUser?.status}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>

            <Dialog open={isCreating} onOpenChange={setIsCreating}>
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
                                onChange={handleNewUserInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newEmail">Email</Label>
                            <Input
                                id="newEmail"
                                name="email"
                                type="email"
                                value={newUser.email}
                                onChange={handleNewUserInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newAge">Age</Label>
                            <Input
                                id="newAge"
                                name="age"
                                type="number"
                                value={newUser.age}
                                onChange={handleNewUserInputChange}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => {
                                setIsCreating(false);
                                setNewUser(defaultNewUser);
                            }}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateUser}>
                                Create User
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

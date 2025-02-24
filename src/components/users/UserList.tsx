import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '@/config';
import { Plus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, DefaultNewUser } from '@/types/user';
import { UserTableRow } from './UserTableRow';
import { EditUserDialog } from './EditUserDialog';
import { ViewUserDialog } from './ViewUserDialog';
import { CreateUserDialog } from './CreateUserDialog';

export const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<User | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newUser, setNewUser] = useState<User>(DefaultNewUser);
    const [isViewingDetails, setIsViewingDetails] = useState(false);
    const { toast } = useToast();

    const fetchUsers = async () => {
        try {
            const response = await axios.get<User[]>(config.apiURL + '/users/');
            const userData: User[] = response.data;
            setUsers(userData);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
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
            const response = await axios.put<User>(
                `${config.apiURL}/users/${selectedUser.id}` + '/', 
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
            setNewUser(DefaultNewUser);
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

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewUser(DefaultNewUser);
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
                        <UserTableRow
                            key={index}
                            user={user}
                            onView={handleViewDetails}
                            onEdit={handleEditClick}
                        />
                    ))}
                </TableBody>
            </Table>

            <EditUserDialog
                isOpen={isEditing}
                onOpenChange={setIsEditing}
                editForm={editForm}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
            />

            <ViewUserDialog
                isOpen={isViewingDetails}
                onOpenChange={setIsViewingDetails}
                user={selectedUser}
            />

            <CreateUserDialog
                isOpen={isCreating}
                onOpenChange={setIsCreating}
                newUser={newUser}
                onInputChange={handleNewUserInputChange}
                onSubmit={handleCreateUser}
                onCancel={handleCancelCreate}
            />
        </div>
    );
};

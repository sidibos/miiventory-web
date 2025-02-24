import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import config from '@/config';

interface User {
    name: string;
    email: string;
    age: number;
}

export const UserProfile = ({ email }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<User | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();
    
    useEffect(() => {
        axios.get(`${config.apiURL}/users/${email}`)
        .then(response => setUser(response.data as any))
        .catch(error => console.error('Error fetching user:', error));
    }, [email]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editForm) {
            setEditForm({
                ...editForm,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`${config.apiURL}/users/${email}`, editForm);
            setUser(response.data as User);
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
        <div className="space-y-6">
            {user ? (
                <>
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <Dialog open={isEditing} onOpenChange={setIsEditing}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
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
                    <div className="space-y-2">
                        <p className="text-gray-600">Email: {user.email}</p>
                        <p className="text-gray-600">Age: {user.age}</p>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
            <Button
                variant="outline"
                onClick={() => navigate('/users')}
                className="mb-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users List
            </Button>
        </div>
    );
}
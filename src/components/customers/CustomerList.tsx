import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config';
import { Eye, Edit, Plus, Mail, Phone } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    status: 'active' | 'inactive';
    //avatar?: string;
}

const defaultCustomer: Customer = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    status: 'active'
};

export const CustomerList = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editForm, setEditForm] = useState<Customer>(defaultCustomer);
    const [newCustomer, setNewCustomer] = useState<Customer>(defaultCustomer);
    const { toast } = useToast();

    const fetchCustomers = async () => {
        try {
            const response = await axios.get<Customer[]>(`${config.apiURL}/customers/`);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast({
                title: "Error",
                description: "Failed to fetch customers",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleEditClick = (customer: Customer) => {
        setEditForm(customer);
        setIsEditOpen(true);
    };

    const handleViewClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsViewOpen(true);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        form: 'edit' | 'new'
    ) => {
        const { name, value } = e.target;
        if (form === 'edit') {
            setEditForm(prev => ({ ...prev, [name]: value }));
        } else {
            setNewCustomer(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdateCustomer = async () => {
        try {
            await axios.put(`${config.apiURL}/customers/${editForm.id}/`, editForm);
            await fetchCustomers();
            setIsEditOpen(false);
            toast({
                title: "Success",
                description: "Customer updated successfully",
            });
        } catch (error) {
            console.error('Error updating customer:', error);
            toast({
                title: "Error",
                description: "Failed to update customer",
                variant: "destructive",
            });
        }
    };

    const handleCreateCustomer = async () => {
        try {
            await axios.post(`${config.apiURL}/customers/`, newCustomer);
            await fetchCustomers();
            setIsCreateOpen(false);
            setNewCustomer(defaultCustomer);
            toast({
                title: "Success",
                description: "Customer created successfully",
            });
        } catch (error) {
            console.error('Error creating customer:', error);
            toast({
                title: "Error",
                description: "Failed to create customer",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="rounded-lg border bg-card">
            <div className="p-4">
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={customer.avatar} alt={customer.name} />
                                    <AvatarFallback>{customer.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{customer.name}</div>
                            </TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone}</TableCell>
                            <TableCell>{customer.company}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    customer.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {customer.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewClick(customer)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditClick(customer)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* View Customer Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Customer Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={selectedCustomer?.avatar ?? ''} alt={selectedCustomer?.name} />
                                <AvatarFallback>{selectedCustomer?.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-medium">{selectedCustomer?.name}</h3>
                                <p className="text-sm text-gray-500">{selectedCustomer?.company}</p>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>{selectedCustomer?.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span>{selectedCustomer?.phone}</span>
                            </div>
                            <div>
                                <Label>Address</Label>
                                <p className="mt-1 text-gray-600">{selectedCustomer?.address}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Customer Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Customer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                name="name"
                                value={editForm.name}
                                onChange={(e) => handleInputChange(e, 'edit')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                name="email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => handleInputChange(e, 'edit')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input
                                id="edit-phone"
                                name="phone"
                                value={editForm.phone}
                                onChange={(e) => handleInputChange(e, 'edit')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-company">Company</Label>
                            <Input
                                id="edit-company"
                                name="company"
                                value={editForm.company}
                                onChange={(e) => handleInputChange(e, 'edit')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-address">Address</Label>
                            <Input
                                id="edit-address"
                                name="address"
                                value={editForm.address}
                                onChange={(e) => handleInputChange(e, 'edit')}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateCustomer}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create Customer Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Customer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="new-name">Name</Label>
                            <Input
                                id="new-name"
                                name="name"
                                value={newCustomer.name}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-email">Email</Label>
                            <Input
                                id="new-email"
                                name="email"
                                type="email"
                                value={newCustomer.email}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-phone">Phone</Label>
                            <Input
                                id="new-phone"
                                name="phone"
                                value={newCustomer.phone}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-company">Company</Label>
                            <Input
                                id="new-company"
                                name="company"
                                value={newCustomer.company}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-address">Address</Label>
                            <Input
                                id="new-address"
                                name="address"
                                value={newCustomer.address}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsCreateOpen(false);
                                    setNewCustomer(defaultCustomer);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleCreateCustomer}>
                                Create Customer
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
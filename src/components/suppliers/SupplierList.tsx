import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config';
import { Eye, Edit, Plus, Trash, Mail, Phone, Building } from 'lucide-react';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    company_name: string;
    status: 'active' | 'inactive';
    supplier_type: 'manufacturer' | 'wholesaler' | 'distributor' | 'retailer';
}

const defaultSupplier: Supplier = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    company_name: '',
    status: 'active',
    supplier_type: 'manufacturer'
};

const supplierTypes = [
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'wholesaler', label: 'Wholesaler' },
    { value: 'distributor', label: 'Distributor' },
    { value: 'retailer', label: 'Retailer' },
] as const;

export const SupplierList = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState<Supplier>(defaultSupplier);
    const [newSupplier, setNewSupplier] = useState<Supplier>(defaultSupplier);
    const { toast } = useToast();

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get<Supplier[]>(`${config.apiURL}/suppliers/`);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            toast({
                title: "Error",
                description: "Failed to fetch suppliers",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleEditClick = (supplier: Supplier) => {
        setEditForm(supplier);
        setIsEditOpen(true);
    };

    const handleViewClick = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsViewOpen(true);
    };

    const handleDeleteClick = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsDeleteDialogOpen(true);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        form: 'edit' | 'new'
    ) => {
        const { name, value } = e.target;
        if (form === 'edit') {
            setEditForm(prev => ({ ...prev, [name]: value }));
        } else {
            setNewSupplier(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (value: string, form: 'edit' | 'new') => {
        if (form === 'edit') {
            setEditForm(prev => ({ ...prev, supplier_type: value as Supplier['supplier_type'] }));
        } else {
            setNewSupplier(prev => ({ ...prev, supplier_type: value as Supplier['supplier_type'] }));
        }
    };

    const handleUpdateSupplier = async () => {
        try {
            await axios.put(`${config.apiURL}/suppliers/${editForm.id}/`, editForm);
            await fetchSuppliers();
            setIsEditOpen(false);
            toast({
                title: "Success",
                description: "Supplier updated successfully",
            });
        } catch (error) {
            console.error('Error updating supplier:', error);
            toast({
                title: "Error",
                description: "Failed to update supplier",
                variant: "destructive",
            });
        }
    };

    const handleCreateSupplier = async () => {
        try {
            await axios.post(`${config.apiURL}/suppliers/`, newSupplier);
            await fetchSuppliers();
            setIsCreateOpen(false);
            setNewSupplier(defaultSupplier);
            toast({
                title: "Success",
                description: "Supplier created successfully",
            });
        } catch (error) {
            console.error('Error creating supplier:', error);
            toast({
                title: "Error",
                description: "Failed to create supplier",
                variant: "destructive",
            });
        }
    };

    const handleDeleteSupplier = async () => {
        if (!selectedSupplier) return;

        try {
            await axios.delete(`${config.apiURL}/suppliers/${selectedSupplier.id}/`);
            await fetchSuppliers();
            setIsDeleteDialogOpen(false);
            toast({
                title: "Success",
                description: "Supplier deleted successfully",
            });
        } catch (error) {
            console.error('Error deleting supplier:', error);
            toast({
                title: "Error",
                description: "Failed to delete supplier",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="rounded-lg border bg-card">
            <div className="p-4">
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Supplier
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
                    {suppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{supplier.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{supplier.name}</div>
                            </TableCell>
                            <TableCell>{supplier.email}</TableCell>
                            <TableCell>{supplier.phone}</TableCell>
                            <TableCell>{supplier.company_name}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    supplier.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {supplier.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewClick(supplier)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditClick(supplier)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteClick(supplier)}
                                    >
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* View Supplier Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supplier Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback>{selectedSupplier?.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-medium">{selectedSupplier?.name}</h3>
                                <p className="text-sm text-gray-500">{selectedSupplier?.company_name}</p>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>{selectedSupplier?.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span>{selectedSupplier?.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Building className="h-4 w-4 text-gray-500" />
                                <span>{selectedSupplier?.address}</span>
                            </div>
                            <div>
                                <Label>Type</Label>
                                <p className="mt-1 capitalize text-gray-600">{selectedSupplier?.supplier_type}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Supplier Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Supplier</DialogTitle>
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
                                id="edit-company_name"
                                name="company_name"
                                value={editForm.company_name}
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
                        <div>
                            <Label>Supplier Type</Label>
                            <Select
                                value={editForm.supplier_type}
                                onValueChange={(value) => handleSelectChange(value, 'edit')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select supplier type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {supplierTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateSupplier}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create Supplier Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Supplier</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="new-name">Name</Label>
                            <Input
                                id="new-name"
                                name="name"
                                value={newSupplier.name}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-email">Email</Label>
                            <Input
                                id="new-email"
                                name="email"
                                type="email"
                                value={newSupplier.email}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-phone">Phone</Label>
                            <Input
                                id="new-phone"
                                name="phone"
                                value={newSupplier.phone}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-company">Company</Label>
                            <Input
                                id="new-company_name"
                                name="company_name"
                                value={newSupplier.company_name}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-address">Address</Label>
                            <Input
                                id="new-address"
                                name="address"
                                value={newSupplier.address}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label>Supplier Type</Label>
                            <Select
                                value={newSupplier.supplier_type}
                                onValueChange={(value) => handleSelectChange(value, 'new')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select supplier type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {supplierTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsCreateOpen(false);
                                    setNewSupplier(defaultSupplier);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleCreateSupplier}>
                                Create Supplier
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the supplier
                            and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSupplier} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
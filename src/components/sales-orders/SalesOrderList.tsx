
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '@/config';
import { Eye, Edit, Plus, Trash } from 'lucide-react';
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

interface Customer {
    id: string;
    name: string;
    email: string;
    company_name: string;
}

interface SalesOrder {
    id: string;
    order_number: string;
    customer_id: string;
    total_amount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    order_date: string;
    shipping_address: string;
    notes?: string;
}

const defaultSalesOrder: SalesOrder = {
    id: '',
    order_number: '',
    customer_id: '',
    total_amount: 0,
    status: 'pending',
    order_date: new Date().toISOString().split('T')[0],
    shipping_address: '',
    notes: ''
};

const orderStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
] as const;

const ITEMS_PER_PAGE = 10;

export const SalesOrderList = () => {
    const navigate = useNavigate();
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState<SalesOrder>(defaultSalesOrder);
    const [newOrder, setNewOrder] = useState<SalesOrder>(defaultSalesOrder);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { toast } = useToast();

    const fetchCustomers = async () => {
        try {
            const response = await axios.get<Customer[]>(`${config.apiURL}/customers${config.slash}`);
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

    const fetchSalesOrders = async (page: number) => {
        try {
            const response = await axios.get<{ data: SalesOrder[], total: number }>(
                `${config.apiURL}/sales-orders/?page=${page}&limit=${ITEMS_PER_PAGE}`
            );
            setSalesOrders(response.data.data);
            let totalPages = Math.ceil(response.data.total / ITEMS_PER_PAGE) || 1;
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error fetching sales orders:', error);
            toast({
                title: "Error",
                description: "Failed to fetch sales orders",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchCustomers();
        fetchSalesOrders(currentPage);
    }, [currentPage]);

    const getCustomerName = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        return customer ? customer.name : 'Unknown Customer';
    };

    const handleEditClick = (order: SalesOrder) => {
        setEditForm(order);
        setIsEditOpen(true);
    };

    const handleViewClick = (order: SalesOrder) => {
        setSelectedOrder(order);
        setIsViewOpen(true);
    };

    const handleDeleteClick = (order: SalesOrder) => {
        setSelectedOrder(order);
        setIsDeleteDialogOpen(true);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        form: 'edit' | 'new'
    ) => {
        const { name, value } = e.target;
        const processedValue = name === 'total_amount' 
            ? parseFloat(value) 
            : value;
            
        if (form === 'edit') {
            setEditForm(prev => ({ ...prev, [name]: processedValue }));
        } else {
            setNewOrder(prev => ({ ...prev, [name]: processedValue }));
        }
    };

    const handleSelectChange = (value: string, field: string, form: 'edit' | 'new') => {
        if (form === 'edit') {
            setEditForm(prev => ({ ...prev, [field]: value }));
        } else {
            setNewOrder(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleUpdateOrder = async () => {
        try {
            await axios.put(`${config.apiURL}/sales-orders/${editForm.id}${config.slash}`, editForm);
            await fetchSalesOrders(currentPage);
            setIsEditOpen(false);
            toast({
                title: "Success",
                description: "Sales order updated successfully",
            });
        } catch (error) {
            console.error('Error updating sales order:', error);
            toast({
                title: "Error",
                description: "Failed to update sales order",
                variant: "destructive",
            });
        }
    };

    const handleCreateOrder = async () => {
        try {
            await axios.post(`${config.apiURL}/sales-orders${config.slash}`, newOrder);
            await fetchSalesOrders(currentPage);
            setIsCreateOpen(false);
            setNewOrder(defaultSalesOrder);
            toast({
                title: "Success",
                description: "Sales order created successfully",
            });
        } catch (error) {
            console.error('Error creating sales order:', error);
            toast({
                title: "Error",
                description: "Failed to create sales order",
                variant: "destructive",
            });
        }
    };

    const handleDeleteOrder = async () => {
        if (!selectedOrder) return;

        try {
            await axios.delete(`${config.apiURL}/sales-orders/${selectedOrder.id}${config.slash}`);
            await fetchSalesOrders(currentPage);
            setIsDeleteDialogOpen(false);
            toast({
                title: "Success",
                description: "Sales order deleted successfully",
            });
        } catch (error) {
            console.error('Error deleting sales order:', error);
            toast({
                title: "Error",
                description: "Failed to delete sales order",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="rounded-lg border bg-card">
            <div className="p-4">
                <Button onClick={() => navigate('/sales-orders/add')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sales Order
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {salesOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.order_number}</TableCell>
                            <TableCell>{getCustomerName(order.customer_id)}</TableCell>
                            <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                            <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    order.status === 'completed' 
                                        ? 'bg-green-100 text-green-800'
                                        : order.status === 'processing'
                                        ? 'bg-blue-100 text-blue-800'
                                        : order.status === 'cancelled'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewClick(order)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditClick(order)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteClick(order)}
                                    >
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sales Order Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">Order #{selectedOrder?.order_number}</h3>
                            <p className="text-sm text-gray-500">
                                Customer: {selectedOrder ? getCustomerName(selectedOrder.customer_id) : ''}
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div>
                                <Label>Order Date</Label>
                                <p className="text-gray-600">
                                    {selectedOrder ? new Date(selectedOrder.order_date).toLocaleDateString() : ''}
                                </p>
                            </div>
                            <div>
                                <Label>Total Amount</Label>
                                <p className="text-gray-600">
                                    ${selectedOrder?.total_amount.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <Label>Status</Label>
                                <p className="text-gray-600 capitalize">{selectedOrder?.status}</p>
                            </div>
                            <div>
                                <Label>Shipping Address</Label>
                                <p className="text-gray-600">{selectedOrder?.shipping_address}</p>
                            </div>
                            <div>
                                <Label>Notes</Label>
                                <p className="text-gray-600">{selectedOrder?.notes || 'No notes'}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Sales Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Customer</Label>
                            <Select
                                value={editForm.customer_id}
                                onValueChange={(value) => handleSelectChange(value, 'customer_id', 'edit')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-total">Total Amount</Label>
                            <Input
                                id="edit-total"
                                name="total_amount"
                                type="number"
                                step="0.01"
                                value={editForm.total_amount}
                                onChange={(e) => handleInputChange(e, 'edit')}
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={editForm.status}
                                onValueChange={(value) => handleSelectChange(value, 'status', 'edit')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {orderStatuses.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-address">Shipping Address</Label>
                            <Input
                                id="edit-address"
                                name="shipping_address"
                                value={editForm.shipping_address}
                                onChange={(e) => handleInputChange(e, 'edit')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-notes">Notes</Label>
                            <Input
                                id="edit-notes"
                                name="notes"
                                value={editForm.notes}
                                onChange={(e) => handleInputChange(e, 'edit')}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateOrder}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Sales Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Customer</Label>
                            <Select
                                value={newOrder.customer_id}
                                onValueChange={(value) => handleSelectChange(value, 'customer_id', 'new')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="new-order-number">Order Number</Label>
                            <Input
                                id="new-order-number"
                                name="order_number"
                                value={newOrder.order_number}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-total">Total Amount</Label>
                            <Input
                                id="new-total"
                                name="total_amount"
                                type="number"
                                step="0.01"
                                value={newOrder.total_amount}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={newOrder.status}
                                onValueChange={(value) => handleSelectChange(value, 'status', 'new')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {orderStatuses.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="new-address">Shipping Address</Label>
                            <Input
                                id="new-address"
                                name="shipping_address"
                                value={newOrder.shipping_address}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-notes">Notes</Label>
                            <Input
                                id="new-notes"
                                name="notes"
                                value={newOrder.notes}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsCreateOpen(false);
                                    setNewOrder(defaultSalesOrder);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleCreateOrder}>
                                Create Order
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the sales order
                            and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
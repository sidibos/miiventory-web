
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { Eye, Edit, Plus, Trash } from 'lucide-react';
import config from '@/config';

interface PurchaseOrder {
    id: string;
    order_number: string;
    customer_id: string;
    total_amount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    order_date: string;
    shipping_address: string;
    notes?: string;
}

const ITEMS_PER_PAGE = 10;

export const PurchaseOrderList = () => {
    const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
    const navigate = useNavigate();
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchPurchaseOrders = async (page: number) => {
        try {
            const response = await axios.get<{ data: PurchaseOrder[], total: number }>(
                `${config.apiURL}/purchase-orders/?currentPage=${page}&limit=${ITEMS_PER_PAGE}`
            );
            setPurchaseOrders(response.data.data);
            setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE) || 1);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching purchase orders:', error);
            toast({
                title: "Error",
                description: "Failed to fetch purchase orders",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchPurchaseOrders(currentPage);
    }, [currentPage]);

    const handleDelete = async () => {
        if (!deleteOrderId) return;

        try {
            await axios.delete(`${config.apiURL}/purchase-orders/${deleteOrderId}${config.slash}`);
            toast({
                title: "Success",
                description: "Purchase order deleted successfully",
            });
            fetchPurchaseOrders(currentPage);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete purchase order",
                variant: "destructive",
            });
        }
        setDeleteOrderId(null);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between mb-4">
                <Button onClick={() => navigate('/purchase-orders/add')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Purchase Order
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchaseOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                                <TableCell className="capitalize">{order.status}</TableCell>
                                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                                <TableCell className="flex space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/purchase-orders/${order.id}`)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/purchase-orders/edit/${order.id}`)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setDeleteOrderId(order.id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

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

            <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the purchase order.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

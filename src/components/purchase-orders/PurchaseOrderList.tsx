import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "@/config";
import { Search } from "lucide-react";

interface PurchaseOrder {
    id: string;
    orderNumber: string;
    supplier: string;
    orderDate: string;
    deliveryDate: string;
    totalAmount: number;
    status: string;
}

const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
    const response = await axios.get(`${config.apiURL}/purchase-orders${config.slash}`);
    return response.data;
};

const PurchaseOrderList = () => {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['purchase-orders'],
        queryFn: fetchPurchaseOrders
    });

    const [searchTerm, setSearchTerm] = useState("");

    const filteredOrders = orders?.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div>Loading purchase orders...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search by order number or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Number</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Delivery Date</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders?.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.orderNumber}</TableCell>
                                <TableCell>{order.supplier}</TableCell>
                                <TableCell>{order.orderDate}</TableCell>
                                <TableCell>{order.deliveryDate}</TableCell>
                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export { PurchaseOrderList };

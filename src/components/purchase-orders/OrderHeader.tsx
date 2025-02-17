import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Supplier } from '@/types/supplier';

interface OrderHeaderProps {
    suppliers: Supplier[];
    selectedSupplierId: string;
    orderStatus: string;
    onSupplierChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

const orderStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
];

export const OrderHeader = ({
    suppliers,
    selectedSupplierId,
    orderStatus,
    onSupplierChange,
    onStatusChange
}: OrderHeaderProps) => {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <Label>Supplier</Label>
                <Select
                    value={selectedSupplierId}
                    onValueChange={onSupplierChange}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                        {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name} - {supplier.company_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Order Status</Label>
                <Select
                    value={orderStatus}
                    onValueChange={onStatusChange}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {orderStatusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
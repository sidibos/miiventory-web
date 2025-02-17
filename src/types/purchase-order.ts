export interface PurchaseOrder {
    id: string;
    supplier_id: string;
    order_date: string;
    status: 'pending' | 'approved' | 'completed' | 'cancelled';
    total_amount: number;
    total_items: number;
    products: PurchaseOrderProduct[];
}

export interface PurchaseOrderProduct {
    product_id: string;
    quantity: number;
    price: number;
}
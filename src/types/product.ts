
export interface Product {
    id: string;
    name: string;
    price: number;
    sku: string;
    stock: number;
}

export interface SelectedProduct extends Product {
    quantity: number;
    supplier_id: string;
}

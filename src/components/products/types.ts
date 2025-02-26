export interface ProductFormData {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    sku: string;
    stock: number;
    min_stock: number;
    selling_price: number;
    supplier: string;
    category: string;
    status: 'active' | 'inactive' | 'pending';
    image: File | null;
}

export const defaultProduct: ProductFormData = {
    id: '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    sku: '',
    stock: 0,
    min_stock: 0,
    selling_price: 0,
    supplier: '',
    category: '',
    status: 'pending',
    image: null
};
export interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    company_name: string;
    status: 'active' | 'inactive';
    supplier_type: 'manufacturer' | 'wholesaler' | 'distributor' | 'retailer';
}
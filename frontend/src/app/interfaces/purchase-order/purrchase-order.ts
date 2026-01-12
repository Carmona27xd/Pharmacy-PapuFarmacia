export interface PurchaseOrder {
    id?: string;
    licence_supplier: string;
    detail: string;
    description: string;
    total_amount: number;
    created_at?: string
    date?: string;
}

export interface CreatePurchaseOrderDTO {
    licence_supplier: string;
    detail: string;
    description: string;
    total_amount: number;
    date: string
}
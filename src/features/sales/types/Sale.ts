export interface SaleItem {
  productId: string;
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  saleType: 'unit' | 'blister' | 'box';
  subtotal: number;
  unitsPerSale: number; 
  paymentType: string;
}

export interface Sale {
  items: SaleItem[];
  total: number;
  paymentType: string;
}
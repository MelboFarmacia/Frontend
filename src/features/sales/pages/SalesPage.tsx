import { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import BarcodeScanner from '../components/BarcodeScanner';
import SaleItems from '../components/SaleItems';
import ProductQuantityModal from '../components/ProductQuantityModal';
import { SaleItem } from '../types/Sale';
import { toast } from 'react-hot-toast';
import { findProductByBarcodeService, updateStockService } from '../services/salesService';
import { Product } from '../../../features/products/types/Product';
import { addSaleToReport } from '../../../features/reports/services/reportService';
import React from 'react';

export default function SalesPage() {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<string>('');

  const handleScan = async (barcode: string) => {
    try {
      const product = await findProductByBarcodeService(barcode);
      if (!product) {
        toast.error('Producto no encontrado');
        return;
      }
      setSelectedProduct(product);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Error al buscar producto');
    }
  };

  const calculateUnitsToDeduct = (quantity: number, saleType: 'unit' | 'blister' | 'box', product: Product) => {
    switch (saleType) {
      case 'unit':
        return quantity;
      case 'blister':
        return quantity;
      case 'box':
        return quantity;
      default:
        return quantity;
    }
  };

  const handleAddProduct = async (quantity: number, saleType: 'unit' | 'blister' | 'box') => {
    if (!selectedProduct) return;

    const price = selectedProduct.prices[saleType];
    if (!price) {
      toast.error('Precio no disponible para este tipo de venta');
      return;
    }

    const unitsToDeduct = calculateUnitsToDeduct(quantity, saleType, selectedProduct);
    
    if (unitsToDeduct > selectedProduct.stock.units) {
      toast.error('Stock insuficiente');
      return;
    }

    const newItem: SaleItem = {
      productId: selectedProduct._id,
      barcode: selectedProduct.barcode,
      name: selectedProduct.name,
      price,
      quantity,
      saleType,
      unitsPerSale: unitsToDeduct / quantity,
      subtotal: price * quantity,
      paymentType: paymentType
    };

    setSaleItems([...saleItems, newItem]);
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleRemoveItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = async (index: number, newQuantity: number) => {
    try {
      const item = saleItems[index];
      const product = await findProductByBarcodeService(item.barcode);
      
      if (!product) {
        toast.error('Producto no encontrado');
        return;
      }

      const unitsToDeduct = calculateUnitsToDeduct(newQuantity, item.saleType, product);
      
      if (unitsToDeduct > product.stock.units) {
        toast.error('Stock insuficiente');
        return;
      }

      const updatedItems = [...saleItems];
      updatedItems[index] = {
        ...item,
        quantity: newQuantity,
        subtotal: item.price * newQuantity,
        unitsPerSale: unitsToDeduct / newQuantity
      };
      setSaleItems(updatedItems);
    } catch (error) {
      toast.error('Error al actualizar cantidad');
    }
  };

  const handleFinalizeSale = async () => {
    if (saleItems.length === 0) {
      toast.error('No hay productos en la venta');
      return;
    }
    if (!paymentType) {
      toast.error('Selecciona un tipo de pago');
      return;
    }

    try {
      // Actualizar el stock de cada producto
      for (const item of saleItems) {
        const totalUnits = item.quantity * item.unitsPerSale;
        console.log(totalUnits, item.productId, item.saleType);
        await updateStockService(item.productId, totalUnits, item.saleType);
      }

      // Calcular el total de la venta
      const total = saleItems.reduce((sum, item) => sum + item.subtotal, 0);

      // Agregar la venta al reporte actua l
      await addSaleToReport({
        items: saleItems,
        total,
        paymentType, 
        createdAt: new Date().toISOString()
      });

      toast.success('Venta finalizada con éxito');
      setSaleItems([]);
      setPaymentType(''); 
    } catch (error) {
      console.error('Error en la venta:', error);
    }
  };

  const handleCancelSale = () => {
    setSaleItems([]);
    toast.success('Venta cancelada');
  };

  const total = saleItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Nueva Venta</h1>
        
        <BarcodeScanner onScan={handleScan} />
        
        {saleItems.length > 0 && (
          <>
            <SaleItems 
              items={saleItems} 
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-xl font-bold">
                Total: Q{total.toFixed(2)}
              </div>
              
              <div className="space-x-4">
                <button
                  onClick={handleCancelSale}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                >
                  Cancelar Venta
                </button>
                <button
                  onClick={handleFinalizeSale}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Finalizar Venta
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-medium mb-2">Tipo de Pago:</label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    value="efectivo"
                    checked={paymentType === 'efectivo'}
                    onChange={() => setPaymentType('efectivo')}
                  />
                  <span className="ml-2">Efectivo</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    value="TC"
                    checked={paymentType === 'TC'}
                    onChange={() => setPaymentType('TC')}
                  />
                  <span className="ml-2">Tarjeta C</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    value="transferencia"
                    checked={paymentType === 'transferencia'}
                    onChange={() => setPaymentType('transferencia')}
                  />
                  <span className="ml-2">Transferencia</span>
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && selectedProduct && (
        <ProductQuantityModal
          product={selectedProduct}
          onConfirm={handleAddProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </MainLayout>
  );
}

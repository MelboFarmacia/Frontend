import { useState } from 'react';
import { Product } from '../../../features/products/types/Product';
import React from 'react';

interface ProductQuantityModalProps {
  product: Product;
  onConfirm: (quantity: number, saleType: 'unit' | 'blister' | 'box') => void;
  onClose: () => void;
}

export default function ProductQuantityModal({
  product,
  onConfirm,
  onClose
}: ProductQuantityModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [saleType, setSaleType] = useState<'unit' | 'blister' | 'box'>(
    product.sellOptions.unit ? 'unit' :
    product.sellOptions.blister ? 'blister' :
    'box'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(quantity, saleType);
  };

  const formatPrice = (price?: number) => {
    return price ? `Q${price.toFixed(2)}` : '-';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">{product.name}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Venta
            </label>
            <select
              value={saleType}
              onChange={(e) => setSaleType(e.target.value as 'unit' | 'blister' | 'box')}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {product.sellOptions.unit && (
                <option value="unit">Unidad - {formatPrice(product.prices.unit)}</option>
              )}
              {product.sellOptions.blister && (
                <option value="blister">Blister - {formatPrice(product.prices.blister)}</option>
              )}
              {product.sellOptions.box && (
                <option value="box">Caja - {formatPrice(product.prices.box)}</option>
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-600">
              Precio unitario: {formatPrice(product.prices[saleType])}
            </p>
            <p className="text-lg font-medium text-gray-900">
              Total: {formatPrice((product.prices[saleType] || 0) * quantity)}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
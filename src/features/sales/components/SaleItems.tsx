import React from 'react';
import { SaleItem } from '../types/Sale';

interface SaleItemsProps {
  items: SaleItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

export default function SaleItems({ items, onRemoveItem, onUpdateQuantity }: SaleItemsProps) {
  const formatCurrency = (amount: number) => `Q${amount.toFixed(2)}`;

  return (
    <div className="mt-6">
      {/* Vista móvil */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {items.map((item, index) => (
          <div 
            key={`${item.productId}-${index}`}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>Tipo: <span className="capitalize">{item.saleType}</span></p>
                  <p>Precio: {formatCurrency(item.price)}</p>
                  <div className="flex items-center gap-2">
                    <span>Cantidad:</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(index, parseInt(e.target.value, 10))}
                      className="w-20 px-2 py-1 border rounded-md"
                    />
                  </div>
                  <p className="font-medium">Subtotal: {formatCurrency(item.subtotal)}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(index)}
                className="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vista desktop */}
      <div className="hidden sm:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={`${item.productId}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(index, parseInt(e.target.value, 10))}
                    className="w-20 px-2 py-1 border rounded-md"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.saleType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.subtotal)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
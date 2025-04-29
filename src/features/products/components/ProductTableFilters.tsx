import React from 'react';
import TypeFilter from './TypeFilter';

interface ProductTableFiltersProps {
  onSortChange: (value: string) => void;
  onPharmaceuticalCompanyChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  availableTypes: string[];
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  onTypeFilter: () => void;
}

export default function ProductTableFilters({
  onSortChange,
  onPharmaceuticalCompanyChange,
  onClearFilters,
  hasActiveFilters,
  availableTypes,
  selectedTypes,
  onTypesChange,
  onTypeFilter,
}: ProductTableFiltersProps) {
  return (
    <div className="flex gap-4 mb-4 items-center">
      <select
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 border rounded-md text-gray-700"
        defaultValue=""
      >
        <option value="">Todos los productos</option>
        <option value="name-asc">Nombre (A-Z)</option>
        <option value="name-desc">Nombre (Z-A)</option>
        <option value="expired">Productos Vencidos</option>
        <option value="near-expiry">Próximos a Vencer (6 meses)</option>
        <option value="low-stock">Poco Stock (≤10 unidades)</option>
      </select>

      <TypeFilter
        types={availableTypes}
        selectedTypes={selectedTypes}
        onTypeChange={onTypesChange}
        onFilter={() => {
          onTypeFilter();  // Solo llamar la función, no imprimir su valor
        }}
      />

      <input
        type="text"
        placeholder="Buscar por casa farmacéutica..."
        onChange={(e) => onPharmaceuticalCompanyChange(e.target.value)}
        className="px-3 py-2 border rounded-md text-gray-700 flex-1"
      />

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="px-3 py-2 text-red-600 hover:text-red-700 font-medium"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
} 
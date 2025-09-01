import React from 'react';
import { Order, GrantType, CallStatus, USMStatus } from '../types';

export interface FiltersState {
  searchTerm: string;
  order: string;
  type: string;
  callStatus: string;
  usmStatus: string;
  minAmount: string;
  maxAmount: string;
  startDate: string;
  endDate: string;
}

interface FilterBarProps {
  filters: FiltersState;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onResetFilters: () => void;
}

const FilterInput: React.FC<{ label: string; name: string; children: React.ReactNode }> = ({ label, name, children }) => (
    <div>
        <label htmlFor={`filter-${name}`} className="block text-sm font-medium text-slate-600 mb-1">
            {label}
        </label>
        {children}
    </div>
);

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onResetFilters }) => {

    const inputClass = "w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-base py-2 px-3 bg-white";

  return (
    <div className="mb-8 bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        
        <div className="sm:col-span-2 lg:col-span-4 xl:col-span-1">
            <FilterInput label="Buscar por nombre, entidad..." name="searchTerm">
                <input
                    type="text"
                    id="filter-searchTerm"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={onFilterChange}
                    placeholder="Ej: Innovación, Minciencias..."
                    className={inputClass}
                />
            </FilterInput>
        </div>

        <FilterInput label="Estado Convocatoria" name="callStatus">
            <select id="filter-callStatus" name="callStatus" onChange={onFilterChange} value={filters.callStatus} className={inputClass}>
                <option value="">Todos</option>
                {Object.values(CallStatus).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </FilterInput>

        <FilterInput label="Estado USM" name="usmStatus">
            <select id="filter-usmStatus" name="usmStatus" onChange={onFilterChange} value={filters.usmStatus} className={inputClass}>
                <option value="">Todos</option>
                {Object.values(USMStatus).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </FilterInput>
        
        <FilterInput label="Orden" name="order">
            <select id="filter-order" name="order" onChange={onFilterChange} value={filters.order} className={inputClass}>
                <option value="">Todos</option>
                {Object.values(Order).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </FilterInput>

        <FilterInput label="Tipo" name="type">
            <select id="filter-type" name="type" onChange={onFilterChange} value={filters.type} className={inputClass}>
                <option value="">Todos</option>
                {Object.values(GrantType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </FilterInput>

        {/* Amount Range */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
            <FilterInput label="Monto Mínimo" name="minAmount">
                <input
                    type="number"
                    id="filter-minAmount"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={onFilterChange}
                    placeholder="Ej: 50000"
                    className={inputClass}
                />
            </FilterInput>
             <FilterInput label="Monto Máximo" name="maxAmount">
                <input
                    type="number"
                    id="filter-maxAmount"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={onFilterChange}
                    placeholder="Ej: 200000"
                    className={inputClass}
                />
            </FilterInput>
        </div>

        {/* Date Range */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
            <FilterInput label="Fecha Límite Desde" name="startDate">
                <input
                    type="date"
                    id="filter-startDate"
                    name="startDate"
                    value={filters.startDate}
                    onChange={onFilterChange}
                    className={inputClass}
                />
            </FilterInput>
            <FilterInput label="Fecha Límite Hasta" name="endDate">
                <input
                    type="date"
                    id="filter-endDate"
                    name="endDate"
                    value={filters.endDate}
                    onChange={onFilterChange}
                    className={inputClass}
                />
            </FilterInput>
        </div>

      </div>
      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
            <button
                onClick={onResetFilters}
                className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors text-sm"
            >
                Limpiar Filtros
            </button>
        </div>
    </div>
  );
};

export default FilterBar;

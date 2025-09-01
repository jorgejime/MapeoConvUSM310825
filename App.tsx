import React, { useState } from 'react';
import { Grant, GrantFormData } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import GrantCard from './components/GrantCard';
import GrantForm from './components/GrantForm';
import FilterBar, { FiltersState } from './components/FilterBar';
import ImportModal from './components/ImportModal';

const initialFilters: FiltersState = {
  searchTerm: '',
  order: '',
  type: '',
  callStatus: '',
  usmStatus: '',
  minAmount: '',
  maxAmount: '',
  startDate: '',
  endDate: '',
};

const App: React.FC = () => {
  const [grants, setGrants] = useLocalStorage<Grant[]>('grants', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  const handleOpenModal = (grant: Grant | null = null) => {
    setEditingGrant(grant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingGrant(null);
    setIsModalOpen(false);
  };
  
  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  const handleSaveGrant = (grantData: Omit<Grant, 'id'>, id: string | null) => {
    if (id) {
      setGrants(prevGrants => prevGrants.map(g => g.id === id ? { ...grantData, id } : g));
    } else {
      const newGrant: Grant = { ...grantData, id: crypto.randomUUID() };
      setGrants(prevGrants => [...prevGrants, newGrant]);
    }
    handleCloseModal();
  };
  
  const handleImportGrants = (newGrantsData: GrantFormData[]) => {
    const newGrants: Grant[] = newGrantsData.map(grantData => ({
      ...grantData,
      id: crypto.randomUUID(),
    }));
    setGrants(prevGrants => [...prevGrants, ...newGrants]);
    // The modal will close itself upon success message.
  };

  const handleDeleteGrant = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta convocatoria?')) {
        setGrants(prevGrants => prevGrants.filter(g => g.id !== id));
    }
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const sortedGrants = [...grants].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const filteredGrants = sortedGrants.filter(grant => {
    const { searchTerm, order, type, callStatus, usmStatus, minAmount, maxAmount, startDate, endDate } = filters;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const textMatch = !searchTerm ||
      grant.name.toLowerCase().includes(lowerSearchTerm) ||
      grant.entity.toLowerCase().includes(lowerSearchTerm) ||
      grant.sector.toLowerCase().includes(lowerSearchTerm);

    const orderMatch = !order || grant.order === order;
    const typeMatch = !type || grant.type === type;
    const callStatusMatch = !callStatus || grant.callStatus === callStatus;
    const usmStatusMatch = !usmStatus || grant.usmStatus === usmStatus;

    const minAmountNum = parseFloat(minAmount);
    const maxAmountNum = parseFloat(maxAmount);
    const minAmountMatch = !minAmount || isNaN(minAmountNum) || grant.amount >= minAmountNum;
    const maxAmountMatch = !maxAmount || isNaN(maxAmountNum) || grant.amount <= maxAmountNum;

    const grantDeadline = new Date(grant.deadline);
    const startDateMatch = !startDate || grantDeadline >= new Date(startDate);
    const endDateMatch = !endDate || grantDeadline <= new Date(endDate);
    
    return textMatch && orderMatch && typeMatch && callStatusMatch && usmStatusMatch && minAmountMatch && maxAmountMatch && startDateMatch && endDateMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onAdd={() => handleOpenModal()} onImport={handleOpenImportModal} />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        {grants.length > 0 && (
          <FilterBar 
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        )}
        
        {grants.length > 0 ? (
          filteredGrants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGrants.map(grant => (
                <GrantCard
                  key={grant.id}
                  grant={grant}
                  onEdit={() => handleOpenModal(grant)}
                  onDelete={() => handleDeleteGrant(grant.id)}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-24 px-6">
                <div className="mx-auto w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-sky-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-700">No se encontraron convocatorias</h2>
                <p className="text-slate-500 mt-3 max-w-md mx-auto">Prueba a cambiar o eliminar los filtros para encontrar lo que buscas.</p>
            </div>
          )
        ) : (
          <div className="text-center py-24 px-6">
             <div className="mx-auto w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-sky-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-700">Comienza a registrar convocatorias</h2>
            <p className="text-slate-500 mt-3 max-w-md mx-auto">Haz clic en el botón para agregar tu primera oportunidad de financiación y mantener todo organizado.</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-8 bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
            >
              Agregar la primera convocatoria
            </button>
          </div>
        )}
      </main>
      <GrantForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGrant}
        initialData={editingGrant}
      />
      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={handleCloseImportModal}
        onImport={handleImportGrants}
      />
    </div>
  );
};

export default App;
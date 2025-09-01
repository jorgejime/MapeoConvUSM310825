import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { UploadIcon } from './icons/UploadIcon';

interface HeaderProps {
  onAdd: () => void;
  onImport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAdd, onImport }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Registro de Convocatorias
        </h1>
        <div className="flex items-center gap-2">
           <button
              onClick={onImport}
              className="bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-sm border border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
              aria-label="Importar convocatorias desde CSV"
            >
              <UploadIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Importar</span>
            </button>
            <button
              onClick={onAdd}
              className="bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
              aria-label="Agregar nueva convocatoria"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Agregar Convocatoria</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
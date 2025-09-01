import React, { useState, useEffect } from 'react';
import { Grant, Currency, RequirementStatus, CallStatus, USMStatus, GrantFormData, Order, GrantType } from '../types';
import { XIcon } from './icons/XIcon';

interface GrantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (grant: Omit<Grant, 'id'>, id: string | null) => void;
  initialData: Grant | null;
}

const initialFormState: GrantFormData = {
  name: '',
  entity: '',
  order: Order.NATIONAL,
  type: GrantType.SUBVENCION,
  sector: '',
  components: '',
  amount: 0,
  currency: Currency.COP,
  meetsRequirements: RequirementStatus.NO,
  missingRequirements: '',
  deadline: '',
  link: '',
  callStatus: CallStatus.OPEN,
  usmStatus: USMStatus.PENDING,
};

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <fieldset className="border-t border-slate-200 pt-6 mt-6 first:mt-0 first:border-t-0 first:pt-0">
        <legend className="text-base font-semibold text-slate-800 -mb-2">{title}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {children}
        </div>
    </fieldset>
);

const GrantForm: React.FC<GrantFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<GrantFormData>(initialFormState);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        deadline: initialData.deadline.split('T')[0] // Format for date input
      });
    } else {
      setFormData(initialFormState);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumberInput = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumberInput ? parseFloat(value) || 0 : value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.entity.trim() || !formData.deadline) {
        alert('Por favor, completa los campos obligatorios: Nombre, Entidad y Fecha Límite.');
        return;
    }
    const dataToSave = {
        ...formData,
        amount: Number(formData.amount) || 0,
    };
    onSave(dataToSave, initialData ? initialData.id : null);
  };
  
  if (!isOpen) return null;

  const inputClass = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-base py-2.5 px-3";
  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl shadow-sky-900/20 w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-xl z-10">
          <h2 className="text-xl font-bold text-sky-800">{initialData ? 'Editar Convocatoria' : 'Nueva Convocatoria'}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} id="grant-form" className="overflow-y-auto px-4 sm:px-6 py-2 space-y-4">
            <FormSection title="Información General">
                <div className="md:col-span-2">
                  <label htmlFor="name" className={labelClass}>Nombre convocatoria*</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="entity" className={labelClass}>Entidad*</label>
                  <input type="text" id="entity" name="entity" value={formData.entity} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="order" className={labelClass}>Orden</label>
                  <select id="order" name="order" value={formData.order} onChange={handleChange} className={inputClass}>
                    {Object.values(Order).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className={labelClass}>Tipo</label>
                  <select id="type" name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                    {Object.values(GrantType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="sector" className={labelClass}>Sector/Tema</label>
                  <input type="text" id="sector" name="sector" value={formData.sector} onChange={handleChange} className={inputClass} />
                </div>
            </FormSection>

            <FormSection title="Detalles de Financiación">
                <div className="md:col-span-2">
                    <label htmlFor="components" className={labelClass}>Componentes transversales que financia</label>
                    <textarea id="components" name="components" value={formData.components} onChange={handleChange} rows={3} className={inputClass}></textarea>
                </div>
                <div>
                    <label htmlFor="amount" className={labelClass}>Monto de la convocatoria</label>
                    <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="currency" className={labelClass}>Moneda</label>
                    <select id="currency" name="currency" value={formData.currency} onChange={handleChange} className={inputClass}>
                        {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </FormSection>

            <FormSection title="Requisitos y Plazos">
                <div>
                    <label htmlFor="meetsRequirements" className={labelClass}>¿Cumplimos los requisitos?</label>
                    <select id="meetsRequirements" name="meetsRequirements" value={formData.meetsRequirements} onChange={handleChange} className={inputClass}>
                        {Object.values(RequirementStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className={formData.meetsRequirements === RequirementStatus.YES ? 'opacity-50' : ''}>
                    <label htmlFor="missingRequirements" className={labelClass}>¿Qué nos falta para cumplir?</label>
                    <input type="text" id="missingRequirements" name="missingRequirements" value={formData.missingRequirements} onChange={handleChange} className={inputClass} disabled={formData.meetsRequirements === RequirementStatus.YES} />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="deadline" className={labelClass}>Fecha límite de aplicación*</label>
                  <input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} required className={inputClass} />
                </div>
            </FormSection>

            <FormSection title="Estado y Enlaces">
                <div className="md:col-span-2">
                  <label htmlFor="link" className={labelClass}>Link convocatoria</label>
                  <input type="url" id="link" name="link" value={formData.link} placeholder="https://ejemplo.com" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="callStatus" className={labelClass}>Estado convocatoria</label>
                    <select id="callStatus" name="callStatus" value={formData.callStatus} onChange={handleChange} className={inputClass}>
                        {Object.values(CallStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="usmStatus" className={labelClass}>Estado USM</label>
                    <select id="usmStatus" name="usmStatus" value={formData.usmStatus} onChange={handleChange} className={inputClass}>
                        {Object.values(USMStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </FormSection>
        </form>

        <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 mt-auto bg-slate-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="w-full sm:w-auto bg-white text-slate-700 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors font-semibold text-base">Cancelar</button>
          <button type="submit" form="grant-form" className="w-full sm:w-auto bg-sky-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors text-base shadow-sm">Guardar Cambios</button>
        </footer>
      </div>
    </div>
  );
};

export default GrantForm;
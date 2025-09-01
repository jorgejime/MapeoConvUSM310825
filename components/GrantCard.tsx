import React from 'react';
import { Grant, CallStatus, USMStatus, RequirementStatus } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

interface GrantCardProps {
  grant: Grant;
  onEdit: () => void;
  onDelete: () => void;
}

const getStatusBadgeClass = (status: CallStatus | USMStatus) => {
  switch (status) {
    case CallStatus.OPEN:
    case USMStatus.APPROVED:
      return 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-200';
    case CallStatus.CLOSED:
    case USMStatus.REJECTED:
      return 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-200';
    case USMStatus.APPLIED:
    case CallStatus.EVALUATING:
      return 'bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-200';
    case USMStatus.PENDING:
      return 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200';
    default:
      return 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200';
  }
};

const GrantCard: React.FC<GrantCardProps> = ({ grant, onEdit, onDelete }) => {
  const deadline = new Date(grant.deadline);
  const formattedDeadline = deadline.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' // To avoid timezone issues
  });

  const isOverdue = new Date() > deadline && grant.callStatus === CallStatus.OPEN;

  const CardField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
    <div className={className}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="text-sm text-slate-800 font-medium">{children}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border border-slate-200/80">
      <div className="p-5 flex-grow">
        <h3 className="text-lg font-bold text-slate-800 leading-tight">{grant.name}</h3>
        <p className="text-sm text-slate-500 mb-4">{grant.entity}</p>

        <div className="border-t border-slate-200 my-4"></div>

        <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <p className="text-xs text-slate-500">Fecha Límite</p>
                    <p className={`font-semibold text-base ${isOverdue ? 'text-red-600' : 'text-slate-800'}`}>{formattedDeadline}</p>
                </div>
                 <div className="flex-1 text-right">
                    <p className="text-xs text-slate-500">Monto</p>
                    <p className="font-semibold text-base text-slate-800">{new Intl.NumberFormat('es-CO').format(grant.amount)} {grant.currency}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                <CardField label="Orden">{grant.order || 'N/A'}</CardField>
                <CardField label="Tipo">{grant.type || 'N/A'}</CardField>
                <CardField label="Estado Convocatoria">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${getStatusBadgeClass(grant.callStatus)}`}>
                        {grant.callStatus}
                    </span>
                </CardField>
                 <CardField label="Estado USM">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${getStatusBadgeClass(grant.usmStatus)}`}>
                        {grant.usmStatus}
                    </span>
                </CardField>
            </div>

            {grant.meetsRequirements !== RequirementStatus.YES && grant.missingRequirements && (
                <CardField label="¿Qué nos falta para cumplir?">
                     <p className="text-amber-700 bg-amber-50 p-2 rounded-md ring-1 ring-amber-200">{grant.missingRequirements}</p>
                </CardField>
            )}

            <div>
                <a href={grant.link} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800 text-sm font-semibold hover:underline break-all inline-flex items-center gap-1">
                    Ver convocatoria
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 .75-.75V5.5a.75.75 0 0 0-1.5 0v3.25H5a.75.75 0 0 0-.75.75Zm11.25 1.5a.75.75 0 0 0 0-1.5h-5.5a.75.75 0 0 0-.75.75v5.5a.75.75 0 0 0 1.5 0v-3.25H15a.75.75 0 0 0 .75-.75Z" clipRule="evenodd" /></svg>
                </a>
            </div>
        </div>
      </div>
      <div className="bg-slate-50 p-3 flex justify-end gap-2 rounded-b-xl border-t border-slate-200">
        <button
          onClick={onEdit}
          className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-sky-700 hover:bg-sky-100 rounded-full transition-colors"
          aria-label="Editar"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
          aria-label="Eliminar"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GrantCard;
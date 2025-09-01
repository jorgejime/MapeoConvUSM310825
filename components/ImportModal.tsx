import React, { useState } from 'react';
import { GrantFormData, Order, GrantType, Currency, RequirementStatus, CallStatus, USMStatus } from '../types';
import { XIcon } from './icons/XIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (grants: GrantFormData[]) => void;
}

const CSV_HEADERS = ['name', 'entity', 'order', 'type', 'sector', 'components', 'amount', 'currency', 'meetsRequirements', 'missingRequirements', 'deadline', 'link', 'callStatus', 'usmStatus'];

const isEnumValue = <T extends object>(enumObject: T, value: any): value is T[keyof T] => Object.values(enumObject).includes(value);

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetState = () => {
    setFile(null);
    setIsProcessing(false);
    setErrors([]);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetState();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const exampleRow = `"Beca Ejemplo","Fundación Futuro","${Order.NATIONAL}","${GrantType.BECA}","Educación","Componente A",50000000,"${Currency.COP}","${RequirementStatus.PARTIALLY}","Falta documento X","2025-12-31","https://ejemplo.com","${CallStatus.OPEN}","${USMStatus.PENDING}"`;
    const csvContent = "data:text/csv;charset=utf-8," + CSV_HEADERS.join(',') + "\n" + exampleRow;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla_convocatorias.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateAndTransform = (data: { [key: string]: string }[], fileName: string) => {
    const validGrants: GrantFormData[] = [];
    const validationErrors: string[] = [];

    data.forEach((row, index) => {
      const rowNum = index + 2;
      const rowErrors: string[] = [];

      // Required fields
      if (!row.name?.trim()) rowErrors.push('La columna "name" no puede estar vacía.');
      if (!row.entity?.trim()) rowErrors.push('La columna "entity" no puede estar vacía.');
      if (!row.deadline?.trim()) rowErrors.push('La columna "deadline" no puede estar vacía.');

      // Date validation
      if (row.deadline && isNaN(Date.parse(row.deadline))) {
        rowErrors.push('La columna "deadline" tiene un formato de fecha inválido (use AAAA-MM-DD).');
      }

      // Number validation
      const amount = parseFloat(row.amount);
      if (row.amount && isNaN(amount)) {
        rowErrors.push('La columna "amount" debe ser un número válido.');
      }
      
      // Enum validations
      if (row.order && !isEnumValue(Order, row.order)) rowErrors.push(`Valor inválido en "order". Permitidos: ${Object.values(Order).join(', ')}.`);
      if (row.type && !isEnumValue(GrantType, row.type)) rowErrors.push(`Valor inválido en "type". Permitidos: ${Object.values(GrantType).join(', ')}.`);
      if (row.currency && !isEnumValue(Currency, row.currency)) rowErrors.push(`Valor inválido en "currency". Permitidos: ${Object.values(Currency).join(', ')}.`);
      if (row.meetsRequirements && !isEnumValue(RequirementStatus, row.meetsRequirements)) rowErrors.push(`Valor inválido en "meetsRequirements". Permitidos: ${Object.values(RequirementStatus).join(', ')}.`);
      if (row.callStatus && !isEnumValue(CallStatus, row.callStatus)) rowErrors.push(`Valor inválido en "callStatus". Permitidos: ${Object.values(CallStatus).join(', ')}.`);
      if (row.usmStatus && !isEnumValue(USMStatus, row.usmStatus)) rowErrors.push(`Valor inválido en "usmStatus". Permitidos: ${Object.values(USMStatus).join(', ')}.`);

      if (rowErrors.length > 0) {
        validationErrors.push(`Fila ${rowNum}: ${rowErrors.join(' ')}`);
      } else {
        validGrants.push({
          name: row.name,
          entity: row.entity,
          order: (row.order as Order) || Order.NATIONAL,
          type: (row.type as GrantType) || GrantType.OTRO,
          sector: row.sector || '',
          components: row.components || '',
          amount: amount || 0,
          currency: (row.currency as Currency) || Currency.COP,
          meetsRequirements: (row.meetsRequirements as RequirementStatus) || RequirementStatus.NO,
          missingRequirements: row.missingRequirements || '',
          deadline: row.deadline,
          link: row.link || '',
          callStatus: (row.callStatus as CallStatus) || CallStatus.OPEN,
          usmStatus: (row.usmStatus as USMStatus) || USMStatus.PENDING,
        });
      }
    });

    setErrors(validationErrors);
    if (validationErrors.length === 0 && validGrants.length > 0) {
      onImport(validGrants);
      setSuccessMessage(`${validGrants.length} convocatorias importadas con éxito desde "${fileName}".`);
      setTimeout(() => handleClose(), 3000);
    } else if (validGrants.length === 0 && validationErrors.length > 0) {
       setErrors(['No se pudo importar ninguna fila. Por favor, revisa los errores.']);
    }
  };

  const handleProcessImport = async () => {
    if (!file) {
      setErrors(['Por favor, selecciona un archivo CSV.']);
      return;
    }
    setIsProcessing(true);
    setErrors([]);
    setSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      const lines = csvText.trim().split(/\r?\n/);
      const headers = lines[0].split(',').map(h => h.trim());
      
      if(JSON.stringify(headers) !== JSON.stringify(CSV_HEADERS)) {
        setErrors(['Las cabeceras del archivo CSV no coinciden con la plantilla. Por favor, descarga y utiliza la plantilla proporcionada.']);
        setIsProcessing(false);
        return;
      }
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index]?.trim() || '';
          return obj;
        }, {} as { [key: string]: string });
      });

      validateAndTransform(data, file.name);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setErrors(['Error al leer el archivo.']);
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-16 sm:pt-24 p-4" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl shadow-sky-900/20 w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-sky-800">Importar Convocatorias en Masa</h2>
          <button onClick={handleClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="px-6 py-5 overflow-y-auto">
          <div className="bg-sky-50 border border-sky-200 text-sky-800 rounded-lg p-4 text-sm mb-6">
            <h3 className="font-bold text-base mb-2">Instrucciones</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Descarga la plantilla para asegurar el formato correcto.
                <button onClick={handleDownloadTemplate} className="ml-2 text-sky-600 font-semibold hover:underline inline-flex items-center gap-1">
                    <DownloadIcon className="w-4 h-4" />
                    Descargar Plantilla
                </button>
              </li>
              <li>Llena la plantilla con tus datos. <b>Importante:</b> No uses comas (,) dentro de los campos.</li>
              <li>Sube el archivo CSV completo para importar los datos.</li>
            </ol>
          </div>

          <div>
            <label htmlFor="csv-upload" className="block text-sm font-medium text-slate-700 mb-1">Archivo CSV</label>
            <input 
              id="csv-upload"
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            />
          </div>

          {isProcessing && <div className="text-center my-4">Procesando...</div>}
          
          {successMessage && (
              <div className="mt-4 p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg text-sm">
                  {successMessage}
              </div>
          )}

          {errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm max-h-40 overflow-y-auto">
              <h4 className="font-bold mb-2">Se encontraron errores:</h4>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, i) => <li key={i}>{error}</li>)}
              </ul>
            </div>
          )}

        </main>

        <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-6 py-4 border-t border-slate-200 mt-auto bg-slate-50 rounded-b-xl">
          <button type="button" onClick={handleClose} className="w-full sm:w-auto bg-white text-slate-700 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors font-semibold">Cancelar</button>
          <button 
            type="button" 
            onClick={handleProcessImport}
            disabled={!file || isProcessing || !!successMessage}
            className="w-full sm:w-auto bg-sky-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Importar Archivo
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ImportModal;
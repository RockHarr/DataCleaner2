
import React, { useState, useRef, useCallback } from 'react';
import type { UploadSuccessData } from '../../types';
import { parseCsv } from '../../services/csvService';
import { UploadIcon, CheckCircleIcon, XCircleIcon } from '../icons';

interface UploadAreaProps {
  projectId: string;
  onUploadSuccess: (upload: UploadSuccessData) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ projectId, onUploadSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setMessage(`Subiendo ${file.name}...`);

    try {
      // Simulate API call for upload
      // In a real app, this would be a fetch call to /api/uploads
      const { headers, rows } = await parseCsv(file);

      const uploadId = `upload_${Date.now()}`;
      const uploadData: UploadSuccessData = {
        uploadId: uploadId,
        filename: file.name,
        headers,
        rowsCount: rows.length,
        rows: rows
      };
      
      onUploadSuccess(uploadData);
      setStatus('success');
      setMessage(`'${file.name}' subido con éxito.`);
      
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : "Error desconocido al subir el archivo.");
    } finally {
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  }, [onUploadSuccess, projectId]);
  
  return (
    <div className="w-full">
      <div 
        className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileChange}
          disabled={status === 'uploading'}
        />
        <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
          <UploadIcon className="w-12 h-12 mb-2" />
          <p className="font-semibold">Haz clic para subir un archivo CSV</p>
          <p className="text-sm">o arrástralo aquí</p>
        </div>
      </div>
      {message && (
        <div className="mt-4 flex items-center space-x-2 text-sm">
          {status === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
          {status === 'error' && <XCircleIcon className="w-5 h-5 text-red-500" />}
          <span className={`${status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>{message}</span>
        </div>
      )}
    </div>
  );
};

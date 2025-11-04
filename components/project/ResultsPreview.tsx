
import React from 'react';
import type { Row, CleaningStats } from '../../types';
import { unparseCsv, downloadCsv } from '../../services/csvService';

interface ResultsPreviewProps {
  fields: string[];
  rows: Row[];
  stats: CleaningStats | null;
}

const PREVIEW_ROW_COUNT = 50;

export const ResultsPreview: React.FC<ResultsPreviewProps> = ({ fields, rows, stats }) => {
  if (rows.length === 0) return null;

  const handleDownload = () => {
    const csvString = unparseCsv(fields, rows);
    downloadCsv('datacleaner_resultado_limpio.csv', csvString);
  };
  
  const previewRows = rows.slice(0, PREVIEW_ROW_COUNT);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resultados Limpios y Consolidados</h3>
          {stats && <p className="text-sm text-gray-500 dark:text-gray-400">{stats.totalRows} filas procesadas.</p>}
        </div>
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Descargar CSV Limpio
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Mostrando las primeras {previewRows.length} de {rows.length} filas.
      </p>

      <div className="overflow-x-auto bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {fields.map(field => (
                <th key={field} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{field}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {previewRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {fields.map(field => (
                  <td key={`${rowIndex}-${field}`} className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{String(row[field] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

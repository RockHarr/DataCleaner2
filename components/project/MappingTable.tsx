
import React, { useState, useEffect } from 'react';
import type { MappingState, SourceInfo } from '../../types';
import { PlusIcon, TrashIcon } from '../icons';

interface MappingTableProps {
  sources: SourceInfo[];
  onChange: (mapping: MappingState, concepts: string[]) => void;
}

const defaultConcepts = ["RUT", "Nombre", "Institución", "Región"];
const IGNORE_COLUMN = "__IGNORE__";

export const MappingTable: React.FC<MappingTableProps> = ({ sources, onChange }) => {
  const [concepts, setConcepts] = useState<string[]>(defaultConcepts);
  const [newConcept, setNewConcept] = useState('');
  const [mapping, setMapping] = useState<MappingState>({});

  useEffect(() => {
    // Auto-map based on header names when sources change
    const newMapping = { ...mapping };
    let mappingChanged = false;
    sources.forEach(source => {
      if (!newMapping[source.uploadId]) {
        newMapping[source.uploadId] = {};
        source.headers.forEach(header => {
          const matchingConcept = concepts.find(c => c.toLowerCase() === header.toLowerCase().replace(/_/g, ' '));
          newMapping[source.uploadId][header] = matchingConcept || IGNORE_COLUMN;
          mappingChanged = true;
        });
      }
    });
    if (mappingChanged) {
      setMapping(newMapping);
    }
  }, [sources, concepts]);

  useEffect(() => {
    const activeConcepts = concepts.filter(c => {
        return Object.values(mapping).some(sourceMapping => 
            Object.values(sourceMapping).includes(c)
        );
    });
    // Fire onChange whenever mapping or concepts change
    onChange(mapping, activeConcepts.length > 0 ? activeConcepts : concepts);
  }, [mapping, concepts, onChange]);

  const handleMappingChange = (uploadId: string, header: string, concept: string) => {
    setMapping(prev => ({
      ...prev,
      [uploadId]: {
        ...prev[uploadId],
        [header]: concept,
      },
    }));
  };

  const handleAddConcept = () => {
    const trimmed = newConcept.trim();
    if (trimmed && !concepts.includes(trimmed)) {
      setConcepts(prev => [...prev, trimmed]);
      setNewConcept('');
    }
  };

  const handleRemoveConcept = (conceptToRemove: string) => {
    setConcepts(prev => prev.filter(c => c !== conceptToRemove));
    // Also update mapping to ignore columns that used this concept
    setMapping(prev => {
        const newMapping = { ...prev };
        for (const uploadId in newMapping) {
            for (const header in newMapping[uploadId]) {
                if (newMapping[uploadId][header] === conceptToRemove) {
                    newMapping[uploadId][header] = IGNORE_COLUMN;
                }
            }
        }
        return newMapping;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Conceptos (Campos Finales)</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {concepts.map(concept => (
            <div key={concept} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
              <span>{concept}</span>
              <button onClick={() => handleRemoveConcept(concept)} className="ml-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newConcept}
            onChange={e => setNewConcept(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddConcept()}
            placeholder="Nuevo concepto (ej: 'Sueldo Bruto')"
            className="flex-grow bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button onClick={handleAddConcept} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="w-5 h-5 mr-1"/> Agregar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Mapeo de Columnas</h3>
        {sources.map(source => (
          <div key={source.uploadId} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{source.name}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Columna Original</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Concepto (Campo Final)</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {source.headers.map(header => (
                    <tr key={header}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{header}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <select
                          value={mapping[source.uploadId]?.[header] || IGNORE_COLUMN}
                          onChange={e => handleMappingChange(source.uploadId, header, e.target.value)}
                          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value={IGNORE_COLUMN}>(Ignorar esta columna)</option>
                          {concepts.map(concept => (
                            <option key={concept} value={concept}>{concept}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

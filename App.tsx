
import React, { useState, useCallback } from 'react';
import type {
  SourceInfo,
  MappingState,
  Row,
  CleaningStats,
  UploadSuccessData,
  TemplateSchema,
  CleaningConfig,
  CleanRuleType
} from './types';
import { UploadArea } from './components/project/UploadArea';
import { MappingTable } from './components/project/MappingTable';
import { ResultsPreview } from './components/project/ResultsPreview';

// Mock API calls to business logic
import { consolidateSources } from './lib/datacleaner/consolidate';
import { cleanRows } from './lib/datacleaner/clean';

const Step: React.FC<{ number: number; title: string; children: React.ReactNode; active: boolean }> = ({ number, title, children, active }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-opacity ${active ? 'opacity-100' : 'opacity-50'}`}>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">{number}</span>
            {title}
        </h2>
        {children}
    </div>
);

const App: React.FC = () => {
  // Hardcoded for MVP
  const projectId = "demo-project-123";

  // STATE
  const [sources, setSources] = useState<SourceInfo[]>([]);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [mapping, setMapping] = useState<MappingState>({});
  
  const [consolidatedFields, setConsolidatedFields] = useState<string[]>([]);
  const [consolidatedRows, setConsolidatedRows] = useState<Row[]>([]);
  const [cleanedRows, setCleanedRows] = useState<Row[]>([]);
  const [cleanStats, setCleanStats] = useState<CleaningStats | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // HANDLERS
  const handleUploadSuccess = useCallback((uploadData: UploadSuccessData) => {
    const newSource: SourceInfo = {
      uploadId: uploadData.uploadId,
      name: uploadData.filename,
      headers: uploadData.headers,
      rows: uploadData.rows,
    };
    setSources(prev => [...prev, newSource]);
    setCleanedRows([]); // Reset results on new upload
    setCleanStats(null);
  }, []);

  const handleMappingChange = useCallback((newMapping: MappingState, newConcepts: string[]) => {
    setMapping(newMapping);
    setConcepts(newConcepts);
  }, []);

  const handleProcessData = async () => {
    if (sources.length === 0) {
      setError("Por favor, sube al menos un archivo CSV.");
      return;
    }
    if (concepts.length === 0) {
      setError("Por favor, define al menos un concepto para el mapeo.");
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      // 1. Consolidate
      const templateSchema: TemplateSchema = {
        fields: concepts,
        mappings: mapping,
      };
      
      const consolidationResult = consolidateSources(sources, templateSchema);
      setConsolidatedFields(consolidationResult.fields);
      setConsolidatedRows(consolidationResult.rows);

      // 2. Clean (with automatic config for MVP)
      const cleaningConfig: CleaningConfig = {
        columnRules: consolidationResult.fields.map(field => {
            const rules: CleanRuleType[] = ['trim', 'normalizeWhitespace'];
            const lowerField = field.toLowerCase();
            if (lowerField.includes('rut') || lowerField.includes('run')) {
                rules.push('normalizeRut');
            }
            if (lowerField.includes('nombre')) {
                rules.push('toTitleCase');
            }
            if (lowerField.includes('region')) {
                rules.push('normalizeRegion');
            }
            return { column: field, rules };
        })
      };
      
      const cleaningResult = cleanRows(consolidationResult.rows, cleaningConfig);
      setCleanedRows(cleaningResult.rows);
      setCleanStats(cleaningResult.stats);

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Ocurrió un error desconocido.");
    } finally {
      setIsRunning(false);
    }
  };

  const isReadyToMap = sources.length > 0;
  const isReadyToProcess = isReadyToMap && concepts.length > 0;

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DataCleaner <span className="text-sm font-normal text-blue-500">MVP</span></h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Proyecto: {projectId}</p>
            </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
                <Step number={1} title="Subir archivos CSV" active={true}>
                    <UploadArea projectId={projectId} onUploadSuccess={handleUploadSuccess} />
                </Step>

                <Step number={2} title="Definir conceptos y mapeo" active={isReadyToMap}>
                    {isReadyToMap ? (
                        <MappingTable sources={sources} onChange={handleMappingChange} />
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Sube al menos un archivo para comenzar el mapeo.</p>
                    )}
                </Step>
                
                <Step number={3} title="Consolidar y Limpiar" active={isReadyToProcess}>
                   <div className="flex flex-col items-start">
                     <button
                        onClick={handleProcessData}
                        disabled={!isReadyToProcess || isRunning}
                        className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                     >
                        {isRunning ? 'Procesando...' : 'Consolidar y Limpiar Datos'}
                     </button>
                     {!isReadyToProcess && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Completa los pasos anteriores para habilitar esta opción.</p>}
                     {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>}
                   </div>
                </Step>

                {cleanedRows.length > 0 && (
                    <Step number={4} title="Previsualizar y Descargar" active={true}>
                        <ResultsPreview
                          fields={consolidatedFields}
                          rows={cleanedRows}
                          stats={cleanStats}
                        />
                    </Step>
                )}
            </div>
        </main>
    </div>
  );
};

export default App;

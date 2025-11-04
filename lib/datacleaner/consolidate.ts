
import type { Row, Source, TemplateSchema, ConsolidationResult, ConsolidationStats } from '../../types';

export function consolidateSources(
  sources: Source[],
  template: TemplateSchema
): ConsolidationResult {
  const consolidatedRows: Row[] = [];
  const rowsPerSource: ConsolidationStats['rowsPerSource'] = [];
  let totalRows = 0;

  const reverseMappings: { [uploadId: string]: { [targetField: string]: string } } = {};

  for (const uploadId in template.mappings) {
    reverseMappings[uploadId] = {};
    for (const originalHeader in template.mappings[uploadId]) {
      const targetField = template.mappings[uploadId][originalHeader];
      if (targetField) {
          reverseMappings[uploadId][targetField] = originalHeader;
      }
    }
  }
  
  for (const source of sources) {
    let sourceRowCount = 0;
    for (const originalRow of source.rows) {
      const newRow: Row = {};
      for (const targetField of template.fields) {
        const originalHeader = reverseMappings[source.uploadId]?.[targetField];
        if (originalHeader && originalRow[originalHeader] !== undefined) {
          newRow[targetField] = originalRow[originalHeader];
        } else {
          newRow[targetField] = ''; // Default to empty string if no mapping or value
        }
      }
      consolidatedRows.push(newRow);
      sourceRowCount++;
    }
    rowsPerSource.push({
      uploadId: source.uploadId,
      name: source.name,
      rows: sourceRowCount,
    });
    totalRows += sourceRowCount;
  }

  const stats: ConsolidationStats = {
    totalSources: sources.length,
    totalRows: totalRows,
    rowsPerSource: rowsPerSource,
  };

  return {
    fields: template.fields,
    rows: consolidatedRows,
    stats: stats,
  };
}

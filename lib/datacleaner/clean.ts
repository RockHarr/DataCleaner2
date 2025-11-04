
import type { Row, CleaningConfig, CleaningResult, CleanRuleType } from '../../types';
import { REGION_MAP } from '../../constants';

// --- Helper Cleaning Functions ---

const toTitleCase = (str: string): string =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );

const removeAccents = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const normalizeRut = (str: string): string => {
  // TODO: Add full validation logic
  let cleanRut = str.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleanRut.length < 2) return str; // Not a valid RUT, return original
  
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  
  if (!/^\d+$/.test(body) || !/^[0-9K]$/.test(dv)) {
      return str; // Invalid characters, return original
  }

  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${dv}`;
};

const normalizeRegion = (str: string): string => {
    const cleanedStr = removeAccents(str).trim().toUpperCase();
    return REGION_MAP[cleanedStr] || toTitleCase(str.trim());
};


const applyRule = (value: any, rule: CleanRuleType): string => {
    let str = String(value ?? '').trim();

    switch (rule) {
        case 'trim':
            return str; // Already trimmed above
        case 'normalizeWhitespace':
            return str.replace(/\s+/g, ' ');
        case 'toUpper':
            return str.toUpperCase();
        case 'toLower':
            return str.toLowerCase();
        case 'toTitleCase':
            return toTitleCase(str);
        case 'removeAccents':
            return removeAccents(str);
        case 'normalizeRut':
            return normalizeRut(str);
        case 'normalizeRegion':
            return normalizeRegion(str);
        default:
            return str;
    }
};

// --- Main Cleaning Function ---

export function cleanRows(
  rows: Row[],
  config: CleaningConfig
): CleaningResult {
    const cleanedRows: Row[] = [];
    const columnsProcessed = config.columnRules.map(cr => cr.column);

    for (const row of rows) {
        const newRow = { ...row };
        for (const colRule of config.columnRules) {
            const { column, rules } = colRule;
            if (newRow[column] !== undefined) {
                let value = newRow[column];
                for (const rule of rules) {
                    value = applyRule(value, rule);
                }
                newRow[column] = value;
            }
        }
        cleanedRows.push(newRow);
    }
    
    const stats = {
        totalRows: rows.length,
        columnsProcessed: [...new Set(columnsProcessed)],
    };

    return {
        rows: cleanedRows,
        stats: stats,
    };
}

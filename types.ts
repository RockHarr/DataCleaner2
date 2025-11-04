
// Shared row type
export type Row = Record<string, string | number | null | undefined>;

// --- CONSOLIDATION TYPES ---

export interface Source {
  uploadId: string;
  name: string;
  headers: string[];
  rows: Row[];
}

export interface TemplateSchema {
  fields: string[];
  mappings: {
    [uploadId: string]: {
      [originalHeader: string]: string; // e.g. "RUN" -> "RUT"
    };
  };
}

export interface ConsolidationStats {
  totalSources: number;
  totalRows: number;
  rowsPerSource: {
    uploadId: string;
    name: string;
    rows: number;
  }[];
}

export interface ConsolidationResult {
  fields: string[];
  rows: Row[];
  stats: ConsolidationStats;
}

// --- CLEANING TYPES ---

export type CleanRuleType =
  | 'trim'
  | 'normalizeWhitespace'
  | 'toUpper'
  | 'toLower'
  | 'toTitleCase'
  | 'normalizeRut'
  | 'normalizeRegion'
  | 'removeAccents';

export interface ColumnRule {
  column: string;
  rules: CleanRuleType[];
}

export interface CleaningConfig {
  columnRules: ColumnRule[];
}

export interface CleaningStats {
  totalRows: number;
  columnsProcessed: string[];
}

export interface CleaningResult {
  rows: Row[];
  stats: CleaningStats;
}


// --- UI Component & State Types ---

export interface UploadSuccessData {
  uploadId: string;
  filename: string;
  headers: string[];
  rowsCount: number;
  rows: Row[];
}

export type MappingState = {
  [uploadId: string]: {
    [originalHeader: string]: string;
  };
};

export interface SourceInfo {
  uploadId: string;
  name: string;
  headers: string[];
  rows: Row[];
};

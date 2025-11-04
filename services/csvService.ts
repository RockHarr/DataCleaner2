
import type { Row } from '../types';

declare const Papa: any;

export const parseCsv = (file: File): Promise<{ headers: string[]; rows: Row[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (results: any) => {
        if (results.errors.length > 0) {
          console.error("Errors parsing CSV:", results.errors);
          reject(new Error("Error al procesar el archivo CSV."));
        }
        const headers: string[] = results.meta.fields || [];
        const rows: Row[] = results.data;
        resolve({ headers, rows });
      },
      error: (error: any) => {
        console.error("PapaParse error:", error);
        reject(error);
      },
    });
  });
};

export const unparseCsv = (fields: string[], data: Row[]): string => {
  return Papa.unparse({
      fields,
      data,
  }, {
      quotes: true,
      delimiter: ",",
      newline: "\r\n"
  });
};

export const downloadCsv = (filename: string, csvString: string) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { 
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

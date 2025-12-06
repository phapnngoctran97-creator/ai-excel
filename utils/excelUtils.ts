import * as XLSX from 'xlsx';
import { FormulaItem, SheetData } from '../types';

export const parseExcelFile = async (file: File): Promise<SheetData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const result: SheetData[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const formulas: FormulaItem[] = [];
          
          // Iterate over keys to find cells with formulas
          Object.keys(sheet).forEach((key) => {
            if (key.startsWith('!')) return; // Skip metadata
            
            const cell = sheet[key];
            // Check if cell has a formula (property 'f')
            if (cell && cell.f) {
              formulas.push({
                formula: `=${cell.f}`,
                location: `${sheetName}!${key}`,
                frequency: 1
              });
            }
          });

          // Aggregate frequency for duplicate formulas to save tokens
          const uniqueFormulasMap = new Map<string, FormulaItem>();
          formulas.forEach(item => {
            if (uniqueFormulasMap.has(item.formula)) {
              const existing = uniqueFormulasMap.get(item.formula)!;
              existing.frequency += 1;
            } else {
              uniqueFormulasMap.set(item.formula, item);
            }
          });

          if (uniqueFormulasMap.size > 0) {
            result.push({
              name: sheetName,
              formulas: Array.from(uniqueFormulasMap.values()).slice(0, 50) // Limit to 50 unique formulas per sheet for token sanity
            });
          }
        });

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export interface FormulaItem {
  formula: string;
  location: string; // e.g., "Sheet1!A1"
  frequency: number;
}

export interface AnalysisSuggestion {
  originalFormula: string;
  issueType: 'Efficiency' | 'Readability' | 'Error' | 'Modernization';
  description: string;
  suggestion: string;
  improvedFormula: string;
  compatibility: string; // e.g., "Excel 2021+, Office 365", "Google Sheets Only", "All Versions"
}

export interface AnalysisResult {
  overallScore: number;
  summary: string;
  suggestions: AnalysisSuggestion[];
  complexityLevel: 'Low' | 'Medium' | 'High';
}

export interface SheetData {
  name: string;
  formulas: FormulaItem[];
}
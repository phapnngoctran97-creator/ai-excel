import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isAnalyzing }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isAnalyzing) return;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const fileName = file.name.toLowerCase();
        // Check for .xlsx, .xls, .csv, and explicitly .xlsx.xlsx
        if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv') || fileName.endsWith('.xlsx.xlsx')) {
          onFileSelect(file);
        } else {
          alert('Vui lòng chỉ tải lên file Excel (.xlsx, .xls, .xlsx.xlsx) hoặc CSV (.csv)');
        }
      }
    },
    [onFileSelect, isAnalyzing]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`relative group border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer
        ${isAnalyzing 
          ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed' 
          : 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-500'}`}
    >
      <input
        type="file"
        accept=".xlsx, .xls, .csv, .xlsx.xlsx"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={handleFileInput}
        disabled={isAnalyzing}
      />
      
      <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center gap-2">
        <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
        <span className="text-slate-300 text-xl">/</span>
        <FileText className="w-8 h-8 text-blue-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        Kéo thả file Excel hoặc CSV vào đây
      </h3>
      <p className="text-sm text-slate-500 max-w-xs">
        Hỗ trợ định dạng .xlsx, .xls, .xlsx.xlsx và .csv
      </p>
    </div>
  );
};
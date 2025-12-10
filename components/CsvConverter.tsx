import React, { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileText, ArrowRight, FileSpreadsheet, Loader2, RefreshCw, X } from 'lucide-react';

export const CsvConverter: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const processFile = (file: File) => {
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls') && !fileName.endsWith('.xlsx.xlsx')) {
      setError('Vui lòng chỉ tải lên file .csv hoặc .xlsx/.xls/.xlsx.xlsx');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: 'binary' });
        setWorkbook(wb);
        setIsProcessing(false);
      } catch (err) {
        console.error(err);
        setError('Đã xảy ra lỗi khi đọc file.');
        setIsProcessing(false);
        setUploadedFile(null);
      }
    };
    reader.onerror = () => {
      setError('Không thể đọc file.');
      setIsProcessing(false);
      setUploadedFile(null);
    };
    reader.readAsBinaryString(file);
  };

  const downloadAsExcel = () => {
    if (!workbook || !uploadedFile) return;
    // Handle replacing extension correctly even with double extension
    const newName = uploadedFile.name.replace(/(\.xlsx\.xlsx|\.xlsx|\.xls|\.csv)$/i, '') + '_converted.xlsx';
    XLSX.writeFile(workbook, newName);
  };

  const downloadAsCsv = () => {
    if (!workbook || !uploadedFile) return;
    const newName = uploadedFile.name.replace(/(\.xlsx\.xlsx|\.xlsx|\.xls|\.csv)$/i, '') + '_converted.csv';
    // Get first sheet
    const ws = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", newName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setUploadedFile(null);
    setWorkbook(null);
    setError(null);
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
           Công Cụ Chuyển Đổi Định Dạng File
        </h2>
        <p className="text-slate-500">
          Chuyển đổi qua lại giữa Excel (.xlsx) và CSV (.csv). Giữ nguyên bảng mã và dữ liệu.
        </p>
      </div>

      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative group border-2 border-dashed border-blue-300 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-500 rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]"
        >
          <input
            type="file"
            accept=".csv, .xlsx, .xls, .xlsx.xlsx"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
          
          {isProcessing ? (
            <div className="flex flex-col items-center animate-pulse">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">Đang xử lý...</h3>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <FileText className="w-8 h-8 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase">CSV</span>
                </div>
                <RefreshCw className="w-6 h-6 text-blue-400" />
                <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-600 block mt-1 uppercase">Excel</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Kéo thả file vào đây
              </h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Chấp nhận file .csv, .xlsx hoặc .xlsx.xlsx
              </p>
              
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-200 flex items-center gap-2 pointer-events-none">
                <Download className="w-4 h-4" /> Chọn File
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in-up">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        {uploadedFile.name.endsWith('.csv') ? (
                            <FileText className="w-6 h-6 text-blue-500" />
                        ) : (
                            <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">{uploadedFile.name}</h3>
                        <p className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                </div>
                <button onClick={reset} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                </button>
            </div>
            
            <div className="p-8">
                <h4 className="text-center text-slate-600 font-medium mb-6">Chọn định dạng muốn tải về:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={downloadAsExcel}
                        className="group relative p-6 bg-white border-2 border-emerald-100 hover:border-emerald-500 rounded-xl transition-all hover:shadow-md flex flex-col items-center text-center"
                    >
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="font-bold text-slate-700 mb-1">Xuất ra Excel (.xlsx)</span>
                        <span className="text-xs text-slate-400">Giữ nguyên định dạng cột</span>
                    </button>

                    <button 
                        onClick={downloadAsCsv}
                        className="group relative p-6 bg-white border-2 border-blue-100 hover:border-blue-500 rounded-xl transition-all hover:shadow-md flex flex-col items-center text-center"
                    >
                         <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-700 mb-1">Xuất ra CSV (.csv)</span>
                        <span className="text-xs text-slate-400">Định dạng văn bản thuần</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center text-sm">
          {error}
        </div>
      )}
      
      {!uploadedFile && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-sm text-slate-600">
            <h4 className="font-bold text-slate-800 mb-2">Tính năng</h4>
            <ul className="list-disc list-inside space-y-1 ml-1">
            <li>Chuyển đổi 2 chiều: CSV ↔ Excel.</li>
            <li>Xử lý lỗi font tiếng Việt (Unicode).</li>
            <li>Xử lý hoàn toàn trên trình duyệt, bảo mật 100%.</li>
            </ul>
        </div>
      )}
    </div>
  );
};
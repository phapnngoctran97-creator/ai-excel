import React, { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileText, ArrowRight, FileSpreadsheet, Loader2 } from 'lucide-react';

export const CsvConverter: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Vui lòng chỉ tải lên file có định dạng .csv');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        // Read CSV
        const workbook = XLSX.read(csvData, { type: 'binary' });
        
        // Write to XLSX and trigger download
        XLSX.writeFile(workbook, `${file.name.replace('.csv', '')}_converted.xlsx`);
        setIsProcessing(false);
      } catch (err) {
        console.error(err);
        setError('Đã xảy ra lỗi khi chuyển đổi file. Vui lòng kiểm tra định dạng CSV.');
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setError('Không thể đọc file.');
      setIsProcessing(false);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
           Công Cụ Chuyển Đổi CSV sang Excel
        </h2>
        <p className="text-slate-500">
          Chuyển đổi file CSV của bạn sang định dạng Excel (.xlsx) chuẩn, giữ nguyên bảng mã tiếng Việt.
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative group border-2 border-dashed border-blue-300 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-500 rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]"
      >
        <input
          type="file"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileUpload}
          disabled={isProcessing}
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Đang xử lý...</h3>
            <p className="text-sm text-slate-500">File Excel của bạn sẽ tự động tải xuống ngay sau đây.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
               <div className="bg-white p-4 rounded-xl shadow-sm">
                 <FileText className="w-8 h-8 text-slate-500" />
                 <span className="text-xs font-bold text-slate-400 block mt-1">CSV</span>
               </div>
               <ArrowRight className="w-6 h-6 text-blue-400" />
               <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                 <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                 <span className="text-xs font-bold text-emerald-600 block mt-1">XLSX</span>
               </div>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Kéo thả file CSV vào đây
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Hoặc nhấp để chọn file từ máy tính. Hỗ trợ bảng mã Unicode/UTF-8.
            </p>
            
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-200 flex items-center gap-2 pointer-events-none">
              <Download className="w-4 h-4" /> Chọn File CSV
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center text-sm">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-sm text-slate-600">
        <h4 className="font-bold text-slate-800 mb-2">Tại sao cần chuyển đổi?</h4>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>File CSV thường bị lỗi font tiếng Việt khi mở trực tiếp bằng Excel.</li>
          <li>Chuyển sang .xlsx giúp bạn giữ định dạng cột, số liệu và áp dụng công thức dễ dàng hơn.</li>
          <li>Công cụ này xử lý hoàn toàn trên trình duyệt, không lưu file của bạn lên server.</li>
        </ul>
      </div>
    </div>
  );
};
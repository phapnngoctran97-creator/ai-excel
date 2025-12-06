import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisResultView } from './components/AnalysisResultView';
import { parseExcelFile } from './utils/excelUtils';
import { analyzeFormulas } from './services/geminiService';
import { AnalysisResult, SheetData } from './types';
import { Layout, FileSpreadsheet, Sparkles, AlertCircle, Link as LinkIcon, Loader2 } from 'lucide-react';

function App() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'gsheet'>('upload');
  const [userContext, setUserContext] = useState('');
  const [sheetLink, setSheetLink] = useState('');

  const handleFileSelect = async (file: File) => {
    setAnalyzing(true);
    setError(null);
    try {
      const sheetData = await parseExcelFile(file);
      if (sheetData.length === 0) {
        throw new Error("Không tìm thấy công thức nào trong file này.");
      }
      const aiResult = await analyzeFormulas(sheetData, userContext);
      setResult(aiResult);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi phân tích file.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGSheetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetLink) return;

    // Simulate analysis for URL input (since we can't fetch private sheets client-side easily without auth)
    // We will tell the user this feature works best if they describe the formulas or download as xlsx.
    // For the purpose of the demo, we will analyze the *context* provided if no file is present, 
    // or guide them to download.
    
    setError("Hiện tại ứng dụng chưa hỗ trợ đọc trực tiếp Link Google Sheet bảo mật. Vui lòng tải xuống dưới dạng .xlsx và tải lên ở tab 'Tải File'.");
    setActiveTab('upload');
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
    setUserContext('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <FileSpreadsheet size={20} />
            </div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">Excel AI Analyst</h1>
          </div>
          <div className="text-sm text-slate-500 font-medium hidden sm:block">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {!result ? (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                Tối ưu hóa bảng tính của bạn <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                  trong vài giây
                </span>
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg">
                Sử dụng AI để phát hiện lỗi, đề xuất hàm hiện đại (XLOOKUP, LAMBDA) và cải thiện hiệu suất file Excel của bạn.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'upload' 
                      ? 'bg-white text-emerald-600 border-b-2 border-emerald-600' 
                      : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <UploadIcon /> Tải File Excel
                </button>
                <button
                  onClick={() => setActiveTab('gsheet')}
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'gsheet' 
                      ? 'bg-white text-emerald-600 border-b-2 border-emerald-600' 
                      : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <LinkIcon size={16} /> Link Google Sheet
                </button>
              </div>

              <div className="p-8">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                {activeTab === 'upload' ? (
                  <div className="space-y-6">
                    <FileUpload onFileSelect={handleFileSelect} isAnalyzing={analyzing} />
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Mô tả thêm (Tùy chọn)
                      </label>
                      <textarea
                        value={userContext}
                        onChange={(e) => setUserContext(e.target.value)}
                        placeholder="Ví dụ: File này dùng để tính lương nhân viên, tôi muốn kiểm tra xem hàm VLOOKUP có thể thay thế bằng gì nhanh hơn không..."
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none h-24"
                        disabled={analyzing}
                      />
                    </div>

                    {analyzing && (
                      <div className="flex flex-col items-center justify-center py-4 text-emerald-600 animate-pulse">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="font-medium text-sm">Đang đọc file và phân tích công thức...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleGSheetSubmit} className="space-y-6 py-8">
                     <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileSpreadsheet size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">Google Sheets</h3>
                        <p className="text-sm text-slate-500 mt-2">
                            Dán link Google Sheet của bạn vào đây. Lưu ý: File cần được đặt quyền truy cập công khai hoặc tải xuống dưới dạng .xlsx để có kết quả tốt nhất.
                        </p>
                    </div>

                    <div>
                      <input
                        type="url"
                        value={sheetLink}
                        onChange={(e) => setSheetLink(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200"
                    >
                      Phân Tích Link
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <FeatureCard 
                icon={<Sparkles className="w-6 h-6 text-purple-500" />}
                title="AI Thông Minh"
                desc="Phát hiện logic phức tạp và đề xuất cách viết gọn gàng hơn."
              />
              <FeatureCard 
                icon={<Layout className="w-6 h-6 text-blue-500" />}
                title="Tối Ưu Hóa"
                desc="Chuyển đổi VLOOKUP/HLOOKUP sang XLOOKUP hoặc INDEX/MATCH."
              />
              <FeatureCard 
                icon={<AlertCircle className="w-6 h-6 text-red-500" />}
                title="Gỡ Lỗi"
                desc="Tìm ra các tham chiếu vòng, lỗi #N/A tiềm ẩn."
              />
            </div>
          </div>
        ) : (
          <AnalysisResultView result={result} onReset={resetAnalysis} />
        )}
      </main>
    </div>
  );
}

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white/60 p-6 rounded-xl border border-slate-100 shadow-sm backdrop-blur-sm">
    <div className="mb-3">{icon}</div>
    <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 leading-snug">{desc}</p>
  </div>
);

export default App;

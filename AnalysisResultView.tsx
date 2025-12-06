import React, { useState } from 'react';
import { AnalysisResult, AnalysisSuggestion } from '../types';
import { CheckCircle, AlertTriangle, Zap, ArrowRight, Activity, Award, Info, Copy, Check } from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const SuggestionCard: React.FC<{ suggestion: AnalysisSuggestion }> = ({ suggestion }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => console.error("Failed to copy:", err));
  };

  const getIcon = () => {
    switch (suggestion.issueType) {
      case 'Error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Efficiency': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Modernization': return <Activity className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getColorClass = () => {
    switch (suggestion.issueType) {
      case 'Error': return 'border-red-100 bg-red-50/50';
      case 'Efficiency': return 'border-amber-100 bg-amber-50/50';
      case 'Modernization': return 'border-blue-100 bg-blue-50/50';
      default: return 'border-slate-100 bg-slate-50';
    }
  };

  return (
    <div className={`p-5 rounded-xl border ${getColorClass()} mb-4 transition-all hover:shadow-md group`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wide opacity-80 mb-1">{suggestion.issueType}</h4>
          </div>
          <p className="text-slate-700 font-medium">{suggestion.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs overflow-x-auto flex flex-col justify-center">
          <div className="text-slate-400 mb-1 font-medium text-[10px] uppercase">Hiện tại</div>
          <code className="text-red-600 font-mono whitespace-nowrap block min-h-[20px]">{suggestion.originalFormula}</code>
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-emerald-200 text-xs relative shadow-sm group/code">
           <div className="flex justify-between items-center mb-1.5">
             <div className="text-emerald-600 font-bold flex items-center gap-1 text-[10px] uppercase">
               Đề xuất <ArrowRight className="w-3 h-3" />
             </div>
             <div className="flex items-center gap-2">
                {suggestion.compatibility && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-500 border border-slate-200 font-medium">
                    <Info className="w-2.5 h-2.5" />
                    {suggestion.compatibility}
                  </span>
                )}
             </div>
           </div>
          
          <div className="relative pr-8">
            <code className="text-emerald-700 font-mono font-medium whitespace-nowrap overflow-x-auto block pb-1">
              {suggestion.improvedFormula}
            </code>
            <button 
              onClick={() => handleCopy(suggestion.improvedFormula)}
              className="absolute right-[-4px] top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 transition-all focus:outline-none"
              title="Copy công thức"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-slate-600 italic border-t border-slate-200/50 pt-2 mt-2 flex items-start gap-2">
        <span className="text-lg leading-none">💡</span>
        <span>{suggestion.suggestion}</span>
      </div>
    </div>
  );
};

const ScoreChart: React.FC<{ score: number; color: string }> = ({ score, color }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-slate-400">/100</span>
      </div>
    </div>
  );
};

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, onReset }) => {
  const scoreColor = result.overallScore >= 80 ? '#059669' : result.overallScore >= 50 ? '#d97706' : '#dc2626';
  
  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold text-slate-800">Tổng Quan Phân Tích</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {result.summary}
          </p>
           <div className="mt-6 flex flex-wrap gap-3">
             <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
               Độ phức tạp: {result.complexityLevel}
             </span>
             <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
               {result.suggestions.length} Đề xuất cải thiện
             </span>
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-slate-500 font-medium mb-2 z-10">Điểm Chất Lượng</h3>
          <ScoreChart score={result.overallScore} color={scoreColor} />
        </div>
      </div>

      {/* Suggestions List */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Chi Tiết Đề Xuất
        </h3>
        {result.suggestions.length > 0 ? (
          <div className="grid gap-4">
            {result.suggestions.map((suggestion, index) => (
              <SuggestionCard key={index} suggestion={suggestion} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <CheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
            <p className="text-slate-500">Tuyệt vời! Không tìm thấy vấn đề đáng kể nào trong các công thức.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-6">
        <button 
          onClick={onReset}
          className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium shadow-lg shadow-slate-200"
        >
          Phân Tích File Khác
        </button>
      </div>
    </div>
  );
};

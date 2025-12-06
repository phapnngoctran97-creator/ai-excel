import React, { useState } from 'react';
import { Search, BookOpen, ChevronRight, Copy, Check, Filter } from 'lucide-react';

interface FunctionDef {
  name: string;
  category: string;
  syntax: string;
  description: string;
  example: string;
  compatibility: 'All' | 'Excel 2019+' | 'Excel 2021+' | 'Excel 365' | 'Google Sheets';
}

const FUNCTION_DATA: FunctionDef[] = [
  // Lookup & Reference
  {
    name: 'VLOOKUP',
    category: 'Tra cứu',
    syntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    description: 'Tìm kiếm một giá trị trong cột đầu tiên của bảng và trả về giá trị trong cùng hàng từ một cột khác.',
    example: '=VLOOKUP(A2, D:E, 2, FALSE)',
    compatibility: 'All'
  },
  {
    name: 'XLOOKUP',
    category: 'Tra cứu',
    syntax: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], ...)',
    description: 'Phiên bản hiện đại của VLOOKUP. Tìm kiếm linh hoạt hơn, không cần đếm cột, hỗ trợ tìm ngược từ dưới lên.',
    example: '=XLOOKUP(A2, D:D, E:E, "Không tìm thấy")',
    compatibility: 'Excel 2021+'
  },
  {
    name: 'INDEX & MATCH',
    category: 'Tra cứu',
    syntax: '=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))',
    description: 'Sự kết hợp mạnh mẽ thay thế VLOOKUP, giúp tra cứu dữ liệu linh hoạt theo cả hai chiều trái/phải mà không bị ảnh hưởng khi chèn cột.',
    example: '=INDEX(B:B, MATCH(E2, A:A, 0))',
    compatibility: 'All'
  },
  
  // Logical
  {
    name: 'IFS',
    category: 'Logic',
    syntax: '=IFS(condition1, value1, [condition2, value2], ...)',
    description: 'Kiểm tra nhiều điều kiện theo thứ tự. Thay thế cho nhiều hàm IF lồng nhau phức tạp.',
    example: '=IFS(A1>=90, "A", A1>=80, "B", A1>=70, "C", TRUE, "F")',
    compatibility: 'Excel 2019+'
  },
  {
    name: 'IFERROR',
    category: 'Logic',
    syntax: '=IFERROR(value, value_if_error)',
    description: 'Trả về một giá trị tùy chỉnh nếu công thức bị lỗi (như #N/A, #DIV/0!), nếu không thì trả về kết quả công thức.',
    example: '=IFERROR(A1/B1, 0)',
    compatibility: 'All'
  },

  // Text
  {
    name: 'TEXTJOIN',
    category: 'Văn bản',
    syntax: '=TEXTJOIN(delimiter, ignore_empty, text1, ...)',
    description: 'Nối danh sách các chuỗi văn bản bằng một dấu phân cách xác định. Tốt hơn CONCATENATE.',
    example: '=TEXTJOIN(", ", TRUE, A1:A10)',
    compatibility: 'Excel 2019+'
  },
  {
    name: 'SPLIT',
    category: 'Văn bản',
    syntax: '=SPLIT(text, delimiter)',
    description: 'Chia văn bản thành các ô riêng biệt dựa trên dấu phân cách.',
    example: '=SPLIT(A1, ",")',
    compatibility: 'Google Sheets'
  },
  
  // Dynamic Arrays / Advanced
  {
    name: 'FILTER',
    category: 'Mảng động',
    syntax: '=FILTER(array, include, [if_empty])',
    description: 'Lọc một vùng dữ liệu dựa trên điều kiện và trả về mảng kết quả động.',
    example: '=FILTER(A2:C20, C2:C20="Hoàn thành")',
    compatibility: 'Excel 365'
  },
  {
    name: 'UNIQUE',
    category: 'Mảng động',
    syntax: '=UNIQUE(array, [by_col], [exactly_once])',
    description: 'Trích xuất danh sách các giá trị duy nhất (không trùng lặp) từ một vùng dữ liệu.',
    example: '=UNIQUE(A2:A100)',
    compatibility: 'Excel 365'
  },
  {
    name: 'QUERY',
    category: 'Nâng cao',
    syntax: '=QUERY(data, query, [headers])',
    description: 'Sử dụng ngôn ngữ truy vấn giống SQL để lọc, sắp xếp và tổng hợp dữ liệu.',
    example: '=QUERY(A1:C10, "SELECT A, SUM(B) WHERE C > 10 GROUP BY A")',
    compatibility: 'Google Sheets'
  },
  {
    name: 'SPARKLINE',
    category: 'Biểu đồ',
    syntax: '=SPARKLINE(data, [options])',
    description: 'Tạo biểu đồ nhỏ gọn ngay trong một ô tính.',
    example: '=SPARKLINE(A1:E1, {"charttype","bar";"color1","blue"})',
    compatibility: 'Google Sheets'
  }
];

const CATEGORIES = ['Tất cả', 'Tra cứu', 'Logic', 'Văn bản', 'Mảng động', 'Nâng cao', 'Biểu đồ'];

export const FunctionLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredFunctions = FUNCTION_DATA.filter(fn => {
    const matchesSearch = fn.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          fn.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Tất cả' || fn.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          Thư Viện Hàm Thông Dụng
        </h2>
        <p className="text-slate-500">Tra cứu nhanh cú pháp và ví dụ của các hàm Excel & Google Sheets phổ biến nhất.</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm"
            placeholder="Tìm kiếm hàm (ví dụ: VLOOKUP, Lọc dữ liệu...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFunctions.map((fn, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {fn.name}
                  {fn.compatibility !== 'All' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      fn.compatibility.includes('Google') 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {fn.compatibility}
                    </span>
                  )}
                </h3>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{fn.category}</span>
              </div>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 min-h-[40px]">{fn.description}</p>
            
            <div className="space-y-3">
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Cú pháp</div>
                <code className="block bg-slate-50 p-2 rounded text-xs text-slate-700 font-mono break-all border border-slate-100">
                  {fn.syntax}
                </code>
              </div>
              
              <div>
                 <div className="flex justify-between items-end mb-1">
                    <div className="text-[10px] uppercase text-emerald-600 font-bold">Ví dụ</div>
                    <button 
                      onClick={() => handleCopy(fn.example, idx)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Copy ví dụ"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                 </div>
                <code className="block bg-emerald-50/50 p-2 rounded text-xs text-emerald-800 font-mono break-all border border-emerald-100/50">
                  {fn.example}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFunctions.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Không tìm thấy hàm nào phù hợp với từ khóa "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
};
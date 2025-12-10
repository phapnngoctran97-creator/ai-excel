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
  // --- Lookup & Reference ---
  {
    name: 'VLOOKUP',
    category: 'Tra cứu',
    syntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    description: 'Tìm kiếm theo cột dọc. Hàm cơ bản nhất để tra cứu dữ liệu.',
    example: '=VLOOKUP(A2, D:E, 2, FALSE)',
    compatibility: 'All'
  },
  {
    name: 'XLOOKUP',
    category: 'Tra cứu',
    syntax: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], ...)',
    description: 'Phiên bản hiện đại của VLOOKUP. Tìm kiếm 2 chiều, không cần đếm cột.',
    example: '=XLOOKUP(A2, D:D, E:E, "Không thấy")',
    compatibility: 'Excel 2021+'
  },
  {
    name: 'INDEX',
    category: 'Tra cứu',
    syntax: '=INDEX(array, row_num, [column_num])',
    description: 'Trả về giá trị tại một ô trong bảng dựa trên số hàng và số cột.',
    example: '=INDEX(A1:C10, 2, 3)',
    compatibility: 'All'
  },
  {
    name: 'MATCH',
    category: 'Tra cứu',
    syntax: '=MATCH(lookup_value, lookup_array, [match_type])',
    description: 'Tìm vị trí (số thứ tự) của một giá trị trong danh sách.',
    example: '=MATCH("Apple", A1:A10, 0)',
    compatibility: 'All'
  },
  {
    name: 'HLOOKUP',
    category: 'Tra cứu',
    syntax: '=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])',
    description: 'Giống VLOOKUP nhưng tìm kiếm theo hàng ngang.',
    example: '=HLOOKUP("Total", A1:Z10, 10, FALSE)',
    compatibility: 'All'
  },
  {
    name: 'OFFSET',
    category: 'Tra cứu',
    syntax: '=OFFSET(reference, rows, cols, [height], [width])',
    description: 'Trả về một tham chiếu vùng cách ô gốc một số hàng/cột nhất định.',
    example: '=OFFSET(A1, 1, 2)',
    compatibility: 'All'
  },
  {
    name: 'INDIRECT',
    category: 'Tra cứu',
    syntax: '=INDIRECT(ref_text, [a1])',
    description: 'Chuyển đổi một chuỗi văn bản thành một tham chiếu ô thực sự.',
    example: '=INDIRECT("Sheet2!A1")',
    compatibility: 'All'
  },
  {
    name: 'TRANSPOSE',
    category: 'Tra cứu',
    syntax: '=TRANSPOSE(array)',
    description: 'Chuyển đổi vùng dữ liệu dọc thành ngang và ngược lại.',
    example: '=TRANSPOSE(A1:A10)',
    compatibility: 'All'
  },

  // --- Logical ---
  {
    name: 'IF',
    category: 'Logic',
    syntax: '=IF(logical_test, value_if_true, value_if_false)',
    description: 'Kiểm tra một điều kiện, trả về một giá trị nếu đúng và giá trị khác nếu sai.',
    example: '=IF(A1>10, "Lớn", "Nhỏ")',
    compatibility: 'All'
  },
  {
    name: 'IFS',
    category: 'Logic',
    syntax: '=IFS(condition1, value1, [condition2, value2], ...)',
    description: 'Kiểm tra nhiều điều kiện theo thứ tự. Gọn hơn IF lồng.',
    example: '=IFS(A1>=90, "A", A1>=80, "B", TRUE, "C")',
    compatibility: 'Excel 2019+'
  },
  {
    name: 'IFERROR',
    category: 'Logic',
    syntax: '=IFERROR(value, value_if_error)',
    description: 'Bắt lỗi (như #N/A, #DIV/0!). Nếu lỗi thì trả về giá trị thay thế.',
    example: '=IFERROR(A1/B1, 0)',
    compatibility: 'All'
  },
  {
    name: 'AND',
    category: 'Logic',
    syntax: '=AND(logical1, [logical2], ...)',
    description: 'Trả về TRUE nếu tất cả các điều kiện đều đúng.',
    example: '=IF(AND(A1>0, B1>0), "Dương", "Sai")',
    compatibility: 'All'
  },
  {
    name: 'OR',
    category: 'Logic',
    syntax: '=OR(logical1, [logical2], ...)',
    description: 'Trả về TRUE nếu có ít nhất một điều kiện đúng.',
    example: '=IF(OR(A1="Red", A1="Blue"), "Màu", "Khác")',
    compatibility: 'All'
  },
  {
    name: 'NOT',
    category: 'Logic',
    syntax: '=NOT(logical)',
    description: 'Đảo ngược giá trị logic (TRUE thành FALSE và ngược lại).',
    example: '=NOT(A1=10)',
    compatibility: 'All'
  },
  {
    name: 'SWITCH',
    category: 'Logic',
    syntax: '=SWITCH(expression, val1, result1, [default])',
    description: 'So sánh một biểu thức với danh sách giá trị và trả về kết quả tương ứng.',
    example: '=SWITCH(A1, 1, "CN", 2, "T2", "Ngày khác")',
    compatibility: 'Excel 2019+'
  },

  // --- Text ---
  {
    name: 'LEFT',
    category: 'Văn bản',
    syntax: '=LEFT(text, [num_chars])',
    description: 'Lấy các ký tự bên trái của chuỗi.',
    example: '=LEFT("Excel", 2)',
    compatibility: 'All'
  },
  {
    name: 'RIGHT',
    category: 'Văn bản',
    syntax: '=RIGHT(text, [num_chars])',
    description: 'Lấy các ký tự bên phải của chuỗi.',
    example: '=RIGHT("A001", 3)',
    compatibility: 'All'
  },
  {
    name: 'MID',
    category: 'Văn bản',
    syntax: '=MID(text, start_num, num_chars)',
    description: 'Lấy các ký tự ở giữa chuỗi.',
    example: '=MID("2024-ABC", 6, 3)',
    compatibility: 'All'
  },
  {
    name: 'LEN',
    category: 'Văn bản',
    syntax: '=LEN(text)',
    description: 'Đếm số lượng ký tự trong chuỗi.',
    example: '=LEN(A1)',
    compatibility: 'All'
  },
  {
    name: 'TRIM',
    category: 'Văn bản',
    syntax: '=TRIM(text)',
    description: 'Xóa khoảng trắng thừa (chỉ giữ 1 khoảng trắng giữa các từ).',
    example: '=TRIM("  Hello   World  ")',
    compatibility: 'All'
  },
  {
    name: 'TEXTJOIN',
    category: 'Văn bản',
    syntax: '=TEXTJOIN(delimiter, ignore_empty, text1, ...)',
    description: 'Nối chuỗi với dấu phân cách. Bỏ qua ô trống.',
    example: '=TEXTJOIN(", ", TRUE, A1:A10)',
    compatibility: 'Excel 2019+'
  },
  {
    name: 'SUBSTITUTE',
    category: 'Văn bản',
    syntax: '=SUBSTITUTE(text, old_text, new_text)',
    description: 'Thay thế văn bản cũ bằng văn bản mới.',
    example: '=SUBSTITUTE(A1, "-", "/")',
    compatibility: 'All'
  },
  {
    name: 'TEXT',
    category: 'Văn bản',
    syntax: '=TEXT(value, format_text)',
    description: 'Định dạng số hoặc ngày tháng thành văn bản theo mẫu.',
    example: '=TEXT(TODAY(), "dd/mm/yyyy")',
    compatibility: 'All'
  },
  {
    name: 'PROPER',
    category: 'Văn bản',
    syntax: '=PROPER(text)',
    description: 'Viết hoa chữ cái đầu mỗi từ.',
    example: '=PROPER("nguyen van a")',
    compatibility: 'All'
  },

  // --- Math & Stats ---
  {
    name: 'SUMIFS',
    category: 'Toán học',
    syntax: '=SUMIFS(sum_range, criteria_range1, criteria1, ...)',
    description: 'Tính tổng các ô thỏa mãn nhiều điều kiện.',
    example: '=SUMIFS(C:C, A:A, "Nam", B:B, ">20")',
    compatibility: 'All'
  },
  {
    name: 'COUNTIFS',
    category: 'Toán học',
    syntax: '=COUNTIFS(criteria_range1, criteria1, ...)',
    description: 'Đếm số ô thỏa mãn nhiều điều kiện.',
    example: '=COUNTIFS(A:A, "Completed", B:B, ">2023")',
    compatibility: 'All'
  },
  {
    name: 'SUBTOTAL',
    category: 'Toán học',
    syntax: '=SUBTOTAL(function_num, ref1)',
    description: 'Tính tổng/trung bình... bỏ qua các ô bị ẩn (Filter).',
    example: '=SUBTOTAL(9, A2:A100)',
    compatibility: 'All'
  },
  {
    name: 'AGGREGATE',
    category: 'Toán học',
    syntax: '=AGGREGATE(func_num, options, array, [k])',
    description: 'Mạnh hơn SUBTOTAL, có thể bỏ qua lỗi #N/A khi tính toán.',
    example: '=AGGREGATE(9, 6, A1:A10)',
    compatibility: 'All'
  },
  {
    name: 'RANDBETWEEN',
    category: 'Toán học',
    syntax: '=RANDBETWEEN(bottom, top)',
    description: 'Tạo số ngẫu nhiên nguyên trong khoảng.',
    example: '=RANDBETWEEN(100, 999)',
    compatibility: 'All'
  },
  {
    name: 'ROUND',
    category: 'Toán học',
    syntax: '=ROUND(number, num_digits)',
    description: 'Làm tròn số đến chữ số thập phân chỉ định.',
    example: '=ROUND(3.14159, 2)',
    compatibility: 'All'
  },

  // --- Date & Time ---
  {
    name: 'TODAY',
    category: 'Ngày tháng',
    syntax: '=TODAY()',
    description: 'Trả về ngày hiện tại.',
    example: '=TODAY()',
    compatibility: 'All'
  },
  {
    name: 'DATEDIF',
    category: 'Ngày tháng',
    syntax: '=DATEDIF(start_date, end_date, unit)',
    description: 'Tính khoảng cách giữa 2 ngày (Năm "y", Tháng "m", Ngày "d").',
    example: '=DATEDIF(A1, B1, "y")',
    compatibility: 'All'
  },
  {
    name: 'EOMONTH',
    category: 'Ngày tháng',
    syntax: '=EOMONTH(start_date, months)',
    description: 'Trả về ngày cuối cùng của tháng sau/trước n tháng.',
    example: '=EOMONTH(TODAY(), 0)',
    compatibility: 'All'
  },
  {
    name: 'EDATE',
    category: 'Ngày tháng',
    syntax: '=EDATE(start_date, months)',
    description: 'Cộng/Trừ số tháng vào một ngày.',
    example: '=EDATE(A1, 3)',
    compatibility: 'All'
  },
  {
    name: 'NETWORKDAYS',
    category: 'Ngày tháng',
    syntax: '=NETWORKDAYS(start_date, end_date, [holidays])',
    description: 'Đếm số ngày làm việc (trừ T7, CN) giữa 2 ngày.',
    example: '=NETWORKDAYS(A1, B1)',
    compatibility: 'All'
  },
  {
    name: 'WORKDAY',
    category: 'Ngày tháng',
    syntax: '=WORKDAY(start_date, days, [holidays])',
    description: 'Trả về ngày làm việc sau n ngày (bỏ qua cuối tuần).',
    example: '=WORKDAY(TODAY(), 5)',
    compatibility: 'All'
  },

  // --- Dynamic Arrays / Modern ---
  {
    name: 'FILTER',
    category: 'Mảng động',
    syntax: '=FILTER(array, include, [if_empty])',
    description: 'Lọc dữ liệu động ra vùng mới.',
    example: '=FILTER(A2:C20, C2:C20="Yes")',
    compatibility: 'Excel 365'
  },
  {
    name: 'UNIQUE',
    category: 'Mảng động',
    syntax: '=UNIQUE(array)',
    description: 'Lấy danh sách giá trị duy nhất.',
    example: '=UNIQUE(A2:A100)',
    compatibility: 'Excel 365'
  },
  {
    name: 'SORT',
    category: 'Mảng động',
    syntax: '=SORT(array, [sort_index], [sort_order])',
    description: 'Sắp xếp dữ liệu động.',
    example: '=SORT(A2:C20, 1, 1)',
    compatibility: 'Excel 365'
  },
  {
    name: 'VSTACK',
    category: 'Mảng động',
    syntax: '=VSTACK(array1, [array2], ...)',
    description: 'Gộp nhiều vùng dữ liệu theo chiều dọc (nối đuôi nhau).',
    example: '=VSTACK(A1:A5, C1:C5)',
    compatibility: 'Excel 365'
  },
  {
    name: 'HSTACK',
    category: 'Mảng động',
    syntax: '=HSTACK(array1, [array2], ...)',
    description: 'Gộp nhiều vùng dữ liệu theo chiều ngang.',
    example: '=HSTACK(A1:A5, B1:B5)',
    compatibility: 'Excel 365'
  },
  {
    name: 'TOCOL',
    category: 'Mảng động',
    syntax: '=TOCOL(array, [ignore])',
    description: 'Chuyển đổi một vùng 2 chiều thành 1 cột duy nhất.',
    example: '=TOCOL(A1:C3)',
    compatibility: 'Excel 365'
  },
  {
    name: 'LET',
    category: 'Nâng cao',
    syntax: '=LET(name1, val1, calculation)',
    description: 'Đặt tên cho biến trong công thức để tính toán nhanh hơn và dễ đọc hơn.',
    example: '=LET(x, 5, x+10)',
    compatibility: 'Excel 2021+'
  },
  {
    name: 'LAMBDA',
    category: 'Nâng cao',
    syntax: '=LAMBDA(parameter, calculation)',
    description: 'Tạo hàm tùy chỉnh của riêng bạn không cần VBA.',
    example: '=LAMBDA(x, x*x)(5)',
    compatibility: 'Excel 365'
  },

  // --- Google Sheets Specific ---
  {
    name: 'QUERY',
    category: 'Nâng cao',
    syntax: '=QUERY(data, query, [headers])',
    description: 'Dùng câu lệnh SQL để lọc dữ liệu. Siêu mạnh mẽ.',
    example: '=QUERY(A1:C, "SELECT A WHERE B > 5")',
    compatibility: 'Google Sheets'
  },
  {
    name: 'IMPORTRANGE',
    category: 'Nâng cao',
    syntax: '=IMPORTRANGE(spreadsheet_url, range_string)',
    description: 'Lấy dữ liệu từ một file Google Sheet khác.',
    example: '=IMPORTRANGE("URL...", "Sheet1!A:Z")',
    compatibility: 'Google Sheets'
  },
  {
    name: 'REGEXEXTRACT',
    category: 'Văn bản',
    syntax: '=REGEXEXTRACT(text, expression)',
    description: 'Trích xuất văn bản bằng biểu thức chính quy (Regex).',
    example: '=REGEXEXTRACT(A1, "\\d+")',
    compatibility: 'Google Sheets'
  },
  {
    name: 'ARRAYFORMULA',
    category: 'Nâng cao',
    syntax: '=ARRAYFORMULA(array_formula)',
    description: 'Áp dụng công thức cho cả mảng (cột) thay vì từng ô.',
    example: '=ARRAYFORMULA(A1:A10 * B1:B10)',
    compatibility: 'Google Sheets'
  },
  {
    name: 'SPARKLINE',
    category: 'Biểu đồ',
    syntax: '=SPARKLINE(data, [options])',
    description: 'Vẽ biểu đồ mini trong ô.',
    example: '=SPARKLINE(A1:A10)',
    compatibility: 'Google Sheets'
  }
];

const CATEGORIES = ['Tất cả', 'Tra cứu', 'Logic', 'Văn bản', 'Toán học', 'Ngày tháng', 'Mảng động', 'Nâng cao', 'Biểu đồ'];

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
          Thư Viện Hàm Thông Dụng ({FUNCTION_DATA.length}+)
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
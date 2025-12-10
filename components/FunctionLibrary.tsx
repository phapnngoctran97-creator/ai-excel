import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Copy, Check, Filter, List } from 'lucide-react';

interface FunctionArg {
  name: string;
  desc: string;
}

interface FunctionDef {
  name: string;
  category: string;
  syntax: string;
  description: string;
  args?: FunctionArg[]; // Detailed arguments explanation
  example: string;
  compatibility: 'All' | 'Excel 2013+' | 'Excel 2019+' | 'Excel 2021+' | 'Excel 365' | 'Google Sheets';
}

// Data source: ~100 common functions with practical descriptions
const FUNCTION_DATA: FunctionDef[] = [
  // --- 1. Toán học & Cơ bản (Basic Math) ---
  {
    name: 'SUM',
    category: 'Cơ bản',
    syntax: '=SUM(number1, [number2], ...)',
    description: 'Tính tổng các con số hoặc vùng dữ liệu.',
    args: [
      { name: 'number1', desc: 'Ô hoặc vùng chọn đầu tiên cần cộng (VD: A1:A10).' },
      { name: 'number2...', desc: 'Các ô hoặc vùng tiếp theo (không bắt buộc).' }
    ],
    example: '=SUM(A1:A10)',
    compatibility: 'All'
  },
  {
    name: 'AVERAGE',
    category: 'Cơ bản',
    syntax: '=AVERAGE(number1, [number2], ...)',
    description: 'Tính trung bình cộng của các số.',
    example: '=AVERAGE(B2:B20)',
    compatibility: 'All'
  },
  {
    name: 'COUNT',
    category: 'Cơ bản',
    syntax: '=COUNT(value1, [value2], ...)',
    description: 'Đếm xem có bao nhiêu ô chứa SỐ trong vùng chọn (bỏ qua chữ).',
    example: '=COUNT(A1:A100)',
    compatibility: 'All'
  },
  {
    name: 'COUNTA',
    category: 'Cơ bản',
    syntax: '=COUNTA(value1, [value2], ...)',
    description: 'Đếm tất cả các ô có dữ liệu (không trống), kể cả số hay chữ.',
    example: '=COUNTA(A1:A100)',
    compatibility: 'All'
  },
  {
    name: 'COUNTBLANK',
    category: 'Cơ bản',
    syntax: '=COUNTBLANK(range)',
    description: 'Đếm số ô trống (rỗng) trong vùng chọn.',
    example: '=COUNTBLANK(A1:A100)',
    compatibility: 'All'
  },
  {
    name: 'MAX',
    category: 'Cơ bản',
    syntax: '=MAX(number1, [number2], ...)',
    description: 'Tìm số lớn nhất trong danh sách.',
    example: '=MAX(D:D)',
    compatibility: 'All'
  },
  {
    name: 'MIN',
    category: 'Cơ bản',
    syntax: '=MIN(number1, [number2], ...)',
    description: 'Tìm số nhỏ nhất trong danh sách.',
    example: '=MIN(D:D)',
    compatibility: 'All'
  },
  {
    name: 'ABS',
    category: 'Toán học',
    syntax: '=ABS(number)',
    description: 'Lấy giá trị tuyệt đối (biến số âm thành số dương).',
    example: '=ABS(-500) -> 500',
    compatibility: 'All'
  },
  {
    name: 'ROUND',
    category: 'Toán học',
    syntax: '=ROUND(number, num_digits)',
    description: 'Làm tròn số theo quy tắc toán học (>=5 lên, <5 xuống).',
    args: [
      { name: 'number', desc: 'Số cần làm tròn.' },
      { name: 'num_digits', desc: 'Số chữ số thập phân muốn giữ lại (0 là làm tròn đến hàng đơn vị).' }
    ],
    example: '=ROUND(3.14159, 2) -> 3.14',
    compatibility: 'All'
  },
  {
    name: 'ROUNDUP',
    category: 'Toán học',
    syntax: '=ROUNDUP(number, num_digits)',
    description: 'Luôn luôn làm tròn LÊN (xa số 0).',
    example: '=ROUNDUP(3.1, 0) -> 4',
    compatibility: 'All'
  },
  {
    name: 'ROUNDDOWN',
    category: 'Toán học',
    syntax: '=ROUNDDOWN(number, num_digits)',
    description: 'Luôn luôn làm tròn XUỐNG (về phía số 0).',
    example: '=ROUNDDOWN(3.9, 0) -> 3',
    compatibility: 'All'
  },
  {
    name: 'INT',
    category: 'Toán học',
    syntax: '=INT(number)',
    description: 'Lấy phần nguyên của một số (làm tròn xuống số nguyên gần nhất).',
    example: '=INT(8.9) -> 8',
    compatibility: 'All'
  },
  {
    name: 'MOD',
    category: 'Toán học',
    syntax: '=MOD(number, divisor)',
    description: 'Lấy số dư của phép chia.',
    example: '=MOD(10, 3) -> 1 (vì 10 chia 3 dư 1)',
    compatibility: 'All'
  },
  {
    name: 'RANDBETWEEN',
    category: 'Toán học',
    syntax: '=RANDBETWEEN(bottom, top)',
    description: 'Random một số nguyên ngẫu nhiên trong khoảng.',
    example: '=RANDBETWEEN(100, 999)',
    compatibility: 'All'
  },
  {
    name: 'SUBTOTAL',
    category: 'Toán học',
    syntax: '=SUBTOTAL(function_num, ref1)',
    description: 'Tính toán (tổng, đếm...) nhưng bỏ qua các hàng bị ẩn bởi Filter.',
    args: [
      { name: 'function_num', desc: 'Mã số hàm (9 là SUM, 1 là AVERAGE...). Thường dùng 9 hoặc 109.' },
      { name: 'ref1', desc: 'Vùng dữ liệu cần tính.' }
    ],
    example: '=SUBTOTAL(9, A2:A100)',
    compatibility: 'All'
  },

  // --- 2. Tra cứu & Tìm kiếm (Lookup) ---
  {
    name: 'VLOOKUP',
    category: 'Tra cứu',
    syntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    description: 'Dò tìm dữ liệu theo cột dọc (từ trái qua phải). Hàm "quốc dân" của dân văn phòng.',
    args: [
      { name: 'lookup_value', desc: 'Giá trị bạn muốn đem đi tìm (VD: Mã nhân viên).' },
      { name: 'table_array', desc: 'Bảng dữ liệu chứa thông tin. Lưu ý: Cột chứa giá trị tìm kiếm PHẢI nằm đầu tiên bên trái của bảng này.' },
      { name: 'col_index_num', desc: 'Số thứ tự của cột chứa kết quả muốn lấy về (đếm từ trái sang phải trong bảng chọn, bắt đầu là 1).' },
      { name: 'range_lookup', desc: 'Nhập 0 (hoặc FALSE) để tìm chính xác tuyệt đối. Nhập 1 (hoặc TRUE) để tìm tương đối.' }
    ],
    example: '=VLOOKUP(A2, D:E, 2, 0)',
    compatibility: 'All'
  },
  {
    name: 'HLOOKUP',
    category: 'Tra cứu',
    syntax: '=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])',
    description: 'Tương tự VLOOKUP nhưng dò tìm theo hàng NGANG.',
    example: '=HLOOKUP("Tháng 1", A1:Z5, 5, 0)',
    compatibility: 'All'
  },
  {
    name: 'INDEX',
    category: 'Tra cứu',
    syntax: '=INDEX(array, row_num, [column_num])',
    description: 'Lấy giá trị tại một tọa độ (hàng, cột) cụ thể trong bảng.',
    args: [
      { name: 'array', desc: 'Vùng dữ liệu.' },
      { name: 'row_num', desc: 'Số thứ tự hàng muốn lấy.' },
      { name: 'col_num', desc: 'Số thứ tự cột muốn lấy.' }
    ],
    example: '=INDEX(A1:C10, 2, 3)',
    compatibility: 'All'
  },
  {
    name: 'MATCH',
    category: 'Tra cứu',
    syntax: '=MATCH(lookup_value, lookup_array, [match_type])',
    description: 'Tìm vị trí (số thứ tự) của một giá trị trong danh sách.',
    args: [
      { name: 'lookup_value', desc: 'Giá trị cần tìm.' },
      { name: 'lookup_array', desc: 'Vùng tìm kiếm (chỉ 1 dòng hoặc 1 cột).' },
      { name: 'match_type', desc: '0 là tìm chính xác (phổ biến nhất).' }
    ],
    example: '=MATCH("Apple", A1:A10, 0) -> Trả về số dòng',
    compatibility: 'All'
  },
  {
    name: 'INDEX + MATCH',
    category: 'Tra cứu',
    syntax: '=INDEX(col_result, MATCH(lookup_val, col_search, 0))',
    description: 'Combo mạnh hơn VLOOKUP: Tìm kiếm linh hoạt, không bắt buộc cột tìm kiếm phải nằm bên trái.',
    example: '=INDEX(B:B, MATCH(A1, C:C, 0))',
    compatibility: 'All'
  },
  {
    name: 'XLOOKUP',
    category: 'Tra cứu',
    syntax: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], ...)',
    description: 'Hàm đời mới thay thế VLOOKUP. Dễ dùng hơn, tìm ngược xuôi đều được, không lo đếm cột.',
    args: [
      { name: 'lookup_value', desc: 'Giá trị cần tìm.' },
      { name: 'lookup_array', desc: 'Cột chứa giá trị tìm kiếm.' },
      { name: 'return_array', desc: 'Cột chứa kết quả muốn lấy.' },
      { name: 'if_not_found', desc: 'Giá trị trả về nếu không tìm thấy (thay thế IFERROR).' }
    ],
    example: '=XLOOKUP(A2, D:D, E:E, "Không thấy")',
    compatibility: 'Excel 2021+'
  },
  {
    name: 'OFFSET',
    category: 'Tra cứu',
    syntax: '=OFFSET(reference, rows, cols, [height], [width])',
    description: 'Dịch chuyển vùng tham chiếu từ điểm xuất phát.',
    example: '=OFFSET(A1, 1, 0) -> Tham chiếu tới A2',
    compatibility: 'All'
  },
  {
    name: 'INDIRECT',
    category: 'Tra cứu',
    syntax: '=INDIRECT(ref_text)',
    description: 'Biến một chuỗi văn bản thành địa chỉ ô thực tế để công thức hiểu.',
    example: '=INDIRECT("Sheet2!A1")',
    compatibility: 'All'
  },

  // --- 3. Logic & Điều kiện ---
  {
    name: 'IF',
    category: 'Logic',
    syntax: '=IF(logical_test, value_if_true, value_if_false)',
    description: 'Hàm điều kiện: Nếu đúng thì trả về cái này, sai thì trả về cái kia.',
    args: [
      { name: 'logical_test', desc: 'Biểu thức so sánh (VD: A1 > 10).' },
      { name: 'value_if_true', desc: 'Kết quả nếu điều kiện ĐÚNG.' },
      { name: 'value_if_false', desc: 'Kết quả nếu điều kiện SAI.' }
    ],
    example: '=IF(A1>=5, "Đậu", "Rớt")',
    compatibility: 'All'
  },
  {
    name: 'IFS',
    category: 'Logic',
    syntax: '=IFS(condition1, value1, [condition2, value2], ...)',
    description: 'Kiểm tra nhiều điều kiện liên tiếp. Khỏi cần lồng nhiều hàm IF vào nhau.',
    example: '=IFS(A1>=8, "Giỏi", A1>=6.5, "Khá", TRUE, "TB")',
    compatibility: 'Excel 2019+'
  },
  {
    name: 'AND',
    category: 'Logic',
    syntax: '=AND(logical1, logical2, ...)',
    description: 'Trả về TRUE nếu TẤT CẢ các điều kiện bên trong đều đúng.',
    example: '=AND(A1>0, B1>0)',
    compatibility: 'All'
  },
  {
    name: 'OR',
    category: 'Logic',
    syntax: '=OR(logical1, logical2, ...)',
    description: 'Trả về TRUE nếu có ÍT NHẤT MỘT điều kiện bên trong đúng.',
    example: '=OR(A1="Hà Nội", A1="TPHCM")',
    compatibility: 'All'
  },
  {
    name: 'IFERROR',
    category: 'Logic',
    syntax: '=IFERROR(value, value_if_error)',
    description: 'Bẫy lỗi: Nếu công thức bị lỗi (#N/A, #DIV/0...) thì trả về giá trị khác thay vì hiện lỗi xấu xí.',
    example: '=IFERROR(A1/B1, 0)',
    compatibility: 'All'
  },
  {
    name: 'SWITCH',
    category: 'Logic',
    syntax: '=SWITCH(expression, val1, res1, [val2, res2], [default])',
    description: 'Giống IF nhưng gọn hơn khi so sánh 1 ô với nhiều giá trị cụ thể.',
    example: '=SWITCH(A1, 1, "Chủ Nhật", 2, "Thứ Hai", "Ngày khác")',
    compatibility: 'Excel 2019+'
  },

  // --- 4. Xử lý Văn bản (Text) ---
  {
    name: 'LEFT',
    category: 'Văn bản',
    syntax: '=LEFT(text, [num_chars])',
    description: 'Cắt lấy ký tự từ phía bên TRÁI chuỗi.',
    example: '=LEFT("Vietnam", 3) -> "Vie"',
    compatibility: 'All'
  },
  {
    name: 'RIGHT',
    category: 'Văn bản',
    syntax: '=RIGHT(text, [num_chars])',
    description: 'Cắt lấy ký tự từ phía bên PHẢI chuỗi.',
    example: '=RIGHT("A001", 3) -> "001"',
    compatibility: 'All'
  },
  {
    name: 'MID',
    category: 'Văn bản',
    syntax: '=MID(text, start_num, num_chars)',
    description: 'Cắt lấy ký tự ở GIỮA chuỗi.',
    args: [
      { name: 'text', desc: 'Chuỗi gốc.' },
      { name: 'start_num', desc: 'Vị trí bắt đầu cắt.' },
      { name: 'num_chars', desc: 'Số lượng ký tự muốn lấy.' }
    ],
    example: '=MID("2024-HCM-01", 6, 3) -> "HCM"',
    compatibility: 'All'
  },
  {
    name: 'LEN',
    category: 'Văn bản',
    syntax: '=LEN(text)',
    description: 'Đếm xem trong ô có bao nhiêu ký tự (bao gồm cả dấu cách).',
    example: '=LEN("Xin chào") -> 8',
    compatibility: 'All'
  },
  {
    name: 'TRIM',
    category: 'Văn bản',
    syntax: '=TRIM(text)',
    description: 'Xóa sạch khoảng trắng thừa ở đầu, cuối và giữa các từ (chỉ giữ lại 1 dấu cách chuẩn).',
    example: '=TRIM("  A   B  ") -> "A B"',
    compatibility: 'All'
  },
  {
    name: 'TEXTJOIN',
    category: 'Văn bản',
    syntax: '=TEXTJOIN(delimiter, ignore_empty, text1, ...)',
    description: 'Nối nhiều ô lại với nhau, chèn thêm dấu phân cách ở giữa. Thông minh hơn hàm CONCATENATE.',
    args: [
      { name: 'delimiter', desc: 'Dấu phân cách (VD: ", " hoặc "-").' },
      { name: 'ignore_empty', desc: 'TRUE để bỏ qua ô trống, FALSE để giữ ô trống.' }
    ],
    example: '=TEXTJOIN(", ", TRUE, A1:A10)',
    compatibility: 'Excel 2019+'
  },
  {
    name: 'SUBSTITUTE',
    category: 'Văn bản',
    syntax: '=SUBSTITUTE(text, old_text, new_text)',
    description: 'Tìm và thay thế văn bản cũ bằng văn bản mới.',
    example: '=SUBSTITUTE("090-123", "-", "") -> "090123"',
    compatibility: 'All'
  },
  {
    name: 'FIND',
    category: 'Văn bản',
    syntax: '=FIND(find_text, within_text)',
    description: 'Tìm vị trí bắt đầu của một từ trong chuỗi (Phân biệt hoa thường).',
    example: '=FIND("@", "email@gmail.com") -> 6',
    compatibility: 'All'
  },
  {
    name: 'SEARCH',
    category: 'Văn bản',
    syntax: '=SEARCH(find_text, within_text)',
    description: 'Giống FIND nhưng KHÔNG phân biệt chữ hoa chữ thường.',
    example: '=SEARCH("a", "Apple") -> 1',
    compatibility: 'All'
  },
  {
    name: 'PROPER',
    category: 'Văn bản',
    syntax: '=PROPER(text)',
    description: 'Viết Hoa Chữ Cái Đầu Mỗi Từ.',
    example: '=PROPER("nguyễn văn a") -> "Nguyễn Văn A"',
    compatibility: 'All'
  },
  {
    name: 'UPPER',
    category: 'Văn bản',
    syntax: '=UPPER(text)',
    description: 'VIẾT HOA TOÀN BỘ.',
    example: '=UPPER("abc") -> "ABC"',
    compatibility: 'All'
  },
  {
    name: 'LOWER',
    category: 'Văn bản',
    syntax: '=LOWER(text)',
    description: 'viết thường toàn bộ.',
    example: '=LOWER("ABC") -> "abc"',
    compatibility: 'All'
  },
  {
    name: 'TEXT',
    category: 'Văn bản',
    syntax: '=TEXT(value, format_text)',
    description: 'Ép số hoặc ngày tháng hiển thị theo định dạng văn bản mong muốn.',
    example: '=TEXT(TODAY(), "dd/mm/yyyy") -> "25/12/2023"',
    compatibility: 'All'
  },

  // --- 5. Ngày tháng & Thời gian (Date & Time) ---
  {
    name: 'TODAY',
    category: 'Ngày tháng',
    syntax: '=TODAY()',
    description: 'Lấy ngày hiện tại của hệ thống. Tự cập nhật mỗi khi mở file.',
    example: '=TODAY()',
    compatibility: 'All'
  },
  {
    name: 'NOW',
    category: 'Ngày tháng',
    syntax: '=NOW()',
    description: 'Lấy ngày và giờ phút giây hiện tại.',
    example: '=NOW()',
    compatibility: 'All'
  },
  {
    name: 'DATE',
    category: 'Ngày tháng',
    syntax: '=DATE(year, month, day)',
    description: 'Tạo ra một ngày hợp lệ từ 3 số rời rạc: năm, tháng, ngày.',
    example: '=DATE(2023, 12, 25)',
    compatibility: 'All'
  },
  {
    name: 'DATEDIF',
    category: 'Ngày tháng',
    syntax: '=DATEDIF(start_date, end_date, unit)',
    description: 'Hàm ẩn (không gợi ý) dùng để tính khoảng cách giữa 2 ngày.',
    args: [
      { name: 'start_date', desc: 'Ngày bắt đầu.' },
      { name: 'end_date', desc: 'Ngày kết thúc.' },
      { name: 'unit', desc: '"y" (năm), "m" (tháng), "d" (ngày).' }
    ],
    example: '=DATEDIF(A1, B1, "y") -> Số năm tuổi',
    compatibility: 'All'
  },
  {
    name: 'EOMONTH',
    category: 'Ngày tháng',
    syntax: '=EOMONTH(start_date, months)',
    description: 'End Of Month: Tìm ngày cuối cùng của tháng.',
    args: [
      { name: 'months', desc: '0 là tháng hiện tại, 1 là tháng sau, -1 là tháng trước.' }
    ],
    example: '=EOMONTH(TODAY(), 0) -> 31/12/2023...',
    compatibility: 'All'
  },
  {
    name: 'EDATE',
    category: 'Ngày tháng',
    syntax: '=EDATE(start_date, months)',
    description: 'Cộng hoặc trừ số tháng vào một ngày.',
    example: '=EDATE(A1, 3) -> Ngày này 3 tháng sau',
    compatibility: 'All'
  },
  {
    name: 'NETWORKDAYS',
    category: 'Ngày tháng',
    syntax: '=NETWORKDAYS(start_date, end_date, [holidays])',
    description: 'Tính số ngày làm việc thực tế (tự động trừ Thứ 7, CN).',
    example: '=NETWORKDAYS(A1, B1)',
    compatibility: 'All'
  },
  {
    name: 'WORKDAY',
    category: 'Ngày tháng',
    syntax: '=WORKDAY(start_date, days, [holidays])',
    description: 'Từ ngày bắt đầu, cộng thêm n ngày làm việc để ra deadline (trừ cuối tuần).',
    example: '=WORKDAY(TODAY(), 5)',
    compatibility: 'All'
  },
  {
    name: 'YEAR',
    category: 'Ngày tháng',
    syntax: '=YEAR(serial_number)',
    description: 'Lấy số Năm từ một ngày.',
    example: '=YEAR(A1) -> 2024',
    compatibility: 'All'
  },
  {
    name: 'MONTH',
    category: 'Ngày tháng',
    syntax: '=MONTH(serial_number)',
    description: 'Lấy số Tháng từ một ngày.',
    example: '=MONTH(A1) -> 12',
    compatibility: 'All'
  },
  {
    name: 'DAY',
    category: 'Ngày tháng',
    syntax: '=DAY(serial_number)',
    description: 'Lấy số Ngày từ một ngày.',
    example: '=DAY(A1) -> 25',
    compatibility: 'All'
  },
  {
    name: 'WEEKDAY',
    category: 'Ngày tháng',
    syntax: '=WEEKDAY(serial_number, [return_type])',
    description: 'Trả về thứ mấy trong tuần (VD: 1 là Chủ nhật, 2 là Thứ 2...).',
    example: '=WEEKDAY(A1, 1)',
    compatibility: 'All'
  },

  // --- 6. Thống kê (Statistics) ---
  {
    name: 'SUMIFS',
    category: 'Thống kê',
    syntax: '=SUMIFS(sum_range, criteria_range1, criteria1, ...)',
    description: 'Tính tổng theo nhiều điều kiện.',
    args: [
      { name: 'sum_range', desc: 'Cột chứa số cần cộng tổng.' },
      { name: 'criteria_range1', desc: 'Cột chứa điều kiện 1.' },
      { name: 'criteria1', desc: 'Điều kiện 1 (VD: "Nam", ">100").' }
    ],
    example: '=SUMIFS(C:C, A:A, "Nam", B:B, ">20")',
    compatibility: 'All'
  },
  {
    name: 'COUNTIFS',
    category: 'Thống kê',
    syntax: '=COUNTIFS(criteria_range1, criteria1, ...)',
    description: 'Đếm số lượng thỏa mãn nhiều điều kiện cùng lúc.',
    example: '=COUNTIFS(A:A, "Hoàn thành", B:B, ">2023")',
    compatibility: 'All'
  },
  {
    name: 'SUMIF',
    category: 'Thống kê',
    syntax: '=SUMIF(range, criteria, [sum_range])',
    description: 'Tính tổng theo 1 điều kiện duy nhất (Phiên bản đơn giản của SUMIFS).',
    example: '=SUMIF(A:A, ">100", B:B)',
    compatibility: 'All'
  },
  {
    name: 'COUNTIF',
    category: 'Thống kê',
    syntax: '=COUNTIF(range, criteria)',
    description: 'Đếm theo 1 điều kiện duy nhất.',
    example: '=COUNTIF(A:A, "Pass")',
    compatibility: 'All'
  },
  {
    name: 'AVERAGEIFS',
    category: 'Thống kê',
    syntax: '=AVERAGEIFS(avg_range, criteria_range1, criteria1, ...)',
    description: 'Tính trung bình cộng theo nhiều điều kiện.',
    example: '=AVERAGEIFS(C:C, A:A, "Nam")',
    compatibility: 'All'
  },
  {
    name: 'LARGE',
    category: 'Thống kê',
    syntax: '=LARGE(array, k)',
    description: 'Tìm số lớn thứ k trong danh sách.',
    example: '=LARGE(A1:A10, 2) -> Số lớn thứ 2',
    compatibility: 'All'
  },
  {
    name: 'SMALL',
    category: 'Thống kê',
    syntax: '=SMALL(array, k)',
    description: 'Tìm số nhỏ thứ k trong danh sách.',
    example: '=SMALL(A1:A10, 1) -> Số nhỏ nhất (giống MIN)',
    compatibility: 'All'
  },
  {
    name: 'RANK',
    category: 'Thống kê',
    syntax: '=RANK(number, ref, [order])',
    description: 'Xếp hạng một số trong danh sách.',
    example: '=RANK(A2, A2:A100, 0)',
    compatibility: 'All'
  },

  // --- 7. Mảng động (Dynamic Arrays - Excel 365/Google Sheets) ---
  {
    name: 'FILTER',
    category: 'Mảng động',
    syntax: '=FILTER(array, include, [if_empty])',
    description: 'Lọc dữ liệu ra một vùng mới mà không cần thao tác Filter thủ công.',
    args: [
      { name: 'array', desc: 'Bảng dữ liệu gốc cần lọc.' },
      { name: 'include', desc: 'Điều kiện lọc (VD: C2:C100 = "Hà Nội").' }
    ],
    example: '=FILTER(A2:C20, C2:C20="Yes")',
    compatibility: 'Excel 365'
  },
  {
    name: 'UNIQUE',
    category: 'Mảng động',
    syntax: '=UNIQUE(array)',
    description: 'Trích xuất danh sách duy nhất, loại bỏ các dòng trùng lặp.',
    example: '=UNIQUE(A2:A100)',
    compatibility: 'Excel 365'
  },
  {
    name: 'SORT',
    category: 'Mảng động',
    syntax: '=SORT(array, [sort_index], [sort_order])',
    description: 'Sắp xếp dữ liệu tự động ra vùng mới.',
    example: '=SORT(A2:C20, 1, 1)',
    compatibility: 'Excel 365'
  },
  {
    name: 'VSTACK',
    category: 'Mảng động',
    syntax: '=VSTACK(array1, [array2], ...)',
    description: 'Gộp nhiều bảng dữ liệu lại với nhau theo chiều dọc (nối đuôi).',
    example: '=VSTACK(Table1, Table2)',
    compatibility: 'Excel 365'
  },
  {
    name: 'HSTACK',
    category: 'Mảng động',
    syntax: '=HSTACK(array1, [array2], ...)',
    description: 'Gộp nhiều bảng dữ liệu lại theo chiều ngang.',
    example: '=HSTACK(ColA, ColB)',
    compatibility: 'Excel 365'
  },
  {
    name: 'SEQUENCE',
    category: 'Mảng động',
    syntax: '=SEQUENCE(rows, [columns], [start], [step])',
    description: 'Tạo nhanh một danh sách số thứ tự.',
    example: '=SEQUENCE(10) -> Tạo ra 1, 2, 3... 10',
    compatibility: 'Excel 365'
  },
  {
    name: 'TOCOL',
    category: 'Mảng động',
    syntax: '=TOCOL(array, [ignore])',
    description: 'Biến bảng 2 chiều thành 1 cột duy nhất.',
    example: '=TOCOL(A1:C3)',
    compatibility: 'Excel 365'
  },
  {
    name: 'TEXTSPLIT',
    category: 'Mảng động',
    syntax: '=TEXTSPLIT(text, col_delimiter, ...)',
    description: 'Tách chuỗi thành nhiều cột dựa vào dấu phân cách (ngược lại với TEXTJOIN).',
    example: '=TEXTSPLIT("A-B-C", "-")',
    compatibility: 'Excel 365'
  },
  {
    name: 'LET',
    category: 'Nâng cao',
    syntax: '=LET(name1, val1, calculation)',
    description: 'Đặt tên cho biến (x, y) để công thức đỡ dài dòng và tính toán nhanh hơn.',
    example: '=LET(gia, 100, thue, 0.1, gia + gia*thue)',
    compatibility: 'Excel 2021+'
  },
  {
    name: 'LAMBDA',
    category: 'Nâng cao',
    syntax: '=LAMBDA(parameter, calculation)',
    description: 'Tự tạo công thức riêng của bạn.',
    compatibility: 'Excel 365',
    example: '=LAMBDA(x, x*2)(5) -> 10'
  },

  // --- 8. Google Sheets Đặc Biệt ---
  {
    name: 'QUERY',
    category: 'Google Sheets',
    syntax: '=QUERY(data, query, [headers])',
    description: 'Siêu hàm của Google Sheets. Dùng câu lệnh kiểu SQL để lọc, sắp xếp, tính toán.',
    example: '=QUERY(A1:C, "SELECT A, SUM(B) WHERE C > 5 GROUP BY A")',
    compatibility: 'Google Sheets'
  },
  {
    name: 'IMPORTRANGE',
    category: 'Google Sheets',
    syntax: '=IMPORTRANGE(spreadsheet_url, range_string)',
    description: 'Lấy dữ liệu từ một file Google Sheet KHÁC về file này.',
    args: [
      { name: 'url', desc: 'Link của file gốc.' },
      { name: 'range', desc: 'Tên sheet và vùng dữ liệu (VD: "Sheet1!A:Z").' }
    ],
    example: '=IMPORTRANGE("https://...", "Data!A:E")',
    compatibility: 'Google Sheets'
  },
  {
    name: 'ARRAYFORMULA',
    category: 'Google Sheets',
    syntax: '=ARRAYFORMULA(array_formula)',
    description: 'Biến hàm thường thành hàm mảng (tính 1 lần cho cả cột). Cực kỳ quan trọng trong Google Sheets.',
    example: '=ARRAYFORMULA(A2:A * B2:B)',
    compatibility: 'Google Sheets'
  },
  {
    name: 'REGEXEXTRACT',
    category: 'Google Sheets',
    syntax: '=REGEXEXTRACT(text, regular_expression)',
    description: 'Trích xuất dữ liệu bằng biểu thức chính quy (Regex). Dành cho cao thủ xử lý chuỗi.',
    example: '=REGEXEXTRACT(A1, "[0-9]+")',
    compatibility: 'Google Sheets'
  },
  {
    name: 'SPLIT',
    category: 'Google Sheets',
    syntax: '=SPLIT(text, delimiter)',
    description: 'Tách chuỗi thành các cột (nhanh hơn Text to Columns).',
    example: '=SPLIT("A,B,C", ",")',
    compatibility: 'Google Sheets'
  },
  {
    name: 'SPARKLINE',
    category: 'Google Sheets',
    syntax: '=SPARKLINE(data, [options])',
    description: 'Vẽ biểu đồ mini nằm gọn trong 1 ô.',
    example: '=SPARKLINE(A1:A10)',
    compatibility: 'Google Sheets'
  },
  {
    name: 'GOOGLEFINANCE',
    category: 'Google Sheets',
    syntax: '=GOOGLEFINANCE(ticker, [attribute], ...)',
    description: 'Lấy dữ liệu chứng khoán, tỷ giá tiền tệ real-time.',
    example: '=GOOGLEFINANCE("USDVND")',
    compatibility: 'Google Sheets'
  },
  {
    name: 'IMAGE',
    category: 'Google Sheets',
    syntax: '=IMAGE(url, [mode])',
    description: 'Chèn hình ảnh từ đường link vào trong ô.',
    example: '=IMAGE("https://example.com/logo.png")',
    compatibility: 'Google Sheets'
  },
  {
    name: 'FLATTEN',
    category: 'Google Sheets',
    syntax: '=FLATTEN(range)',
    description: 'Gộp nhiều cột thành 1 cột duy nhất (tương tự TOCOL).',
    example: '=FLATTEN(A1:C5)',
    compatibility: 'Google Sheets'
  },

  // --- 9. Thông tin (Information) ---
  {
    name: 'ISBLANK',
    category: 'Thông tin',
    syntax: '=ISBLANK(value)',
    description: 'Kiểm tra xem ô có trống không. Trả về TRUE/FALSE.',
    example: '=ISBLANK(A1)',
    compatibility: 'All'
  },
  {
    name: 'ISERROR',
    category: 'Thông tin',
    syntax: '=ISERROR(value)',
    description: 'Kiểm tra xem ô có bị lỗi không (#N/A, #REF...).',
    example: '=ISERROR(A1/0)',
    compatibility: 'All'
  },
  {
    name: 'ISNUMBER',
    category: 'Thông tin',
    syntax: '=ISNUMBER(value)',
    description: 'Kiểm tra xem ô có phải là số không.',
    example: '=ISNUMBER(123) -> TRUE',
    compatibility: 'All'
  },
  {
    name: 'ROW',
    category: 'Thông tin',
    syntax: '=ROW([reference])',
    description: 'Trả về số thứ tự dòng của ô.',
    example: '=ROW(A10) -> 10',
    compatibility: 'All'
  },
  {
    name: 'COLUMN',
    category: 'Thông tin',
    syntax: '=COLUMN([reference])',
    description: 'Trả về số thứ tự cột (A=1, B=2...).',
    example: '=COLUMN(C1) -> 3',
    compatibility: 'All'
  },
  {
    name: 'FORMULATEXT',
    category: 'Thông tin',
    syntax: '=FORMULATEXT(reference)',
    description: 'Hiển thị công thức dưới dạng chuỗi (thay vì hiện kết quả).',
    example: '=FORMULATEXT(A1)',
    compatibility: 'Excel 2013+'
  }
];

const CATEGORIES = ['Tất cả', 'Cơ bản', 'Tra cứu', 'Logic', 'Văn bản', 'Toán học', 'Ngày tháng', 'Thống kê', 'Mảng động', 'Nâng cao', 'Google Sheets', 'Thông tin'];

export const FunctionLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredFunctions = useMemo(() => {
     return FUNCTION_DATA.filter(fn => {
        const matchesSearch = fn.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              fn.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Tất cả' || fn.category === activeCategory;
        return matchesSearch && matchesCategory;
      });
  }, [searchTerm, activeCategory]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          Thư Viện Hàm Tra Cứu ({FUNCTION_DATA.length})
        </h2>
        <p className="text-slate-500">
          Tổng hợp công thức Excel & Google Sheets từ cơ bản đến nâng cao. Giải thích dễ hiểu, áp dụng ngay.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 sticky top-16 z-30 bg-white/90 backdrop-blur-sm py-4 border-b border-slate-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm transition-shadow focus:shadow-md"
            placeholder="Tìm kiếm hàm (ví dụ: VLOOKUP, tính tổng, tách tên...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 transform scale-105' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
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
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 group-hover:text-emerald-700 transition-colors">
                  {fn.name}
                  {fn.compatibility !== 'All' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border align-middle ${
                      fn.compatibility.includes('Google') 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : fn.compatibility.includes('365') 
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {fn.compatibility}
                    </span>
                  )}
                </h3>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{fn.category}</span>
              </div>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed flex-grow">{fn.description}</p>
            
            <div className="space-y-4 mt-auto">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-[10px] uppercase text-slate-400 font-bold mb-1.5 flex items-center gap-1">
                    <List className="w-3 h-3" /> Cấu trúc & Ý nghĩa
                </div>
                <code className="block text-sm text-slate-800 font-mono break-all mb-2 font-semibold">
                  {fn.syntax}
                </code>
                
                {/* Arguments Breakdown */}
                {fn.args && fn.args.length > 0 && (
                    <ul className="space-y-1.5 mt-2 border-t border-slate-200 pt-2">
                        {fn.args.map((arg, argIdx) => (
                            <li key={argIdx} className="text-xs text-slate-600 flex items-start gap-1">
                                <span className="font-mono text-blue-600 font-medium whitespace-nowrap bg-blue-50 px-1 rounded">{arg.name}</span>:
                                <span className="leading-tight">{arg.desc}</span>
                            </li>
                        ))}
                    </ul>
                )}
              </div>
              
              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 relative group/code">
                 <div className="flex justify-between items-center mb-1">
                    <div className="text-[10px] uppercase text-emerald-600 font-bold">Ví dụ thực tế</div>
                 </div>
                <code className="block text-sm text-emerald-800 font-mono break-all pr-6">
                  {fn.example}
                </code>
                <button 
                    onClick={() => handleCopy(fn.example, idx)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-emerald-200/50 text-emerald-400 hover:text-emerald-700 transition-colors"
                    title="Copy ví dụ"
                  >
                    {copiedIndex === idx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFunctions.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700">Không tìm thấy kết quả</h3>
          <p className="text-slate-500 max-w-xs mx-auto mt-2">
            Thử tìm bằng từ khóa khác hoặc kiểm tra chính tả (ví dụ: "VLOOKUP", "tổng", "lọc"...).
          </p>
        </div>
      )}
    </div>
  );
};
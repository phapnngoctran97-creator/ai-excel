import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, SheetData } from "../types";

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.NUMBER,
      description: "Score from 0 to 100 representing the quality of the Excel formulas.",
    },
    complexityLevel: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High"],
      description: "The overall complexity of the spreadsheet logic.",
    },
    summary: {
      type: Type.STRING,
      description: "A short summary paragraph in Vietnamese about the spreadsheet's health.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalFormula: { type: Type.STRING },
          issueType: {
            type: Type.STRING,
            enum: ["Efficiency", "Readability", "Error", "Modernization"],
          },
          description: { type: Type.STRING, description: "Explanation of the issue in Vietnamese." },
          suggestion: { type: Type.STRING, description: "How to fix it in Vietnamese." },
          improvedFormula: { type: Type.STRING, description: "The optimized formula code. MUST be a valid executable Excel/Sheet formula." },
          compatibility: { 
            type: Type.STRING, 
            description: "Specify version required. EX: 'Excel 2019+', 'Office 365', 'Google Sheets Only', 'All Versions'." 
          }
        },
        required: ["originalFormula", "issueType", "description", "suggestion", "improvedFormula", "compatibility"],
      },
    },
  },
  required: ["overallScore", "complexityLevel", "summary", "suggestions"],
};

export const analyzeFormulas = async (data: SheetData[], context?: string, customApiKey?: string): Promise<AnalysisResult> => {
  // Safe access to process.env for browser environments to prevent "process is not defined" crash
  const defaultKey = typeof process !== "undefined" && process.env ? process.env.API_KEY : "";
  const apiKey = customApiKey || defaultKey;

  if (!apiKey) {
    throw new Error("Vui lòng nhập API Key trong phần cài đặt để sử dụng tính năng này.");
  }

  // Initialize AI instance inside the function call to ensure we have the key and avoid top-level runtime errors
  const ai = new GoogleGenAI({ apiKey: apiKey });

  // Construct a prompt with the formulas
  let promptContent = "Phân tích các công thức Excel sau đây. Mục tiêu là tìm ra lỗi sai, hoặc cách viết tối ưu hơn. \n";
  promptContent += "QUAN TRỌNG: Khi đưa ra 'improvedFormula', BẮT BUỘC phải sử dụng ĐÚNG địa chỉ ô/cột từ công thức gốc. KHÔNG ĐƯỢC dùng các từ mô tả như 'table_array', 'range', 'criteria'. Ví dụ: Nếu gốc là =VLOOKUP(A1,B:C,2,0), đề xuất phải là =XLOOKUP(A1,B:B,C:C) chứ KHÔNG phải =XLOOKUP(lookup_value, ...).\n\n";
  
  if (context) {
    promptContent += `Ngữ cảnh bổ sung từ người dùng: ${context}\n\n`;
  }

  data.forEach(sheet => {
    promptContent += `Sheet: ${sheet.name}\n`;
    sheet.formulas.forEach(f => {
      promptContent += `- Formula: ${f.formula} (Location: ${f.location})\n`;
    });
    promptContent += "\n";
  });

  promptContent += "Hãy đưa ra đánh giá, điểm số và các gợi ý cải thiện cụ thể bằng tiếng Việt.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptContent,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: `Bạn là chuyên gia Excel/Google Sheets hàng đầu (MVP).
        
        NGHIÊM CẤM HALLUCINATION (ẢO GIÁC) & CÚ PHÁP GIẢ:
        1. Tuyệt đối KHÔNG sử dụng placeholder (biến giả). Ví dụ: KHÔNG viết =SUM(range), PHẢI viết =SUM(A1:A10) dựa trên context.
        2. Nếu không xác định được tham chiếu chính xác, hãy giữ nguyên tham chiếu cũ, chỉ thay đổi tên hàm hoặc logic.
        3. Kiểm tra kỹ cú pháp. Ví dụ: DATEDIF trong Excel khác Google Sheets.
        
        NHIỆM VỤ CỦA BẠN:
        Đa dạng hóa đề xuất. Không chỉ sửa lỗi, hãy tìm cơ hội áp dụng các hàm mạnh mẽ sau nếu phù hợp:
        - Logic: IFS, IFERROR, SWITCH.
        - Xử lý chuỗi: TEXTJOIN, TEXTSPLIT (Excel), SPLIT (GSheet).
        - Tra cứu: INDEX/MATCH (cho bản cũ), XLOOKUP (bản mới).
        - Mảng động: FILTER, UNIQUE, SORT (Bọc trong ARRAYFORMULA nếu là Google Sheets).
        - Tính toán: SUMPRODUCT (thay thế công thức mảng cũ).
        
        QUY TẮC TƯƠNG THÍCH VÀ SỬA LỖI (RẤT QUAN TRỌNG):
        1. Người dùng phàn nàn rằng các hàm "hiện đại" không chạy được hoặc lỗi "single cell... matching value could not be found".
           - NGUYÊN NHÂN: Công thức mảng trong Google Sheets chưa được bọc ARRAYFORMULA, hoặc Excel đời cũ không hỗ trợ Dynamic Arrays.
           - GIẢI PHÁP: Nếu đề xuất cho Google Sheets trả về mảng, BẮT BUỘC bọc trong =ARRAYFORMULA(...). Ví dụ: =ARRAYFORMULA(VLOOKUP(...)).
        
        2. Ưu tiên giải pháp an toàn (Excel 2016+, Google Sheets thường) trừ khi người dùng yêu cầu cụ thể các hàm mới.
        
        3. CHỈ dùng XLOOKUP, LET, LAMBDA nếu vấn đề không thể giải quyết bằng hàm thường, HOẶC nếu giải pháp hiện đại tối ưu hơn hẳn.
        
        4. Nếu dùng hàm mới (Excel 365) hoặc hàm riêng của Google Sheets (QUERY, REGEXEXTRACT, ARRAYFORMULA, IMPORTRANGE), bạn BẮT BUỘC phải ghi rõ vào trường 'compatibility'.
        
        Quy tắc phản hồi:
        - Trả lời hoàn toàn bằng tiếng Việt.
        - Giải thích dễ hiểu, ngắn gọn.`
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // Handle API Key errors specifically
    if (error.message?.includes("API key") || error.toString().includes("403")) {
        throw new Error("API Key không hợp lệ hoặc đã hết hạn mức. Vui lòng kiểm tra lại trong phần Cài đặt.");
    }
    throw new Error("Không thể phân tích file vào lúc này. Vui lòng thử lại.");
  }
};
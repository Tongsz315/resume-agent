import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

interface File {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

/**
 * 解析文件（PDF 或 Word）
 */
export async function parseFile(file: File): Promise<string> {
  const { buffer, mimetype, originalname } = file;

  try {
    if (mimetype === 'application/pdf') {
      return await parsePDF(buffer);
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword' ||
      originalname.endsWith('.docx') ||
      originalname.endsWith('.doc')
    ) {
      return await parseWord(buffer);
    } else {
      throw new Error('不支持的文件格式，请上传 PDF 或 Word 文件');
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw error;
  }
}

/**
 * 解析 PDF 文件
 */
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return cleanText(data.text);
  } catch (error) {
    throw new Error('PDF 解析失败，请确保文件未损坏');
  }
}

/**
 * 解析 Word 文件
 */
async function parseWord(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return cleanText(result.value);
  } catch (error) {
    throw new Error('Word 解析失败，请确保文件未损坏');
  }
}

/**
 * 清理文本：移除多余空白、特殊字符
 */
function cleanText(text: string): string {
  return text
    // 移除多余空白字符
    .replace(/\s+/g, ' ')
    // 移除常见的 PDF 解析噪声
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // 规范化换行
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

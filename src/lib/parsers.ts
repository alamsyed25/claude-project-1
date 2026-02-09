import mammoth from 'mammoth'
import type { FileType } from '@/types'
import { countLines } from './utils'

/** Result of parsing a file. */
export interface ParseResult {
  /** Extracted plain-text content. */
  content: string
  /** Total number of lines in the content. */
  lineCount: number
}

/** Error thrown during file parsing. */
export class ParseError extends Error {
  constructor(
    message: string,
    public readonly fileType: FileType,
  ) {
    super(message)
    this.name = 'ParseError'
  }
}

/**
 * Normalizes parsed text output for consistent diffing.
 * - Converts all line endings to \n
 * - Trims trailing whitespace from each line
 * - Collapses 3+ consecutive blank lines down to 2
 * - Trims leading/trailing whitespace from entire content
 */
function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Parses a plain text or markdown file. */
async function parseTextFile(file: File): Promise<ParseResult> {
  try {
    const raw = await file.text()
    const content = normalizeText(raw)
    return { content, lineCount: countLines(content) }
  } catch (error) {
    throw new ParseError(
      `Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'txt',
    )
  }
}

/** Parses a DOCX file using mammoth. */
async function parseDocxFile(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })

    if (!result.value) {
      throw new Error('No text content extracted from DOCX')
    }

    const content = normalizeText(result.value)
    return { content, lineCount: countLines(content) }
  } catch (error) {
    if (error instanceof ParseError) throw error
    throw new ParseError(
      `Failed to parse DOCX file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'docx',
    )
  }
}

/** Parses a PDF file using PDF.js legacy build (dynamically imported for browser-only use). */
async function parsePdfFile(file: File): Promise<ParseResult> {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    const textPages: string[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')

      textPages.push(pageText)
    }

    const raw = textPages.join('\n\n')
    const content = normalizeText(raw)
    return { content, lineCount: countLines(content) }
  } catch (error) {
    if (error instanceof ParseError) throw error
    throw new ParseError(
      `Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'pdf',
    )
  }
}

/** Determines the FileType from a filename. Returns null if unsupported. */
function getFileType(filename: string): FileType | null {
  const extension = filename.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'txt':
      return 'txt'
    case 'md':
      return 'md'
    case 'docx':
      return 'docx'
    case 'pdf':
      return 'pdf'
    default:
      return null
  }
}

/**
 * Main parser function — delegates to format-specific parsers.
 * @param file - File object to parse
 * @returns Parsed content and line count
 * @throws ParseError if parsing fails
 */
export async function parseFile(file: File): Promise<ParseResult> {
  const fileType = getFileType(file.name)

  if (!fileType) {
    throw new ParseError('Unsupported file type', 'txt')
  }

  switch (fileType) {
    case 'txt':
    case 'md':
      return parseTextFile(file)
    case 'docx':
      return parseDocxFile(file)
    case 'pdf':
      return parsePdfFile(file)
  }
}

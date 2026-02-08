/**
 * Formats file size from bytes to a human-readable string.
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.4 MB", "1.2 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

/**
 * Extracts the file extension from a filename.
 * @param filename - Original filename with extension
 * @returns Extension with leading dot, lowercased (e.g., ".txt", ".docx")
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : ''
}

/**
 * Counts the number of lines in a text string.
 * @param text - Text content to count lines in
 * @returns Number of lines (0 for empty string)
 */
export function countLines(text: string): number {
  if (!text) return 0
  return text.split('\n').length
}

/**
 * Generates a UUID v4 using the Web Crypto API.
 * @returns UUID string
 */
export function generateId(): string {
  return crypto.randomUUID()
}

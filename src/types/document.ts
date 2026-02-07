/** Supported file extensions for document upload. */
export type FileType = 'txt' | 'md' | 'docx' | 'pdf'

/** Represents an uploaded document with its parsed content. */
export interface DocumentFile {
  /** Unique identifier (UUID). */
  id: string
  /** Original filename including extension. */
  name: string
  /** Parsed plain-text content of the document. */
  content: string
  /** The file format. */
  fileType: FileType
  /** File size in bytes. */
  size: number
  /** Timestamp when the file was uploaded. */
  uploadedAt: Date
  /** Total number of lines in the parsed content. */
  lineCount: number
}

/** Tracks the current state of a file upload and parse pipeline. */
export type UploadState = 'idle' | 'uploading' | 'parsing' | 'ready' | 'error'

/** Describes an error that occurred during file upload or parsing. */
export interface UploadError {
  /** Machine-readable error code (e.g. "FILE_TOO_LARGE"). */
  code: string
  /** Human-readable error message. */
  message: string
}

/** Identifies which slot a document occupies in a comparison. */
export type FileSlot = 'original' | 'modified'

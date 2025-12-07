/**
 * Utility functions for handling file attachments
 */

/**
 * Format file size in bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

/**
 * Check if file is an image
 */
export const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  return imageExtensions.includes(getFileExtension(fileName));
};

/**
 * Check if file is a PDF
 */
export const isPdfFile = (fileName: string): boolean => {
  return getFileExtension(fileName) === "pdf";
};

/**
 * Get appropriate icon class for file type
 */
export const getFileIcon = (fileName: string): string => {
  if (isImageFile(fileName)) {
    return "ri-image-line";
  }
  if (isPdfFile(fileName)) {
    return "ri-file-pdf-line";
  }
  const ext = getFileExtension(fileName);
  const documentExtensions = ["doc", "docx"];
  const spreadsheetExtensions = ["xls", "xlsx", "csv"];
  const presentationExtensions = ["ppt", "pptx"];
  
  if (documentExtensions.includes(ext)) {
    return "ri-file-word-line";
  }
  if (spreadsheetExtensions.includes(ext)) {
    return "ri-file-excel-line";
  }
  if (presentationExtensions.includes(ext)) {
    return "ri-file-ppt-line";
  }
  return "ri-file-line";
};

/**
 * Get color class for file type icon
 */
export const getFileIconColor = (fileName: string): string => {
  if (isImageFile(fileName)) {
    return "text-info";
  }
  if (isPdfFile(fileName)) {
    return "text-danger";
  }
  const ext = getFileExtension(fileName);
  if (["doc", "docx"].includes(ext)) {
    return "text-primary";
  }
  if (["xls", "xlsx", "csv"].includes(ext)) {
    return "text-success";
  }
  if (["ppt", "pptx"].includes(ext)) {
    return "text-warning";
  }
  return "text-primary";
};


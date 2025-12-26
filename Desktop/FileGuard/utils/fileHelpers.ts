import { FileMetadata } from "../types";
import { HEADER_BYTES_TO_READ } from "../constants";

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const readFileHeaderAsHex = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = (evt) => {
      if (evt.target?.readyState === FileReader.DONE) {
        const arrayBuffer = evt.target.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const hex = Array.from(uint8Array)
          .map(b => b.toString(16).padStart(2, '0'))
          .join(' ')
          .toUpperCase();
        resolve(hex);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    // Only read the first chunk to get magic bytes
    const blob = file.slice(0, HEADER_BYTES_TO_READ);
    reader.readAsArrayBuffer(blob);
  });
};

export const readFileAsBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const readFileAsText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const CODE_EXTENSIONS = [
  'txt', 'md', 'json', 'csv', 'xml', 'html', 'css', 'js', 'jsx', 'ts', 'tsx',
  'py', 'java', 'c', 'cpp', 'h', 'cs', 'go', 'rs', 'php', 'rb', 'sh', 'bat',
  'ps1', 'yaml', 'yml', 'ini', 'cfg', 'conf', 'log'
];

export const isCodeOrTextFile = (file: File): boolean => {
  if (file.type.startsWith('text/')) return true;
  const ext = getFileExtension(file.name);
  return CODE_EXTENSIONS.includes(ext);
};

export const extractFileMetadata = async (file: File): Promise<FileMetadata> => {
  const magicBytes = await readFileHeaderAsHex(file);
  const extension = getFileExtension(file.name);
  
  return {
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    lastModified: file.lastModified,
    extension,
    magicBytes,
  };
};
import React, { useCallback } from 'react';
import { UploadCloud, File, AlertTriangle } from 'lucide-react';
import { formatBytes } from '../utils/fileHelpers';
import { MAX_FILE_SIZE_BYTES } from '../constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  }, [onFileSelect, isLoading]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-12
          transition-all duration-300 ease-in-out
          ${isLoading 
            ? 'border-slate-700 bg-slate-800/30 cursor-not-allowed opacity-50' 
            : 'border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/50 bg-slate-900/50'
          }
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          onChange={handleChange}
          disabled={isLoading}
        />
        
        {/* pointer-events-none ensures clicks pass through to the input behind (or z-indexed above) it */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 pointer-events-none">
          <div className={`
            p-4 rounded-full bg-slate-800/80 border border-slate-700 
            group-hover:scale-110 group-hover:border-emerald-500/30 transition-transform duration-300
          `}>
            {isLoading ? (
               <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
            ) : (
               <UploadCloud className="h-8 w-8 text-emerald-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-slate-200">
              {isLoading ? 'Scanning File...' : 'Drop your file here'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              or click to browse local files
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-500 mt-4">
            <span className="flex items-center">
              <File className="h-3 w-3 mr-1" />
              Max Size: {formatBytes(MAX_FILE_SIZE_BYTES)}
            </span>
            <span className="flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Static Analysis Only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
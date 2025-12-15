'use client';

import { useRef, useState } from 'react';

interface UploadCVProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadCV({ onFileSelect, disabled }: UploadCVProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Veuillez sélectionner un fichier PDF ou JPEG');
        return;
      }
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-blue-500 transition-colors cursor-pointer">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="text-center" onClick={handleClick}>
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {selectedFile ? selectedFile.name : 'Télécharger votre CV'}
        </h3>
        <p className="mt-1 text-xs text-gray-500">PDF ou JPEG</p>
      </div>

      <button
        onClick={handleClick}
        disabled={disabled}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Choisir un fichier
      </button>
    </div>
  );
}
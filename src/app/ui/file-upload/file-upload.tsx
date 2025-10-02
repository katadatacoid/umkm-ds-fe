'use client'

import React, { useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons'; // Import Heroicons X Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface FileUploadProps {
  label: string;
  id: string;
  accept: string;
  maxSize: number;
  errorMessage: string;
  onFileSelect: (file: File | null) => void; // Callback function
}

const FileUpload: React.FC<FileUploadProps> = ({ label, id, accept, maxSize, errorMessage, onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    if (selectedFile) {
      if (selectedFile.size > maxSize) {
        setError('File size exceeds the allowed limit');
        setFile(null);
        setPreviewUrl(null);
        onFileSelect(null); // Reset callback with null
        return;
      }
      if (!accept.includes(selectedFile.type)) {
        setError('Only allowed file types are ' + accept);
        setFile(null);
        setPreviewUrl(null);
        onFileSelect(null); // Reset callback with null
        return;
      }

      setError(null);
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      // Callback to pass the selected file back to parent component
      onFileSelect(selectedFile);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewUrl(null);
    onFileSelect(null); // Reset callback with null
  };

  return (
    <div className="mb-6 flex flex-col relative">
      <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">{label}</label>

      <div className="flex items-center w-full space-x-2"> {/* Flexbox to arrange input and cancel button side by side */}
        <input
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
        />

        {/* If file is selected, show the close icon (X) */}
        {file && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-600 text-xl p-1 hover:bg-gray-200 rounded-full"
          >
            <FontAwesomeIcon icon={faClose} className="h-6 w-6" /> {/* Heroicons close icon */}
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      {previewUrl && (
        <div className="mt-4">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-24 h-24 object-cover border border-gray-300 rounded-md" 
          />
        </div>
      )}
      <small className="text-red-600">{errorMessage}</small>
    </div>
  );
};

export default FileUpload;

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

const ImageUploader = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {file && (
        <p className="text-sm text-gray-600">Archivo seleccionado: {file.name}</p>
      )}
    </div>
  );
};

export default ImageUploader;
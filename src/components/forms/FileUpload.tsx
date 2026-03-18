"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, FileText } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  onFileChange: (file: File | undefined) => void;
}

export default function FileUpload({ label, accept = ".pdf,.jpg,.jpeg,.png", maxSizeMB = 5, onFileChange }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setError("");
    if (f.size > maxSizeMB * 1024 * 1024) {
      setError(`Le fichier ne doit pas dépasser ${maxSizeMB} Mo`);
      return;
    }
    setFile(f);
    onFileChange(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setError("");
    onFileChange(undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <p className="text-sm font-medium text-black mb-2">{label}</p>
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-light rounded-lg p-6 text-center cursor-pointer hover:border-gold transition-colors"
        >
          <UploadCloud className="w-8 h-8 text-gray mx-auto mb-2" />
          <p className="text-sm text-gray">Glissez un fichier ou <span className="text-gold font-medium">parcourir</span></p>
          <p className="text-xs text-gray mt-1">{accept.replace(/\./g, "").toUpperCase()} — Max {maxSizeMB} Mo</p>
          <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-white-off rounded-lg border border-gray-light">
          <FileText className="w-6 h-6 text-gold" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-gray">{(file.size / 1024).toFixed(0)} Ko</p>
          </div>
          <button type="button" onClick={removeFile} className="p-1 hover:bg-gray-light rounded-full">
            <X className="w-4 h-4 text-gray" />
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

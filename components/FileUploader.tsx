import React, { useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface FileUploaderProps {
    onFileSelect: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(Array.from(e.dataTransfer.files));
        }
    }, [onFileSelect]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(Array.from(e.target.files));
        }
    };

    return (
        <div className="flex items-center justify-center w-full">
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full max-w-2xl p-10 glass-panel rounded-2xl transition-all duration-300 group ${
                    isDragging ? 'border-fuchsia-400' : ''
                }`}
            >
                <div className={`absolute -inset-px rounded-2xl border-2 border-transparent transition-all duration-300 ${isDragging ? 'border-fuchsia-400 shadow-[0_0_2rem_-0.5rem_var(--accent-fuchsia)]' : 'group-hover:border-cyan-400/50 animate-pulse group-hover:animate-none'}`}></div>
                <input
                    type="file"
                    id="file-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                />
                <div className="text-center pointer-events-none z-0">
                    <UploadIcon className={`w-16 h-16 mx-auto mb-4 text-slate-500 transition-colors duration-300 ${isDragging ? 'text-fuchsia-400' : 'group-hover:text-cyan-400'}`} />
                    <p className="text-xl font-semibold text-slate-200">
                        <span className={`transition-colors duration-300 ${isDragging ? 'text-fuchsia-300' : 'text-cyan-300'}`}>Click to upload</span> or drag and drop
                    </p>
                    <p className="mt-2 text-sm text-slate-500">Supports multiple images and all major formats</p>
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
import React from 'react';
import { DownloadIcon, ImageIcon } from './Icons';

interface ImageDisplayProps {
    label: string;
    imageUrl?: string;
    fileName?: string;
    fileSize?: number;
    onDownload?: () => void;
    isLoading?: boolean;
    originalSize?: number;
    formatBytes: (bytes: number) => string;
}

const ShimmerLoader: React.FC = () => (
    <div className="absolute inset-0 bg-black/20 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <style>{`
            @keyframes shimmer {
                100% { transform: translateX(100%); }
            }
        `}</style>
    </div>
);

const ImageDisplay: React.FC<ImageDisplayProps> = ({
    label,
    imageUrl,
    fileName,
    fileSize,
    onDownload,
    isLoading = false,
    originalSize,
    formatBytes
}) => {
    const sizeReduction = originalSize && fileSize ? 100 - (fileSize / originalSize) * 100 : null;

    return (
        <div className="p-4 rounded-xl flex flex-col h-full bg-black/20 border border-[var(--border-color)]">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                {label}
                {sizeReduction !== null && sizeReduction > 0 && (
                     <span className="ml-auto text-sm font-medium bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full">
                        -{sizeReduction.toFixed(0)}%
                    </span>
                )}
                 {sizeReduction !== null && sizeReduction < 0 && (
                     <span className="ml-auto text-sm font-medium bg-orange-500/20 text-orange-300 px-2.5 py-1 rounded-full">
                        +{Math.abs(sizeReduction).toFixed(0)}%
                    </span>
                )}
            </h3>
            <div className="flex-grow flex items-center justify-center bg-black/30 rounded-lg min-h-[200px] relative overflow-hidden">
                {isLoading && <ShimmerLoader />}
                {imageUrl ? (
                    <img src={imageUrl} alt={fileName} className="max-w-full max-h-64 object-contain rounded-md transition-opacity duration-300" />
                ) : (
                    <div className="text-center text-slate-500 p-4">
                        {!isLoading && <><ImageIcon className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Awaiting conversion</p></>}
                    </div>
                )}
            </div>
            <div className="mt-4 min-h-[80px] flex flex-col justify-end">
                {fileName && (
                     <p className="text-sm text-slate-300 truncate font-mono" title={fileName}>{fileName}</p>
                )}
                {fileSize !== undefined && (
                     <p className="text-sm text-slate-400 font-bold">{formatBytes(fileSize)}</p>
                )}
                {onDownload && (
                    <button
                        onClick={onDownload}
                        className="w-full mt-2 flex items-center justify-center bg-white/5 text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200"
                    >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImageDisplay;

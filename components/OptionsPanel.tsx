import React from 'react';
import { ConversionOptions, ImageFormat } from '../types';
import Loader from './Loader';
import { NewFileIcon, MagicWandIcon, ArchiveIcon } from './Icons';

interface OptionsPanelProps {
    options: ConversionOptions;
    setOptions: (options: ConversionOptions) => void;
    onConvert: () => void;
    isConverting: boolean;
    onClear: () => void;
    fileCount: number;
    onDownloadAll: () => void;
    isZipping: boolean;
    showDownloadAll: boolean;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({ 
    options, 
    setOptions, 
    onConvert, 
    isConverting, 
    onClear, 
    fileCount,
    onDownloadAll,
    isZipping,
    showDownloadAll
}) => {
    const formats: ImageFormat[] = ['webp', 'jpeg', 'png'];

    return (
        <div className="p-2 h-full flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6">Options</h2>
            
            <div className="space-y-6 flex-grow">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Format</label>
                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-black/20 p-1">
                        {formats.map(format => (
                            <button
                                key={format}
                                onClick={() => setOptions({ ...options, format })}
                                className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 ${
                                    options.format === format ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'
                                }`}
                            >
                                {format.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {options.format !== 'png' && (
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="quality" className="block text-sm font-medium text-slate-400">Quality</label>
                            <span className="text-sm font-mono px-2 py-1 bg-black/20 rounded-md text-cyan-300">{options.quality}</span>
                        </div>
                        <input
                            id="quality"
                            type="range"
                            min="1"
                            max="100"
                            value={options.quality}
                            onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value, 10) })}
                        />
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-color)] space-y-3">
                <button
                    onClick={onConvert}
                    disabled={isConverting}
                    className="w-full flex items-center justify-center bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-400 disabled:bg-cyan-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                >
                    {isConverting ? <><Loader className="mr-2" /> Converting...</> : <> Convert {fileCount > 1 ? `${fileCount} Images` : 'Image'}</>}
                </button>

                {showDownloadAll && (
                     <button
                        onClick={onDownloadAll}
                        disabled={isZipping || isConverting}
                        className="w-full flex items-center justify-center bg-emerald-500/80 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-500/100 disabled:bg-emerald-700/80 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.03] shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500"
                    >
                        {isZipping ? <><Loader className="mr-2" /> Zipping...</> : <><ArchiveIcon className="w-5 h-5 mr-2" /> Download All (.zip)</>}
                    </button>
                )}

                <button 
                    onClick={onClear}
                    className="w-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 py-2 px-4 rounded-lg transition-colors"
                >
                   <NewFileIcon className="w-4 h-4 mr-2" />
                    New Image
                </button>
            </div>
        </div>
    );
};

export default OptionsPanel;
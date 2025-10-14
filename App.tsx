import React, { useState, useCallback, useEffect } from 'react';
// Fix: Import JSZip to resolve 'Cannot find name JSZip' error.
import JSZip from 'jszip';
import { ConversionOptions, ImageDetails, OriginalImageDetails, ImageFormat } from './types';
import FileUploader from './components/FileUploader';
import OptionsPanel from './components/OptionsPanel';
import ImageDisplay from './components/ImageDisplay';
import Alert from './components/Alert';
import WelcomeFeatures from './components/WelcomeFeatures';
import { GithubIcon } from './components/Icons';

const App: React.FC = () => {
    const [originalFiles, setOriginalFiles] = useState<File[]>([]);
    const [originalImages, setOriginalImages] = useState<OriginalImageDetails[]>([]);
    const [convertedImages, setConvertedImages] = useState<(ImageDetails | null)[]>([]);
    const [options, setOptions] = useState<ConversionOptions>({ format: 'webp', quality: 90 });
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [isZipping, setIsZipping] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Clean up object URLs to prevent memory leaks
        return () => {
            originalImages.forEach(img => URL.revokeObjectURL(img.url));
            convertedImages.forEach(img => img && URL.revokeObjectURL(img.url));
        };
    }, [originalImages, convertedImages]);
    
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const handleFileSelect = useCallback((files: File[]) => {
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        if (validFiles.length !== files.length) {
            setError('Some files were not valid image types and were ignored.');
        }
        if (validFiles.length === 0) {
            if (files.length > 0) {
                 setError('No valid image files selected.');
            }
            return;
        }

        // Clean up old state
        originalImages.forEach(img => URL.revokeObjectURL(img.url));
        convertedImages.forEach(img => img && URL.revokeObjectURL(img.url));

        setOriginalFiles(validFiles);
        setOriginalImages(validFiles.map(file => ({
            url: URL.createObjectURL(file),
            size: file.size,
            fileName: file.name
        })));
        setConvertedImages(new Array(validFiles.length).fill(null));
        if (validFiles.length === files.length) {
            setError(null);
        }
    }, [originalImages, convertedImages]);
    
    const convertFile = (file: File, currentOptions: ConversionOptions): Promise<ImageDetails> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) throw new Error('Could not get canvas context.');
                        
                        ctx.drawImage(img, 0, 0);

                        const mimeType = `image/${currentOptions.format}`;
                        const quality = currentOptions.format === 'png' ? undefined : currentOptions.quality / 100;
                        
                        canvas.toBlob((blob) => {
                            if (!blob) {
                               return reject(new Error(`Conversion failed for ${file.name}. The resulting image is empty.`));
                            }
                            const url = URL.createObjectURL(blob);
                            const newFileName = `${file.name.split('.').slice(0, -1).join('.')}.${currentOptions.format}`;
                            resolve({
                                url,
                                size: blob.size,
                                fileName: newFileName,
                                format: currentOptions.format
                            });
                        }, mimeType, quality);
                    } catch(err) {
                        reject(err);
                    }
                };
                img.onerror = () => reject(new Error(`Failed to load the image: ${file.name}. It may be corrupt or in an unsupported format.`));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error(`Failed to read the file: ${file.name}.`));
            reader.readAsDataURL(file);
        });
    };

    const handleConvert = useCallback(async () => {
        if (originalFiles.length === 0) return;

        setIsConverting(true);
        setError(null);
        
        convertedImages.forEach(img => img && URL.revokeObjectURL(img.url));
        setConvertedImages(new Array(originalFiles.length).fill(null));

        try {
            const conversionPromises = originalFiles.map(file => convertFile(file, options));
            const results = await Promise.all(conversionPromises);
            setConvertedImages(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during conversion.');
        } finally {
            setIsConverting(false);
        }
    }, [originalFiles, options, convertedImages]);


    const handleDownload = (image: ImageDetails | OriginalImageDetails) => {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = image.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAll = async () => {
        const validConvertedImages = convertedImages.filter((img): img is ImageDetails => img !== null);
        if (validConvertedImages.length === 0) return;

        setIsZipping(true);
        setError(null);
        
        try {
            const zip = new JSZip();
            const folder = zip.folder("converted-images");
            if (!folder) throw new Error("Could not create a folder in the zip file.");

            const imagePromises = validConvertedImages.map(async (image) => {
                const response = await fetch(image.url);
                const blob = await response.blob();
                folder.file(image.fileName, blob);
            });
            
            await Promise.all(imagePromises);

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipBlob);
            link.download = "converted-images.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

        } catch(err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while creating the zip file.');
        } finally {
            setIsZipping(false);
        }
    };
    
    const handleClear = () => {
        originalImages.forEach(img => URL.revokeObjectURL(img.url));
        convertedImages.forEach(img => img && URL.revokeObjectURL(img.url));
        setOriginalFiles([]);
        setOriginalImages([]);
        setConvertedImages([]);
        setError(null);
    };

    const showDownloadAll = !isConverting && convertedImages.length > 0 && convertedImages.some(img => img !== null);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
            <div className="aurora-bg"></div>
            
            <header className="w-full max-w-7xl mx-auto flex justify-between items-center mb-6 absolute top-0 left-1/2 -translate-x-1/2 p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-transparent bg-clip-text">
                    Pro Image Converter
                </h1>
                 <a href="https://github.com/wagehzaietr" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    <GithubIcon className="w-6 h-6" />
                </a>
            </header>
            
            <main className="w-full max-w-7xl flex-grow flex items-center justify-center mt-20 mb-12">
                 <div className="w-full">
                    {error && <Alert message={error} onClose={() => setError(null)} />}
                    
                    {originalFiles.length === 0 ? (
                        <div className="flex flex-col items-center gap-16 text-center">
                            <div className="w-full max-w-4xl mx-auto">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    The Future of Image Conversion
                                </h2>
                                <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                                    A blazingly fast, secure, and powerful tool to convert your images without compromising quality. Get started by dropping a file below.
                                </p>
                            </div>
                            <FileUploader onFileSelect={handleFileSelect} />
                            <WelcomeFeatures />
                        </div>
                    ) : (
                        <div className="glass-panel rounded-2xl p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                           <style>{`
                                @keyframes fade-in {
                                    from { opacity: 0; transform: translateY(10px); }
                                    to { opacity: 1; transform: translateY(0); }
                                }
                                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                            `}</style>
                            <div className="lg:col-span-3">
                                <OptionsPanel 
                                    options={options} 
                                    setOptions={setOptions} 
                                    onConvert={handleConvert} 
                                    isConverting={isConverting}
                                    onClear={handleClear}
                                    fileCount={originalFiles.length}
                                    onDownloadAll={handleDownloadAll}
                                    isZipping={isZipping}
                                    showDownloadAll={showDownloadAll}
                                />
                            </div>
                            <div className="lg:col-span-9 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
                               <div className="grid grid-cols-1 gap-6">
                                {originalImages.map((originalImage, index) => {
                                    const convertedImage = convertedImages[index];
                                    const isItemConverting = isConverting && !convertedImage;
                                    return (
                                        <div key={originalImage.url} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-black/10 rounded-xl border border-[var(--border-color)]">
                                            <ImageDisplay
                                                label="Original"
                                                imageUrl={originalImage.url}
                                                fileName={originalImage.fileName}
                                                fileSize={originalImage.size}
                                                onDownload={() => handleDownload(originalImage)}
                                                formatBytes={formatBytes}
                                            />
                                            <ImageDisplay
                                                label="Converted"
                                                imageUrl={convertedImage?.url}
                                                fileName={convertedImage?.fileName}
                                                fileSize={convertedImage?.size}
                                                onDownload={convertedImage ? () => handleDownload(convertedImage) : undefined}
                                                isLoading={isItemConverting}
                                                originalSize={originalImage.size}
                                                formatBytes={formatBytes}
                                            />
                                        </div>
                                    )
                                })}
                               </div>
                            </div>
                        </div>
                    )}
                 </div>
            </main>

            <footer className="w-full max-w-7xl mx-auto text-center text-slate-500 text-xs sm:text-sm absolute bottom-0 left-1/2 -translate-x-1/2 pb-4">
                <p>&copy; {new Date().getFullYear()} Pro Image Converter. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
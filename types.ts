export type ImageFormat = 'webp' | 'jpeg' | 'png';

export interface ConversionOptions {
  format: ImageFormat;
  quality: number; // Range: 0-100
}

export interface ImageDetails {
    url: string;
    size: number;
    fileName: string;
    format: ImageFormat;
}

export interface OriginalImageDetails {
    url: string;
    size: number;
    fileName: string;
}
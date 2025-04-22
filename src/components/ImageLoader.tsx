import React from 'react';
import './ImageLoader.css';

interface ImageLoaderProps {
  width?: number;
  height?: number;
  prompt?: string;
}

export function ImageLoader({ width = 640, height = 427, prompt = "lush green leaves"}: ImageLoaderProps) {
  return (
    <div 
      className="image-loader-container"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="loader-rectangle rectangle-1"></div>
      <div className="loader-rectangle rectangle-2"></div>
      <div className="loader-rectangle rectangle-3"></div>
      <div className="loader-rectangle rectangle-4"></div>
      <div className="loader-rectangle rectangle-5"></div>
      <div className="loader-rectangle rectangle-6"></div>
      <div className="loader-content">
        {prompt}
      </div>
    </div>
  );
} 
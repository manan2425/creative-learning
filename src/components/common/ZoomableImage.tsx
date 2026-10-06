'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  children
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1) {
      handleResetZoom();
    } else {
      setScale(2);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={imageContainerRef}
      className={`relative overflow-hidden select-none ${containerClassName}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      title={scale > 1 ? 'Drag to pan • Double click to reset' : 'Double click to zoom in'}
    >
      {/* Zoomed Image */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={`w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${className}`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </div>

      {/* Floating Zoom In / Zoom Out Controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-navy/85 hover:bg-navy backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/20 shadow-lg text-white transition-all">
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={scale <= 1}
          className="p-1 rounded-lg hover:bg-white/20 active:scale-95 transition-all disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          title="Zoom Out (-)"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] font-mono font-bold px-1 min-w-[32px] text-center text-cyan">
          {Math.round(scale * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          disabled={scale >= 3.5}
          className="p-1 rounded-lg hover:bg-white/20 active:scale-95 transition-all disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          title="Zoom In (+)"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {scale > 1 && (
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1 ml-0.5 rounded-lg hover:bg-white/20 active:scale-95 text-amber-400 hover:text-amber-300 transition-all cursor-pointer"
            title="Reset Zoom"
            aria-label="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Embedded Children / Badges */}
      {children}
    </div>
  );
};

"use client";

import { useState } from "react";
import { X,ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageTitle?: string;
}

export function ImageModal({ isOpen, onClose, imageUrl, imageTitle }: ImageModalProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 [&>button]:hidden">
        {/* Custom Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white shadow-md border"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex-1">
            <h3 className="text-lg font-semibold truncate">
              {imageTitle || "Banner图片"}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={resetZoom}>
              重置
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center min-h-[400px] max-h-[calc(90vh-80px)]">
          <div className="p-4">
            <img
              src={imageUrl}
              alt={imageTitle || "Banner"}
              className="max-w-none transition-transform duration-200 cursor-pointer"
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: "center"
              }}
              onClick={resetZoom}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            点击图片重置缩放 • 使用缩放按钮调整大小
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

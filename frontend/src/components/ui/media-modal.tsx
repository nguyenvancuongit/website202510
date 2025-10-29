"use client";

import { useState } from "react";
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaTitle?: string;
  mediaType?: string;
}

export function MediaModal({
  isOpen,
  onClose,
  mediaUrl,
  mediaTitle,
  mediaType = "image",
}: MediaModalProps) {
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const isVideo = mediaType === "video";
  const isImage = mediaType === "image";

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const togglePlay = () => {
    const video = document.querySelector("#media-video") as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = document.querySelector("#media-video") as HTMLVideoElement;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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
              {mediaTitle || `Banner${isVideo ? "视频" : "图片"}`}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {/* Video Controls */}
            {isVideo && (
              <>
                <Button variant="ghost" size="sm" onClick={togglePlay}>
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}

            {/* Zoom Controls (only for images) */}
            {isImage && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Media Container */}
        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center min-h-[400px] max-h-[calc(90vh-80px)]">
          <div className="p-4">
            {isImage && (
              <img
                src={mediaUrl}
                alt={mediaTitle || "Banner"}
                className="max-w-none transition-transform duration-200 cursor-pointer"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
                }}
                onClick={resetZoom}
              />
            )}

            {isVideo && (
              <video
                id="media-video"
                src={mediaUrl}
                className="max-w-full max-h-full"
                controls
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.muted = isMuted;
                }}
              >
                您的浏览器不支持视频播放。
              </video>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            {isImage && "点击图片重置缩放 • 使用缩放按钮调整大小"}
            {isVideo && "使用播放控件控制视频播放"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
